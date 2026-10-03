"use client";

import { useEffect, useRef, useState } from "react";
import { deleteCreationImage, setCreationCover, updateCreationImageAltText, uploadCreationImage } from "./image-actions";

type ImageItem = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  position: number;
  is_cover: boolean;
};

function publicImageUrl(storagePath: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "";
  const encodedPath = storagePath.split("/").map(encodeURIComponent).join("/");
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/gallery/${encodedPath}`;
}

export function CreationImageManager({
  creationId,
  images
}: {
  creationId: string;
  images: ImageItem[];
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const previewUrlRef = useRef("");
  const sortedImages = [...images].sort((a, b) => a.position - b.position);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function selectFile(file: File | null) {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = file ? URL.createObjectURL(file) : "";
    setPreviewUrl(previewUrlRef.current);
    setSelectedFile(file);
  }

  async function runAction(key: string, action: (formData: FormData) => Promise<void>, formData: FormData, message: string) {
    setPendingAction(key);
    setFeedback(null);
    try {
      await action(formData);
      setFeedback({ type: "success", message });
      if (key === "upload") {
        selectFile(null);
        setFileInputKey((value) => value + 1);
      }
    } catch {
      setFeedback({ type: "error", message: "Não foi possível concluir. Verifique a conexão e tente novamente." });
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-[#e8e1d8] bg-[#faf8f4] p-4 sm:p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Fotografias</p>
        <p className="mt-2 text-sm leading-6 text-[#655f58]">
          A primeira foto vira a capa automaticamente. Depois você pode escolher outra.
        </p>
      </div>

      {sortedImages.length === 0 && <p className="mt-4 border border-dashed border-[#d8d0c5] bg-white p-4 text-sm text-[#655f58]">Esta criação ainda não tem foto. A primeira que você adicionar será a capa.</p>}

      {sortedImages.length > 0 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {sortedImages.map((image) => {
            const src = publicImageUrl(image.storage_path);
            return (
              <article key={image.id} className="overflow-hidden border border-[#e8e1d8] bg-white">
                {src ? (
                  <img src={src} alt={image.alt_text || "Foto da criação"} className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <div className="aspect-[4/3] bg-[#e8e0d5]" />
                )}
                <div className="p-3">
                  <details className="border-b border-[#e8e1d8] pb-2">
                    <summary className="min-h-11 cursor-pointer py-2 text-xs font-medium underline underline-offset-4">Editar descrição da foto</summary>
                    <form action={(formData) => runAction(`alt-${image.id}`, updateCreationImageAltText, formData, "Descrição da foto atualizada.")} className="mt-2 space-y-2">
                      <input type="hidden" name="image_id" value={image.id} />
                      <label className="block text-xs font-medium">Texto alternativo <span className="font-normal text-[#756d64]">(para leitores de tela)</span>
                        <input name="alt_text" maxLength={300} defaultValue={image.alt_text ?? ""} className="mt-1.5 min-h-11 w-full border border-[#ddd5ca] bg-white px-3 text-sm" placeholder="Descreva a foto em poucas palavras" />
                      </label>
                      <button type="submit" disabled={Boolean(pendingAction)} className="min-h-11 text-xs font-medium underline underline-offset-4 disabled:opacity-50">{pendingAction === `alt-${image.id}` ? "Salvando…" : "Salvar descrição"}</button>
                    </form>
                  </details>
                  <div className="flex items-center justify-between gap-2">
                    {image.is_cover ? (
                    <span className="bg-[#292622] px-3 py-1 text-xs text-white">Capa atual</span>
                  ) : (
                      <form action={(formData) => runAction(`cover-${image.id}`, setCreationCover, formData, "Foto de capa atualizada.")}>
                        <input type="hidden" name="creation_id" value={creationId} />
                        <input type="hidden" name="image_id" value={image.id} />
                        <button type="submit" disabled={Boolean(pendingAction)} className="min-h-11 text-xs font-medium underline underline-offset-4 disabled:opacity-50">{pendingAction === `cover-${image.id}` ? "Salvando…" : "Usar como capa"}</button>
                      </form>
                    )}
                    <form action={(formData) => runAction(`remove-${image.id}`, deleteCreationImage, formData, "Foto removida.")} onSubmit={(event) => { if (!window.confirm("Remover esta foto da criação?")) event.preventDefault(); }}>
                      <input type="hidden" name="image_id" value={image.id} />
                      <button type="submit" disabled={Boolean(pendingAction)} className="inline-flex min-h-11 items-center px-2 text-xs text-red-700 underline underline-offset-4 disabled:opacity-50">{pendingAction === `remove-${image.id}` ? "Removendo…" : "Remover foto"}</button>
                    </form>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <form
        action={(formData) => runAction("upload", uploadCreationImage, formData, "Foto adicionada.")}
        className="mt-5 grid gap-4 rounded-2xl border border-dashed border-[#d8d0c5] bg-white p-4"
      >
        <input type="hidden" name="creation_id" value={creationId} />
        <label className="block">
          <span className="text-sm font-medium">Adicionar foto</span>
          <input
            key={fileInputKey}
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            onChange={(event) => selectFile(event.target.files?.[0] ?? null)}
            className="mt-2 block w-full text-sm"
          />
          <span className="mt-2 block text-xs text-[#8a7c6d]">JPG, PNG ou WebP · até 8 MB</span>
        </label>
        {previewUrl && <div className="flex items-center gap-3 border border-[#e8e1d8] p-2"><img src={previewUrl} alt="Prévia da foto selecionada" className="size-16 object-cover" /><span className="min-w-0 truncate text-sm">{selectedFile?.name}</span></div>}
        <label className="block">
          <span className="text-sm font-medium">Descrição da foto para leitores de tela <span className="font-normal text-[#756d64]">(opcional)</span></span>
          <input name="alt_text" className="mt-1.5 min-h-12 w-full border border-[#ddd5ca] bg-white px-4 py-3" placeholder="Ex.: Bolo de aniversário com decoração floral" />
        </label>
        {feedback && <p role={feedback.type === "error" ? "alert" : "status"} className={`border p-3 text-sm ${feedback.type === "error" ? "border-[#dcbab3] bg-[#f5e8e4] text-[#754f45]" : "border-[#c7d8c5] bg-[#edf4eb] text-[#314631]"}`}>{feedback.message}</p>}
        <button type="submit" disabled={!selectedFile || Boolean(pendingAction)} className="min-h-12 w-full bg-[#292622] px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-fit">
          {pendingAction === "upload" ? "Enviando foto…" : "Adicionar foto"}
        </button>
      </form>
    </div>
  );
}

