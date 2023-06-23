import { useState } from "react";

export default function useTimestampConverter(
  timestamp: string | number | Date,
  format = "datetime"
) {
  const [convertedTimestamp, setConvertedTimestamp] = useState("");

  const convertTimestamp = () => {
    const date = new Date(timestamp);
    let converted = "";

    switch (format) {
      case "time":
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        converted = `${hours}:${minutes}`;
        break;
      case "date":
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        converted = `${day}.${month}.${year}`;
        break;
      case "datetime":
      default:
        const dayDT = date.getDate().toString().padStart(2, "0");
        const monthDT = (date.getMonth() + 1).toString().padStart(2, "0");
        const yearDT = date.getFullYear();
        const hoursDT = date.getHours().toString().padStart(2, "0");
        const minutesDT = date.getMinutes().toString().padStart(2, "0");
        converted = `${dayDT}.${monthDT}.${yearDT}, ${hoursDT}:${minutesDT}`;
        break;
    }

    setConvertedTimestamp(converted);
  };

  convertTimestamp();

  return convertedTimestamp;
}
