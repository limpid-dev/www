import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "../components/primitives/button";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function TermsAndConditions() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const [largeScreen, setLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const newScreenWidth = window.innerWidth;

      setLargeScreen(newScreenWidth > 896);
    };
    handleResize(); // Initial setup

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () =>
    setPageNumber(pageNumber + 1 >= numPages! ? numPages! : pageNumber + 1);

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <Document
          file="/terms-and-conditions.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            className="max-w-[380px]"
            width={largeScreen ? 596 : 290}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            pageNumber={pageNumber}
          />
        </Document>
        <div className="py-2 flex justify-center items-center gap-2 flex-col fixed bottom-0">
          <p className="mt-3">
            {pageNumber} страница из {numPages}
          </p>
          <div className="gap-4 flex">
            <Button onClick={goToPrevPage}>Назад</Button>
            <Button onClick={goToNextPage}>Далее</Button>
          </div>
        </div>
      </div>
    </>
  );
}
