#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MIME_TYPES = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"]
]);

function usage() {
  console.log(`
Importador da galeria Sandra Martins

Uso:
  node scripts/import-gallery.mjs --manifest <arquivo.json> [--apply]

Sem --apply, valida o manifesto e as imagens localmente, sem acessar o Supabase.
Com --apply, valida também categorias e slugs, autentica um admin e importa.
`);
}

function parseArgs(args) {
  const options = { apply: false, manifest: null };
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--help" || args[index] === "-h") return { help: true };
    if (args[index] === "--apply") options.apply = true;
    else if (args[index] === "--manifest") options.manifest = args[++index] ?? null;
    else throw new Error(`Opção desconhecida: ${args[index]}`);
  }
  if (!options.manifest) throw new Error("Informe o arquivo com --manifest.");
  return options;
}

function loadLocalEnv(file) {
  return readFile(file, "utf8").then((contents) => {
    for (const line of contents.split(/\r?\n/)) {
      const match = line.match(/^\s*(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)\s*=\s*(.*)\s*$/);
      if (!match || process.env[match[1]]) continue;
      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[match[1]] = value;
    }
  }).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
}

async function readHiddenPassword() {
  if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
    throw new Error("Abra um terminal interativo para informar a senha com segurança.");
  }

  stdout.write("Senha do admin (não será exibida): ");
  stdin.setRawMode(true);
  stdin.resume();
  let password = "";
  try {
    for await (const chunk of stdin) {
      for (const character of chunk.toString("utf8")) {
        if (character === "\u0003") throw new Error("Operação cancelada.");
        if (character === "\r" || character === "\n") {
          stdout.write("\n");
          return password;
        }
        if (character === "\u007f" || character === "\b") password = password.slice(0, -1);
        else password += character;
      }
    }
  } finally {
    stdin.setRawMode(false);
    stdin.pause();
  }
  throw new Error("Não foi possível ler a senha.");
}

function requiredText(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} é obrigatório.`);
  return value.trim();
}

async function validateManifest(manifestPath) {
  const absoluteManifestPath = path.resolve(manifestPath);
  const manifestDirectory = path.dirname(absoluteManifestPath);
  const manifest = JSON.parse(await readFile(absoluteManifestPath, "utf8"));
  const imageRoot = path.resolve(manifestDirectory, manifest.imageRoot ?? ".");
  const items = manifest.items;

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("O manifesto precisa ter pelo menos uma criação em items.");
  }

  const creationSlugs = new Set();
  const normalizedItems = [];
  let totalBytes = 0;

  for (const [itemIndex, item] of items.entries()) {
    const title = requiredText(item.title, `Criação ${itemIndex + 1}: título`);
    const slug = requiredText(item.slug, `Criação ${itemIndex + 1}: slug`);
    const categorySlug = requiredText(item.categorySlug, `Criação ${itemIndex + 1}: categoria`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Slug inválido: ${slug}`);
    if (creationSlugs.has(slug)) throw new Error(`Slug repetido no manifesto: ${slug}`);
    creationSlugs.add(slug);
    if (typeof item.published !== "undefined" && typeof item.published !== "boolean") {
      throw new Error(`${slug}: published deve ser true ou false.`);
    }
    if (typeof item.featured !== "undefined" && typeof item.featured !== "boolean") {
      throw new Error(`${slug}: featured deve ser true ou false.`);
    }
    if (!Array.isArray(item.images) || item.images.length === 0) {
      throw new Error(`${slug}: adicione pelo menos uma imagem.`);
    }

    let coverCount = 0;
    let requestedCoverIndex = -1;
    const seenImagePaths = new Set();
    const images = [];
    for (const [imageIndex, image] of item.images.entries()) {
      const relativeFile = requiredText(image.file, `${slug}: arquivo da imagem ${imageIndex + 1}`);
      if (seenImagePaths.has(relativeFile)) throw new Error(`${slug}: imagem repetida no manifesto: ${relativeFile}`);
      seenImagePaths.add(relativeFile);
      if (path.isAbsolute(relativeFile)) throw new Error(`${slug}: use caminhos relativos para as imagens.`);
      const absoluteFile = path.resolve(imageRoot, relativeFile);
      const relativeToRoot = path.relative(imageRoot, absoluteFile);
      if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
        throw new Error(`${slug}: imagem fora da pasta imageRoot: ${relativeFile}`);
      }
      const extension = path.extname(absoluteFile).toLowerCase();
      const contentType = MIME_TYPES.get(extension);
      if (!contentType) throw new Error(`${relativeFile}: use JPG, PNG ou WebP.`);
      const fileStat = await stat(absoluteFile);
      if (!fileStat.isFile() || fileStat.size === 0) throw new Error(`${relativeFile}: arquivo vazio ou inválido.`);
      if (fileStat.size > MAX_FILE_BYTES) throw new Error(`${relativeFile}: limite de 8 MB por imagem.`);
      totalBytes += fileStat.size;
      const isCover = image.cover === true;
      if (isCover) {
        coverCount += 1;
        requestedCoverIndex = imageIndex;
      }
      images.push({ absoluteFile, file: relativeFile, contentType, altText: typeof image.altText === "string" ? image.altText.trim() : "", isCover });
    }
    if (coverCount > 1) throw new Error(`${slug}: marque no máximo uma imagem como capa.`);
    images[requestedCoverIndex >= 0 ? requestedCoverIndex : 0].isCover = true;

    normalizedItems.push({
      title,
      slug,
      categorySlug,
      description: typeof item.description === "string" ? item.description.trim() : null,
      featured: item.featured === true,
      published: item.published === true,
      images
    });
  }

  return { imageRoot, items: normalizedItems, totalBytes };
}

async function verifyRemoteItems(supabase, items) {
  const { data: categories, error: categoriesError } = await supabase.from("categories").select("id, slug").eq("is_active", true);
  if (categoriesError) throw new Error(`Não foi possível consultar categorias: ${categoriesError.message}`);
  const categoryIds = new Map((categories ?? []).map((category) => [category.slug, category.id]));
  for (const item of items) {
    if (!categoryIds.has(item.categorySlug)) throw new Error(`Categoria ativa não encontrada: ${item.categorySlug}`);
  }

  const { data: existing, error: creationsError } = await supabase.from("creations").select("slug");
  if (creationsError) throw new Error(`Não foi possível conferir slugs existentes: ${creationsError.message}`);
  const existingSlugs = new Set((existing ?? []).map((creation) => creation.slug));
  for (const item of items) {
    if (existingSlugs.has(item.slug)) throw new Error(`Já existe uma criação com o slug: ${item.slug}`);
  }
  return categoryIds;
}

async function importItems(supabase, categoryIds, items) {
  const { data: lastPosition, error: positionError } = await supabase.from("creations").select("position").order("position", { ascending: false }).limit(1);
  if (positionError) throw new Error(`Não foi possível consultar a ordem da galeria: ${positionError.message}`);
  let nextPosition = (lastPosition?.[0]?.position ?? -1) + 1;

  for (const item of items) {
    const { data: creation, error: creationError } = await supabase.from("creations").insert({
      title: item.title,
      slug: item.slug,
      description: item.description,
      category_id: categoryIds.get(item.categorySlug),
      featured: item.featured,
      is_published: false,
      position: nextPosition++
    }).select("id").single();
    if (creationError) throw new Error(`${item.slug}: não foi possível criar o rascunho: ${creationError.message}`);

    const uploadedPaths = [];
    try {
      for (const image of item.images) {
        const storagePath = `creations/${creation.id}/${crypto.randomUUID()}${path.extname(image.absoluteFile).toLowerCase()}`;
        const { error: uploadError } = await supabase.storage.from("gallery").upload(storagePath, await readFile(image.absoluteFile), {
          contentType: image.contentType,
          cacheControl: "3600",
          upsert: false
        });
        if (uploadError) throw new Error(`Upload de ${image.file} falhou: ${uploadError.message}`);
        uploadedPaths.push(storagePath);
      }

      const imageRows = item.images.map((image, index) => ({
        creation_id: creation.id,
        storage_path: uploadedPaths[index],
        alt_text: image.altText || null,
        position: index,
        is_cover: image.isCover
      }));
      const { error: imagesError } = await supabase.from("creation_images").insert(imageRows);
      if (imagesError) throw new Error(`Não foi possível registrar as fotos: ${imagesError.message}`);

      if (item.published) {
        const { error: publishError } = await supabase.from("creations").update({ is_published: true }).eq("id", creation.id);
        if (publishError) throw new Error(`Fotos enviadas, mas não foi possível publicar: ${publishError.message}`);
      }
      console.log(`✓ ${item.title} — ${item.published ? "publicada" : "rascunho"} (${item.images.length} foto(s))`);
    } catch (error) {
      if (uploadedPaths.length) {
        const { error: storageCleanupError } = await supabase.storage.from("gallery").remove(uploadedPaths);
        if (storageCleanupError) console.error(`Aviso: falha ao limpar imagens de ${item.slug}: ${storageCleanupError.message}`);
      }
      const { error: rowCleanupError } = await supabase.from("creations").delete().eq("id", creation.id);
      if (rowCleanupError) console.error(`Aviso: falha ao remover rascunho incompleto ${item.slug}: ${rowCleanupError.message}`);
      throw error;
    }
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) return usage();
  const manifest = await validateManifest(options.manifest);
  console.log(`${manifest.items.length} criação(ões), ${manifest.items.reduce((sum, item) => sum + item.images.length, 0)} foto(s), ${(manifest.totalBytes / 1024 / 1024).toFixed(1)} MB.`);

  if (!options.apply) {
    console.log("Validação local concluída. Nada foi enviado. Use --apply para importar.");
    return;
  }

  await loadLocalEnv(path.resolve(".env.local"));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY no .env.local.");

  const terminal = createInterface({ input: stdin, output: stdout });
  const email = (await terminal.question("E-mail do admin: ")).trim();
  terminal.close();
  if (!email) throw new Error("Informe o e-mail do admin.");
  const password = await readHiddenPassword();
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
  if (authError || !authData.user) throw new Error("Não foi possível autenticar esse admin. Confira o e-mail e a senha.");

  try {
    const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", authData.user.id).maybeSingle();
    if (profileError || profile?.role !== "admin") throw new Error("Esta conta não tem perfil de administrador.");
    const categoryIds = await verifyRemoteItems(supabase, manifest.items);
    console.log("Validação do Supabase concluída. Iniciando importação...");
    await importItems(supabase, categoryIds, manifest.items);
    console.log("Importação concluída.");
  } finally {
    await supabase.auth.signOut();
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (invokedPath === import.meta.url) {
  main().catch((error) => {
    console.error(`Erro: ${error.message}`);
    process.exitCode = 1;
  });
}

