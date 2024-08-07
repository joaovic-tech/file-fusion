from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PyPDF2 import PdfMerger
from fastapi.responses import StreamingResponse

app = FastAPI()

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Api do FileFusion"}


@app.post("/upload")
async def upload_pdf(files: list[UploadFile] = File(...)):
    try:
        # Inicializa o PdfMerger
        merger = PdfMerger()

        for file in files:
            if file.content_type != "application/pdf":
                raise HTTPException(
                    status_code=400, detail="Todos os arquivos devem ser PDFs."
                )

            contents = await file.read()
            pdf_file = BytesIO(contents)

            # Adiciona o arquivo PDF ao merger
            merger.append(pdf_file)

        # Cria um BytesIO para armazenar o PDF unido
        merged_pdf = BytesIO()
        merger.write(merged_pdf)
        merged_pdf.seek(0)

        # Retorna o PDF combinado como um arquivo para download
        return StreamingResponse(
            merged_pdf,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=merged.pdf"},
        )

    except HTTPException as http_exc:
        # Retorna erros HTTP específicos
        raise http_exc
    except Exception as e:
        # Retorna um erro genérico para outras exceções
        raise HTTPException(status_code=500, detail=f"Ocorreu um erro: {str(e)}")
