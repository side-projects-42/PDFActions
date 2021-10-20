import { PDFDocument } from "pdf-lib";
import downloadPDFArray from "./downloadPDFArray";

const mergePDF = async (files) => {
  let length = 0;
  for (let i = 0; i < files.length; i++) {
    if (!files[i].deleted) {
      length++;
    }
  }
  if (length < 2) {
    alert("Add 2 or more files to merge");
    return null;
  }

  const mergedPdf = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.deleted) {
      continue;
    }
    const fileURL = URL.createObjectURL(file);
    const data = await fetch(fileURL);
    const fileArray = await data.arrayBuffer();

    const pdfToBeAdded = await PDFDocument.load(fileArray);
    const pages = await mergedPdf.copyPages(
      pdfToBeAdded,
      pdfToBeAdded.getPageIndices()
    );
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfFile = await mergedPdf.save();
  return mergedPdfFile;
};

const handler = async (files) => {
  const pdfBytes = await mergePDF(files);
  if (pdfBytes) {
    downloadPDFArray(pdfBytes);
  }
};

export default handler;
