import Image from "next/image";
import backgroundImage from "../images/background-auth.jpg";

export function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen justify-center bg-white ">
      <div className="flex p-4 max-w-screen-sm w-full flex-col justify-center">
        <div className="max-w-md w-full mx-auto">{children}</div>
      </div>
      <div className="hidden lg:block flex-1">
        <Image
          className="h-full w-full object-cover rounded-tl-[4rem] rounded-bl-[4rem]"
          src={backgroundImage}
        />
      </div>
    </div>
  );
}
