import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "./ui/button";

function SelectFile() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filesExists, setFilesExists] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
      setFilesExists(true);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
        console.log("Arquivos enviados com sucesso");
      } else {
        console.error("Falha no upload dos arquivos");
      }
    } catch (error) {
      console.error("Erro ao enviar arquivos:", error);
    }
  };

  return (
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
        {selectedFiles ? (
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

      {filesExists ? (
        <>
          <Separator className="my-10 bg-border h-[1px]" />

          <div className="grid items-center justify-center w-full gap-8 py-10 border rounded-md">
            <ul className="grid w-4/5 grid-cols-4 gap-10 m-auto">
              {selectedFiles.map((file, index) => (
                <li
                  key={index}
                  className="relative flex flex-col items-center w-full rounded-sm h-44"
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
      ) : null}
    </form>
  );
}

export default SelectFile;
