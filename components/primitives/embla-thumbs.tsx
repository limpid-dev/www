import Image from "next/image";
import React from "react";

interface PropType {
  selected: boolean;
  imgSrc: string;
  index: number;
  onClick: () => void;
}

export const Thumb: React.FC<PropType> = (props) => {
  const { selected, imgSrc, index, onClick } = props;

  return (
    <div
      className={"relative flex flex-[0_0_20%] min-w-0".concat(
        selected ? " opacity-100" : ""
      )}
    >
      <button
        onClick={onClick}
        className="bg-transparent block p-0 m-0"
        type="button"
      >
        <Image
          className=" block h-20 w-20 object-cover rounded-md"
          width={0}
          height={0}
          unoptimized
          alt="Your alt text"
          src={imgSrc}
        />
      </button>
    </div>
  );
};
