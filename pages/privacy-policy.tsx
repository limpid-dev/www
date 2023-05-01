import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PrivacyPolicy() {
  return (
    <Document file="/privacy-policy.pdf">
      <Page pageNumber={1} />
    </Document>
  );
}
