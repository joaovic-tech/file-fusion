from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
from PyPDF2 import PdfMerger

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="uploads"), name="static")


@app.get("/")
async def root():
    return {"message": "Api do FileFusion"}


def merge_pdfs(input_folder, output_filename):
    pdf_files = [file for file in os.listdir(input_folder) if file.endswith(".pdf")]
    pdf_files.sort()

    pdf_merger = PdfMerger()

    for pdf_file in pdf_files:
        pdf_merger.append(os.path.join(input_folder, pdf_file))

    with open(output_filename, "wb") as output_file:
        pdf_merger.write(output_file)

    print(f"Arquivos PDF mesclados com sucesso em {output_filename}")

    # Remover arquivos individuais
    for pdf_file in pdf_files:
        os.remove(os.path.join(input_folder, pdf_file))


@app.post("/upload")
async def upload_file(files: list[UploadFile] = File(...)):
    for file in files:
        file_location = f"{UPLOAD_DIR}/{file.filename}"
        with open(file_location, "wb+") as file_object:
            file_object.write(file.file.read())

    output_filename = f"{UPLOAD_DIR}/arquivo_mesclado.pdf"
    if os.path.exists(output_filename):
        os.remove(output_filename)
    merge_pdfs(UPLOAD_DIR, output_filename)

    return FileResponse(
        output_filename, media_type="application/pdf", filename="arquivo_mesclado.pdf"
    )
