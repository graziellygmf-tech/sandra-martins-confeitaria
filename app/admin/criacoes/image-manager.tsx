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

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CreationImageManager({
  creationId,
  images
}: {
  creationId: string;
  images: ImageItem[];
}) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const previewUrlsRef = useRef<string[]>([]);
  const sortedImages = [...images].sort((a, b) => a.position - b.position);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function clearSelection() {
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrlsRef.current = [];
    setPreviewUrls([]);
    setSelectedFiles([]);
    setFileInputKey((value) => value + 1);
  }

  function selectFiles(fileList: FileList | null) {
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    const files = Array.from(fileList ?? []);
    const urls = files.map((file) => URL.createObjectURL(file));
    previewUrlsRef.current = urls;
    setSelectedFiles(files);
    setPreviewUrls(urls);
    setFeedback(null);
  }

  async function runAction(
    key: string,
    action: (formData: FormData) => Promise<void>,
    formData: FormData,
    message: string
  ) {
    setPendingAction(key);
    setFeedback(null);
    try {
      await action(formData);
      setFeedback({ type: "success", message });
      if (key === "upload") clearSelection();
    } catch {
      setFeedback({
        type: "error",
        message: "Não foi possível concluir. Verifique a conexão e tente novamente."
      });
    } finally {
      setPendingAction(null);
    }
  }

  const selectedTotal = selectedFiles.reduce((total, file) => total + file.size, 0);
  const canUpload = selectedFiles.length > 0 && selectedTotal <= 8 * 1024 * 1024;

  return (
    <div className="mt-6 border border-[#e8e1d8] bg-[#faf8f4] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Fotografias</p>
          <p className="mt-2 text-sm leading-6 text-[#655f58]">
            A primeira foto desta criação vira a capa automaticamente. Você pode trocar a capa depois.
          </p>
        </div>
        <span className="shrink-0 bg-white px-2.5 py-1 text-xs text-[#655f58]">
          {sortedImages.length} {sortedImages.length === 1 ? "foto" : "fotos"}
        </span>
      </div>

      {sortedImages.length === 0 && (
        <p className="mt-4 border border-dashed border-[#d8d0c5] bg-white p-4 text-sm text-[#655f58]">
          Esta criação ainda não tem foto. A primeira que você adicionar será a capa.
        </p>
      )}

      {sortedImages.length > 0 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {sortedImages.map((image) => {
            const src = publicImageUrl(image.storage_path);
            return (
              <article key={image.id} className="overflow-hidden border border-[#e8e1d8] bg-white">
                {src ? (
                  <img
                    src={src}
                    alt={image.alt_text || "Foto da criação"}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="aspect-[4/3] bg-[#e8e0d5]" />
                )}
                <div className="p-3">
                  <details className="border-b border-[#e8e1d8] pb-2">
                    <summary className="min-h-11 cursor-pointer py-2 text-xs font-medium underline underline-offset-4">
                      Editar descrição da foto
                    </summary>
                    <form
                      action={(formData) =>
                        runAction(
                          `alt-${image.id}`,
                          updateCreationImageAltText,
                          formData,
                          "Descrição da foto atualizada."
                        )
                      }
                      className="mt-2 space-y-2"
                    >
                      <input type="hidden" name="image_id" value={image.id} />
                      <label className="block text-xs font-medium">
                        Texto alternativo{" "}
                        <span className="font-normal text-[#756d64]">(para leitores de tela)</span>
                        <input
                          name="alt_text"
                          maxLength={300}
                          defaultValue={image.alt_text ?? ""}
                          className="mt-1.5 min-h-11 w-full border border-[#ddd5ca] bg-white px-3 text-sm"
                          placeholder="Descreva a foto em poucas palavras"
                        />
                      </label>
                      <button
                        type="submit"
                        disabled={Boolean(pendingAction)}
                        className="min-h-11 text-xs font-medium underline underline-offset-4 disabled:opacity-50"
                      >
                        {pendingAction === `alt-${image.id}` ? "Salvando…" : "Salvar descrição"}
                      </button>
                    </form>
                  </details>
                  <div className="flex items-center justify-between gap-2">
                    {image.is_cover ? (
                      <span className="bg-[#292622] px-3 py-1 text-xs text-white">Capa atual</span>
                    ) : (
                      <form
                        action={(formData) =>
                          runAction(
                            `cover-${image.id}`,
                            setCreationCover,
                            formData,
                            "Foto de capa atualizada."
                          )
                        }
                      >
                        <input type="hidden" name="creation_id" value={creationId} />
                        <input type="hidden" name="image_id" value={image.id} />
                        <button
                          type="submit"
                          disabled={Boolean(pendingAction)}
                          className="min-h-11 text-xs font-medium underline underline-offset-4 disabled:opacity-50"
                        >
                          {pendingAction === `cover-${image.id}` ? "Salvando…" : "Usar como capa"}
                        </button>
                      </form>
                    )}
                    <form
                      action={(formData) =>
                        runAction(
                          `remove-${image.id}`,
                          deleteCreationImage,
                          formData,
                          "Foto removida."
                        )
                      }
                      onSubmit={(event) => {
                        if (!window.confirm("Remover esta foto da criação?")) event.preventDefault();
                      }}
                    >
                      <input type="hidden" name="image_id" value={image.id} />
                      <button
                        type="submit"
                        disabled={Boolean(pendingAction)}
                        className="inline-flex min-h-11 items-center px-2 text-xs text-red-700 underline underline-offset-4 disabled:opacity-50"
                      >
                        {pendingAction === `remove-${image.id}` ? "Removendo…" : "Remover foto"}
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <form
        action={(formData) =>
          runAction("upload", uploadCreationImage, formData, `${selectedFiles.length} ${selectedFiles.length === 1 ? "foto adicionada" : "fotos adicionadas"}.`)
        }
        className="mt-5 grid gap-4 border border-dashed border-[#d8d0c5] bg-white p-4"
      >
        <input type="hidden" name="creation_id" value={creationId} />

        <label className="block">
          <span className="text-sm font-medium">Adicionar fotos</span>
          <input
            key={fileInputKey}
            name="files"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            required
            onChange={(event) => selectFiles(event.target.files)}
            className="mt-2 block w-full text-sm"
          />
          <span className="mt-2 block text-xs leading-5 text-[#8a7c6d]">
            Selecione várias fotos de uma vez · JPG, PNG ou WebP · máximo de 8 MB por lote
          </span>
        </label>

        {selectedFiles.length > 0 && (
          <div className="border border-[#e8e1d8] bg-[#faf8f4] p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">
                {selectedFiles.length} {selectedFiles.length === 1 ? "foto selecionada" : "fotos selecionadas"}
              </p>
              <button
                type="button"
                onClick={clearSelection}
                disabled={Boolean(pendingAction)}
                className="text-xs font-medium underline underline-offset-4"
              >
                Limpar
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {previewUrls.map((url, index) => (
                <div key={url} className="relative overflow-hidden border border-[#e8e1d8] bg-white">
                  <img src={url} alt="" className="aspect-square w-full object-cover" />
                  <span className="absolute bottom-1 left-1 bg-[#292622] px-1.5 py-0.5 text-[10px] text-white">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>

            <p className={`mt-3 text-xs ${selectedTotal > 8 * 1024 * 1024 ? "text-[#754f45]" : "text-[#655f58]"}`}>
              Total: {formatBytes(selectedTotal)} de 8 MB
            </p>
          </div>
        )}

        <label className="block">
          <span className="text-sm font-medium">
            Descrição das fotos para leitores de tela{" "}
            <span className="font-normal text-[#756d64]">(opcional)</span>
          </span>
          <input
            name="alt_text"
            maxLength={300}
            className="mt-1.5 min-h-12 w-full border border-[#ddd5ca] bg-white px-4 py-3"
            placeholder="Opcional; aplicada às fotos deste lote"
          />
        </label>

        {feedback && (
          <p
            role={feedback.type === "error" ? "alert" : "status"}
            className={`border p-3 text-sm ${
              feedback.type === "error"
                ? "border-[#dcbab3] bg-[#f5e8e4] text-[#754f45]"
                : "border-[#c7d8c5] bg-[#edf4eb] text-[#314631]"
            }`}
          >
            {feedback.message}
          </p>
        )}

        <button
          type="submit"
          disabled={!canUpload || Boolean(pendingAction)}
          className="min-h-12 w-full bg-[#292622] px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-fit"
        >
          {pendingAction === "upload"
            ? "Enviando fotos…"
            : selectedFiles.length > 1
              ? `Adicionar ${selectedFiles.length} fotos`
              : "Adicionar foto"}
        </button>
      </form>
    </div>
  );
}
