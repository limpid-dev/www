import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "../components/primitives/button";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PrivacyPolicy() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  const [largeScreen, setLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const newScreenWidth = window.innerWidth;

      setLargeScreen(newScreenWidth > 896);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () =>
    setPageNumber(pageNumber + 1 >= numPages! ? numPages! : pageNumber + 1);
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <Document
          file="/privacy-policy.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            renderTextLayer={false}
            width={largeScreen ? 596 : 330}
            renderAnnotationLayer={false}
            pageNumber={pageNumber}
          />
        </Document>
        <p className="mt-3">
          {pageNumber} страница из {numPages}
        </p>
        <div className="py-2 flex gap-4">
          <Button onClick={goToPrevPage}>Назад</Button>
          <Button onClick={goToNextPage}>Далее</Button>
        </div>
      </div>
    </>
  );
}
