import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "../components/primitives/button";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common"])),
  },
});

export default function PrivacyPolicy() {
  const { t } = useTranslation("common");
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () =>
    setPageNumber(pageNumber + 1 >= numPages! ? numPages! : pageNumber + 1);

  return (
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
      <div className="py-2 flex justify-center items-center gap-2 flex-col fixed bottom-0">
        <p className="mt-3">
          {pageNumber} {t("page_counter")} {numPages}
        </p>
        <div className="gap-4 flex">
          <Button onClick={goToPrevPage}>{t("back")}</Button>
          <Button onClick={goToNextPage}>{t("forward")}</Button>
        </div>
      </div>
    </div>
  );
}
