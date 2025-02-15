"use client";

import { useAppContext } from "@/context";
import { formatMoney, soldAmount } from "@/lib/helpers";
import Image from "next/image";
import { useContext, useState } from "react";
import { toast } from "sonner";

interface Product {
  id: number;
  img: string;
  alt: string;
  nama: string;
  harga: number;
  review: number;
  terjual: number;
}

interface CartData {
  product_id: number;
  product_name: string;
  product_qty?: number; // Tambahkan properti product_qty yang opsional
  product_img: string;
  product_harga: number;
  product_review: number;
  product_terjual: number;
}

interface CardProductProps {
  data: Product;
}

export default function CardProduct({ data }: CardProductProps) {
  const { myCarts, saveMyCarts, deleteItemCart } = useAppContext();
  const searchData = myCarts.find((item: any) => item.product_id === data.id);
  const [count, setCount] = useState(searchData ? searchData.product_qty : 0);

  const cartData: CartData = {
    product_id: data.id,
    product_name: data.nama,
    product_img: data.img,
    product_harga: data.harga,
    product_review: data.review,
    product_terjual: data.terjual,
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
      cartData.product_qty = count - 1;
      toast(`${data.nama} Telah ditambahkan ke Keranjang sejumlah 1 items`);
      toast(`Jumlah Sekarang ${count - 1} items`);
      return saveMyCarts(cartData);
    } else if (count == 1) {
      setCount(count - 1);
      toast(`${data.nama} telah dihapus dari keranjang`);
      return deleteItemCart(data.id);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
    cartData.product_qty = count + 1;
    toast(`Jumlah Sekarang ${count + 1} items`);
    toast(`${data.nama} Telah ditambahkan ke Keranjang sejumlah 1 items`);
    return saveMyCarts(cartData);
  };

  return (
    <>
      <div className="text-center shadow-card-shadow w-full pb-3 py-2 rounded-lg">
        <div className="flex justify-center">
          <Image src={data.img} width={200} height={200} alt={data.alt} />
        </div>
        <div>{data.nama}</div>
        <div className="text-secondary-main text-lg font-bold">
          {formatMoney(data.harga)}/Kg
        </div>
        <div className="flex gap-2 font-light tracking-wider justify-center my-3">
          <div>⭐</div>
          <div>({data.review})</div>
          <div className="font-light">
            {" "}
            | {soldAmount(data.terjual)} Terjual
          </div>
        </div>
        <div className="flex gap-3 justify-center items-center">
          <Image
            onClick={decrementCount}
            src="/assets/icons/minus.png"
            width={30}
            height={30}
            className="cursor-pointer"
            alt="minus.png"
          />
          <div className="text-lg">{count}</div>
          <Image
            onClick={incrementCount}
            src="/assets/icons/plus.png"
            width={30}
            height={30}
            className="cursor-pointer"
            alt="plus.png"
          />
        </div>
      </div>
    </>
  );
}
