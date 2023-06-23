import { NumberFormatBase } from "react-number-format";

export function MyCustomNumberFormat(props) {
  const format = (numStr) => {
    if (numStr === "") return "";
    return new Intl.NumberFormat("kz-KZ", {
      style: "currency",
      currency: "KZT",
      maximumFractionDigits: 0,
    }).format(numStr);
  };

  return <NumberFormatBase {...props} format={format} />;
}
