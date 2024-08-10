import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "../ui/button";
import { LoaderCircle, Trash2 } from "lucide-react";
import Message from "../message";
import CancelMerge from "../cancel-merge";
import PdfIsValid from "./pdfIsValid";
import { api } from "@/lib/axios";

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

  const verifyFiles = async (files: FileList) => {
    const newFiles = Array.from(files);
    const existingFileNames = new Set(selectedFiles.map((file) => file.name));
    const maxFileSize = 3000000; // tamanho máximo de cada arquivo - 3 MB
    const maxFileCount = 10; // Limite de arquivos para merge

    // Verificar o número de arquivos
    if (newFiles.length + selectedFiles.length > maxFileCount) {
      setAlertMessage({
        text: `Não pode adicionar mais de ${maxFileCount} arquivos`,
        type: "error",
      });
      return false;
    }

    // Verificar duplicatas e validações de arquivo
    const sameFiles = newFiles.filter((file) =>
      existingFileNames.has(file.name)
    );

    // Verificar se os arquivos são PDFs válidos
    for (const file of newFiles) {
      const isValid = await PdfIsValid(file);
      if (file.type !== "application/pdf") {
        setAlertMessage({
          text: "Somente arquivo no formato PDF",
          type: "error",
        });
        return false;
      } else if (!isValid) {
        setAlertMessage({
          text: "Arquivo está corrompido!",
          type: "error",
        });
        return false;
      } else if (file.size > maxFileSize) {
        setAlertMessage({
          text: "Arquivo muito grande!! (max: 3MB)",
          type: "error",
        });
        return false;
      } else if (file.name.length > 50) {
        setAlertMessage({
          text: "Nome do arquivo muito longo",
          type: "error",
        });
        return false;
      }
    }

    if (sameFiles.length > 0) {
      setAlertMessage({
        text: "Não pode adicionar arquivo com mesmo nome",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (!files) return;

    const isValid = await verifyFiles(files);
    if (!isValid) return;

    setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
  };

  const handleDrop = async (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();

    const files = event.dataTransfer.files;

    const isValid = await verifyFiles(files);
    if (!isValid) return;

    setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await api.post("/upload", formData, {
        responseType: "blob", // Especifica que a resposta deve ser tratada como um blob
      });

      if (response.status === 200) {
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);

        setMergedFile(url);
        setAlertMessage({
          text: "Arquivo PDF mesclado com sucesso!",
          type: "success",
        });
      } else {
        // Se o status não for 200, trata como erro
        const errorData = await response.data.text(); // Para lidar com a resposta de erro como texto
        setAlertMessage({
          text: errorData || "Desculpe, algo deu errado no upload!",
          type: "error",
        });
        console.error("Falha no upload dos arquivos:", errorData);
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
      prevFiles.filter((file) => file.name !== fileToRemove.name)
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
                <CancelMerge
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
          <CancelMerge
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
