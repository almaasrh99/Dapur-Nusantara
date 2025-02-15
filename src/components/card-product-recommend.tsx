import { useAppContext } from "@/context";
import { formatMoney } from "@/lib/helpers";
import Image from "next/image";

export default function CartItem({ data }: { data: any }) {
  const { saveMyCarts, deleteItemCart} =
    useAppContext();

  function increaseQty() {
    data.product_qty += 1;
    return saveMyCarts(data);
  }

  function decreaseQty() {
    if (data.product_qty > 1) {
      data.product_qty -= 1;
      return saveMyCarts(data);
    } else if (data.product_qty == 1) {
      return deleteItemCart(data.product_id);
    }
  }

  return (
    <>
      <Image
        src={data.product_img}
        width={160}
        height={120}
        alt=""
        className="xs:w-48 min-[400px]:w-28 md:w-40 lg:w-44 xl:w-48"
      />
      <div className="flex-col justify-center gap-2">
        <div className="flex justify-center">
          <div>
            <h3 className="font-semibold text-center xs:text-lg min-[400px]:text-sm md:text-lg">
              {data.product_name}
            </h3>
            <div className=" text-secondary-main font-bold xs:text-lg min-[400px]:text-sm md:text-lg lg:text-xl">
              {formatMoney(data.product_harga)}/Kg
            </div>
          </div>
        </div>
        <div className="flex gap-2 tracking-wider justify-center items-center my-2 min-[400px]:gap-1 min-[400px]:flex-col md:flex-row md:gap-2">
          <div className="flex justify-center items-center">
            <div>⭐</div>
            <p className="min-[400px]:text-sm md:text-lg text-black">
              ({data.product_review})
            </p>
          </div>
          <div className="flex justify-center items-center ">
            {" "}
            <span className="min-[400px]:hidden md:block">| </span>{" "}
            <p className="min-[400px]:text-sm md:text-lg pl-2">
              {data.product_terjual} Terjual
            </p>
          </div>
        </div>
        <div className="justify-center items-center inline-flex">
          <button
            onClick={decreaseQty}
            className="bg-primary-main xs:w-8 xs:h-8 min-[400px]:w-6 min-[400px]:h-6 md:w-8 md:h-8 text-white rounded-full"
          >
            -
          </button>
          <p className="xs:m-6 md:m-4 xs:text-base min-[400px]:text-sm md:text-lg">
            {data.product_qty}
          </p>
          <button
            onClick={increaseQty}
            className="bg-primary-main xs:w-8 xs:h-8 min-[400px]:w-6 min-[400px]:h-6 md:w-8 md:h-8 text-white rounded-full"
          >
            +
          </button>
        </div>
      </div>
    </>
  );
}
