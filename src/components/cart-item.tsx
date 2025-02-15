import { useAppContext } from '@/context';
import { formatMoney } from '@/lib/helpers';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function CartItem({ data }: { data: any }) {
  const { saveMyCarts, deleteItemCart, setSelectedItems, selectedItems } = useAppContext();

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

  const handleDelete = (id: any) => {
    deleteItemCart(id);
  };

  return (
    <>
      <Image src={data.product_img} width={110} height={100} alt="" />
      <div className="flex justify-between w-full">
        <div className="flex flex-col justify-between">
          <div>
            <div className="font-bold">{data.product_name}</div>
            <div className="text-sm text-secondary-main">{formatMoney(data.product_harga)}/Kg</div>
          </div>
          <div className="flex">
            <div className="pr-4 hidden lg:block">Total Pesanan</div>
            <div onClick={decreaseQty} className="bg-primary-main px-2.5 text-white rounded-l-md">
              -
            </div>
            <div className="px-3 border border-primary-main">{data.product_qty}</div>
            <div onClick={increaseQty} className="bg-primary-main px-2.5 text-white rounded-r-md">
              +
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between items-end">
          <Image
            src="/assets/icons/delete.svg"
            width={18}
            height={18}
            alt="delete.svg"
            className="cursor-pointer"
            onClick={() => handleDelete(data.product_id)}
          />
          <div className="font-bold text-lg">{formatMoney(data.product_harga * data.product_qty)}</div>
        </div>
      </div>
      <hr />
    </>
  );
}
