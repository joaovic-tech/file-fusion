import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { Separator } from "@radix-ui/react-separator";

function SelectFile() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedFiles.length === 0) {
      alert("Please select a file first!");
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
        alert("Files uploaded successfully");
      } else {
        alert("Files upload failed");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("An error occurred while uploading the files");
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
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
          className="relative flex flex-col items-center justify-center gap-2 text-4xl border border-dashed rounded-md cursor-pointer h-80 text-muted-foreground hover:bg-primary/5"
        >
          {selectedFiles ? (
            <>
              Selecione mais (clique aqui)
              <Badge variant="secondary" className="px-8 text-xl">
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

        <Separator orientation="vertical" className="h-6 my-10" />

        <div className="flex gap-10">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center border rounded-sm w-44 h-60"
            >
              <span className="absolute text-sm">{file.name}</span>
              <iframe
                src={`${URL.createObjectURL(file)}#page=1`}
                className="w-full h-full"
              ></iframe>
            </div>
          ))}
        </div>
        <button type="submit" className="mt-4">
          Upload PDF
        </button>
      </form>
    </section>
  );
}

export default SelectFile;
