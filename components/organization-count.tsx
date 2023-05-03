import { useEffect, useState } from "react";

export function OrganizationFileCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCount((document.querySelector("#fffffff") as any).files.length ?? 0);
    }, 1000);

    return () => clearTimeout(t);
  }, []);

  return <>{count}</>;
}
