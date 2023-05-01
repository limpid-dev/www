import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function TermsAndConditions() {
  return (
    <Document file="/terms-and-conditions.pdf">
      <Page pageNumber={1} />
    </Document>
  );
}
