import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "./ui/button";
import { LoaderCircle, Trash2 } from "lucide-react";
import BtnRemoveMergedFile from "./btn-remove-merged-file";
import Message from "./message";

function SelectFile() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mergedFile, setMergedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Limpa a mensagem após a animação de saída
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    const existingFileNames = new Set(selectedFiles.map((file) => file.name));
    const uniqueFiles = Array.from(files).filter(
      (file) => !existingFileNames.has(file.name)
    );

    if (uniqueFiles.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...uniqueFiles]);
    } else {
      setAlertMessage({
        text: "Não pode adicionar arquivo com mesmo nome ou igual",
        type: "error",
      });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.files) {
      const files = event.dataTransfer.files;
      handleFileChange({
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);

    event.preventDefault();
    if (selectedFiles.length <= 1) {
      setAlertMessage({
        text: "Selecione um ou mais arquivo primeiro!",
        type: "error",
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(
        "https://file-fusion-server.vercel.app/upload",
        {
          method: "POST",
          body: formData,
          mode: "no-cors",
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setMergedFile(url);
        setAlertMessage({
          text: "Arquivo PDF mesclado com sucesso!",
          type: "success",
        });
      } else {
        setAlertMessage({
          text: "Desculpe, algo deu errado no upload!",
          type: "error",
        });
        console.error("Falha no upload dos arquivos");
      }
    } catch (error) {
      setAlertMessage({
        text: "Desculpe, algo deu errado no upload!",
        type: "error",
      });
      console.error("Erro ao enviar arquivos:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (fileToRemove: File) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file !== fileToRemove)
    );
  };

  return (
    <>
      {alertMessage && (
        <Message text={alertMessage.text} typeMessage={alertMessage.type} />
      )}
      {loading ? (
        <div className="flex flex-col items-center justify-between w-11/12 py-6 rounded-md gap-36 h-4/5">
          <div className="w-40 border rounded-sm h-60 bg-gradient-to-t dark:from-zinc-800 from-zinc-400 to-transparent animate-pulse"></div>
          <div className="flex flex-col items-center">
            <LoaderCircle className="w-12 h-12 animate-spin" />
            <h2 className="text-4xl">Preparando arquivo</h2>
          </div>
        </div>
      ) : !mergedFile ? (
        <form onSubmit={handleSubmit} className="w-11/12">
          <input
            type="file"
            id="files"
            accept=".pdf"
            className="sr-only"
            onChange={handleFileChange}
            multiple
          />
          <label
            htmlFor="files"
            className="relative flex flex-col items-center justify-center gap-2 text-2xl border border-dashed rounded-md cursor-pointer h-44 text-muted-foreground hover:bg-primary/5"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {selectedFiles.length > 0 ? (
              <>
                Selecione ou arraste mais (clique aqui)
                <Badge variant="secondary" className="px-6 text-lg">
                  Total: {selectedFiles.length}
                </Badge>
              </>
            ) : (
              <>
                Selecione ou arraste os arquivos de até
                <Badge variant="secondary" className="px-8 text-xl">
                  3 MB
                </Badge>
              </>
            )}
          </label>

          {selectedFiles.length > 0 && (
            <>
              <Separator className="my-10 bg-border h-[1px]" />
              <div className="relative flex flex-col items-center justify-center w-full gap-8 p-10 border rounded-md">
                <BtnRemoveMergedFile
                  setMergedFile={setMergedFile}
                  setSelectedFiles={setSelectedFiles}
                />
                <ul className="flex flex-wrap items-center justify-center gap-10">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="relative flex flex-col items-center w-40 h-64 rounded-sm"
                    >
                      <span className="w-full p-1 text-sm text-center rounded bg-primary-foreground">
                        {file.name}
                      </span>
                      <span
                        className="absolute p-1 bg-red-600 rounded-full shadow-md cursor-pointer -top-2 -right-2 hover:bg-red-700"
                        onClick={() => removeFile(file)}
                      >
                        <Trash2 />
                      </span>
                      <iframe
                        src={`${URL.createObjectURL(file)}#page=1`}
                        className="w-full h-full"
                      ></iframe>
                    </li>
                  ))}
                </ul>
                <Button type="submit" className="text-xl font-bold h-14 w-72">
                  Finalizar
                </Button>
              </div>
            </>
          )}
        </form>
      ) : (
        <div className="relative flex flex-col justify-center w-11/12 gap-32 py-8 border rounded-md h-4/5">
          <BtnRemoveMergedFile
            setMergedFile={setMergedFile}
            setSelectedFiles={setSelectedFiles}
          />
          <div className="flex flex-col items-center justify-center m-auto text-center">
            <iframe
              id="mergedFile"
              src={`${mergedFile}#page=1`}
              className="w-40 rounded-sm h-60"
            ></iframe>
            <label htmlFor="mergedFile" className="text-3xl">
              Arquivo mesclado
            </label>
          </div>
          <Button
            onClick={() => {
              const a = document.createElement("a");
              a.href = mergedFile;
              a.download = "arquivo_mesclado.pdf";
              a.click();
            }}
            className="m-auto text-xl font-bold h-14 w-72"
          >
            Download
          </Button>
        </div>
      )}
    </>
  );
}

export default SelectFile;
