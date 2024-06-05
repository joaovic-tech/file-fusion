import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";

function SelectFile() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mergedFile, setMergedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);

    event.preventDefault();
    if (selectedFiles.length === 0) {
      console.log("Selecione um arquivo primeiro!");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setMergedFile(url);
        console.log("Arquivo PDF mesclado baixado com sucesso");
      } else {
        console.error("Falha no upload dos arquivos");
      }
    } catch (error) {
      console.error("Erro ao enviar arquivos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-between w-11/12 py-6 border rounded-md gap-36 h-4/5">
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
          >
            {selectedFiles.length > 0 ? (
              <>
                Selecione mais (clique aqui)
                <Badge variant="secondary" className="px-6 text-lg">
                  Total: {selectedFiles.length}
                </Badge>
              </>
            ) : (
              <>
                Selecione os arquivos de até
                <Badge variant="secondary" className="px-8 text-xl">
                  3 MB
                </Badge>
              </>
            )}
          </label>

          {selectedFiles.length > 0 && (
            <>
              <Separator className="my-10 bg-border h-[1px]" />

              <div className="grid items-center justify-center w-full gap-8 py-10 border rounded-md">
                <ul className="flex flex-wrap w-4/5 gap-10 m-auto">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="relative flex flex-col items-center w-40 rounded-sm h-60"
                    >
                      <span className="absolute text-sm">{file.name}</span>
                      <iframe
                        src={`${URL.createObjectURL(file)}#page=1`}
                        className="w-full h-full"
                      ></iframe>
                    </li>
                  ))}
                </ul>
                <Button
                  type="submit"
                  className="m-auto text-xl font-bold h-14 w-72"
                >
                  Finalizar
                </Button>
              </div>
            </>
          )}
        </form>
      ) : (
        <div className="flex flex-col justify-center w-11/12 gap-32 py-8 border rounded-md h-4/5">
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
