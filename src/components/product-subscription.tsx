import { useAppContext } from "@/context";
import { formatMoney } from "@/lib/helpers";
import Image from "next/image";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function ProductSubscription({ data }: { data: any }) {
  const { saveMyCarts, selectedItems, setSelectedItems } = useAppContext();

  const [selectedQty, setSelectedQty] = useState(data.product_qty);

  function increaseQty() {
    data.product_qty += 1;
    setSelectedQty(data.product_qty);
    return saveMyCarts(data);
  }

  function decreaseQty() {
    if (data.product_qty > 1) {
      data.product_qty -= 1;
      setSelectedQty(data.product_qty);
      return saveMyCarts(data);
    } else if (data.product_qty <= 1) {
      toast(`Qty dari ${data.product_name} tidak boleh kurang dari 1 `);
    }
  }

  //Diskon berdasarkan qty
  function getDiscountPercentage(qty: number) {
    if (qty >= 1 && qty <= 5) return 0;
    if (qty >= 6 && qty <= 10) return 5;
    if (qty >= 11 && qty <= 15) return 10;
    if (qty >= 16 && qty <= 20) return 15;
    if (qty >= 21 && qty <= 25) return 20;
    if (qty > 25) return 25;
  }

  //Menghitung total harga produk berdasarkan harga
  const calculateDiscountedPrice = (qty: number) => {
    const discountPercentage = getDiscountPercentage(qty) || 0;
    const discountAmount =
      data.product_harga * qty * (discountPercentage / 100);
    const finalPrice = data.product_harga * qty - discountAmount;
    return finalPrice;
  };

  //Menghitung harga satuan produk berdasarkan diskon
  const calculateDiscountedPricePerUnit = (qty: number) => {
    const totalDiscountedPrice = calculateDiscountedPrice(qty);
    const pricePerUnit = totalDiscountedPrice / qty;
    return pricePerUnit;
  };

  //Array diskon range untuk card
  const discountRanges = [
    { minQty: 1, maxQty: 5, discount: 0 },
    { minQty: 6, maxQty: 10, discount: 5 },
    { minQty: 11, maxQty: 15, discount: 10 },
    { minQty: 16, maxQty: 20, discount: 15 },
    { minQty: 21, maxQty: 25, discount: 20 },
    { minQty: 26, maxQty: Infinity, discount: 25 },
  ];

  //Mengatur quantity baru
  const setQuantity = (qty: number) => {
    data.product_qty = qty;
    setSelectedQty(qty);
    return saveMyCarts(data);
  };

  return (
    <>
      <div className="flex-col justify-start items-center">
        <div className="flex justify-start items-center p-2 border-b xs:flex-col md:flex-row">
          <img
            src={data.product_img}
            alt={data.product_name}
            className="xs:w-20 xs:h-20 min-[400px]:w-28 min-[400px]:h-28  md:w-36 md:h-36"
          />
          <div className="flex justify-center items-center p-2 gap-2">
            <h3 className="text-lg font-bold xs:text-base md:text-2xl ">
              {data.product_name}
            </h3>
            <span className="font-bold xs:text-base md:text-2xl">-</span>
            <p className="text-secondary-main font-bold xs:text-base md:text-2xl ">
              {formatMoney(data.product_harga)} /Kg
            </p>
          </div>
        </div>
        <div className="mt-2 justify-center">
          <h3 className="mb-3 font-medium xs:text-base md:text-xl">
            Pilih Jumlah Produknya :
          </h3>
          <div className="mt-3 grid gap-0 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {discountRanges.map((range) => (
              <div
                key={range.minQty}
                className={` border-1 flex-col justify-center items-center rounded-sm bg-gray-100 cursor-pointer hover:bg-gray-200 xs:p-2 md:p-4 lg:p-2 xl:p-4
                  ${
                    selectedQty >= range.minQty && selectedQty <= range.maxQty
                      ? "text-primary-main border-1 border-primary-main bg-white"
                      : ""
                  }`}
                onClick={() => setQuantity(range.minQty)}
              >
                <div className="flex-col justify-center items-center">
                  <div className="text-center mt-2 text-gray-900 xs:text-sm md:text-lg">
                    Harga Satuan
                  </div>
                  <div className="text-center font-bold xs:text-sm md:text-xl lg:text-xl">
                    {formatMoney(calculateDiscountedPricePerUnit(range.minQty))}{" "}
                    /Kg
                  </div>
                </div>
                <div>
                  <p className="text-center mt-2 text-gray-900 xs:text-sm md:text-lg">
                    Min.Pembelian
                  </p>
                  <div className="font-semibold text-lg text-center xs:text-sm md:text-lg">
                    {range.minQty} -{" "}
                    {range.maxQty === Infinity ? ">" : range.maxQty}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-start items-center mt-4 mb-4 md:justify-center lg:justify-start">
            <div className="pr-4 xs:text-base md:text-xl ">Total Pesanan</div>
            <button
              onClick={decreaseQty}
              className="bg-primary-main text-white rounded-l-md xs:p-2.5 md:p-3.5"
            >
              -
            </button>
            <div className="border border-primary-main xs:p-2 md:p-3">
              {data.product_qty}
            </div>
            <button
              onClick={increaseQty}
              className="bg-primary-main text-white rounded-r-md xs:p-2.5 md:p-3.5"
            >
              +
            </button>
            <div className="flex xs:flex-col md:flex-row">
              <div className="font-bold pl-2 xs:text-base md:text-xl lg:text-2xl">
                {formatMoney(calculateDiscountedPrice(data.product_qty))}
              </div>
              <div className="pl-2 xs:text-sm md:text-lg">
                {formatMoney(calculateDiscountedPricePerUnit(data.product_qty))}{" "}
                /Kg
              </div>
            </div>
          </div>
          <hr />
        </div>
      </div>
      {/* <div className="mt-4">
        <h3 className="text-lg font-bold xs:text-base md:text-2xl">
          Subtotal Harga dari Keseluruhan Produk:
        </h3>
        <p className="text-secondary-main font-bold xs:text-base md:text-2xl ">
          {formatMoney(calculateSubtotal())}
        </p>
      </div> */}
    </>
  );
}
