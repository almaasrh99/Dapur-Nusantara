import React, { Ref } from "react";
import Image from "next/image";

interface CustomInputProps {
  value: string;
  onClick: () => void;
}

const CustomInputDateSubscription = React.forwardRef(
  ({ value, onClick }: CustomInputProps, ref: Ref<HTMLDivElement>) => (
    <div
      onClick={onClick}
      ref={ref as React.RefObject<HTMLDivElement>}
      className="w-full flex h-16 p-4 items-center cursor-pointer border-2 rounded-2xl border-primary-main xs:w-72 min min-[400px]:w-80  md:w-96 xl:w-[30rem]"
    >
      <Image
        src={"/assets/icon/date-fill.svg"}
        alt={"icon_date"}
        width={8}
        height={8}
        className="w-7 h-7 relative"
      />
      <span className={`pl-2 xs:text-sm md:text-base lg:text-lg xl:text-xl ${value ? 'text-black' : 'text-gray-600'}`}>
      {value || "Pilih Tanggal"}
    </span>
    </div>
  )
);

export default CustomInputDateSubscription;
