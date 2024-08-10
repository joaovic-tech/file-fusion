export default async function PdfIsValid(file: File): Promise<boolean> {
  // Função para verificar o início do arquivo
  const checkPdfHeader = async (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const bytes = new Uint8Array(reader.result as ArrayBuffer);
        // Verifica se os primeiros bytes correspondem ao início típico de um PDF
        const pdfHeader = "%PDF-";
        const headerBytes = new TextDecoder().decode(
          bytes.slice(0, pdfHeader.length)
        );
        resolve(headerBytes === pdfHeader);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file.slice(0, 1024)); // Lê apenas os primeiros 1024 bytes
    });
  };

  try {
    const isValid = await checkPdfHeader(file);
    return isValid;
  } catch (error) {
    console.error("Erro ao verificar o arquivo PDF:", error);
    return false;
  }
}
