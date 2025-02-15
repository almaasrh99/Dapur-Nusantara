'use client';
import CartItem from '@/components/cart-item';
import { useAppContext } from '@/context';
import { formatMoney } from '@/lib/helpers';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

export default function Cart() {
  const { myCarts, deletAllCart, selectedItems, setSelectedItems } = useAppContext();
  const [isCheckAll, setIsCheckAll] = useState(false);

  const handleSelectAll = () => {
    const getInput = document.getElementsByTagName('input');
    setIsCheckAll(!isCheckAll);
    if (isCheckAll) {
      for (var i = 0; i < getInput.length; i++) {
        getInput[i].checked = false;
      }
      setSelectedItems([]);
    } else {
      for (var i = 0; i < getInput.length; i++) {
        getInput[i].checked = true;
      }
      setSelectedItems(myCarts);
    }
  };

  const getTotalSelectedItems = () => {
    var total = 0;
    selectedItems.map((i: any) => {
      let jumlah = i.product_harga * i.product_qty;
      total += jumlah;
    });
    return total;
  };

  const deleteAllCarts = () => {
    Swal.fire({
      text: `Apakah Kamu yakin inging menghapus ${myCarts.length} Produk terpilih dari keranjang ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Tidak',
      reverseButtons: true,
      confirmButtonColor: '#6bc84d',
    }).then((result: any) => {
      if (result.isConfirmed) {
        deletAllCart();
      }
    });
  };

  const buildCart = () => {
    const handleClick = (e: any, item: any) => {
      const { checked, id } = e.target;
      if (!checked) {
        setSelectedItems(selectedItems.filter((i: any) => i.product_id != id));
      } else {
        const newSelectedItems = [...selectedItems, item];
        setSelectedItems(newSelectedItems);
      }
    };
    return (
      <div className="flex items-start gap-3 lg:mx-10">
        <div className="w-full lg:w-2/3 lg:my-14 lg:p-5 lg:rounded-lg lg:bg-white ">
          <div className="px-3 py-2">
            <div className="font-bold text-xl mb-4 ">Keranjang Belanja Anda</div>
            <div className="flex justify-between">
              <div className="flex gap-2.5">
                <input
                  type="checkbox"
                  className="accent-primary-main min-w-6 lg:w-7"
                  name="selectAll"
                  id="selectAll"
                  checked={selectedItems.length == myCarts.length ? true : false}
                  onChange={handleSelectAll}
                />
                <div>Pilih Semua</div>
              </div>
              <div className="font-bold cursor-pointer" onClick={deleteAllCarts}>
                Hapus <span>({myCarts.length})</span>
              </div>
            </div>
          </div>
          <hr className="border-2 border-gray-800 my-2" />

          {myCarts.map((item: any) => (
            <>
              <div className="px-3 py-4 flex gap-3 ">
                <input
                  id={item.product_id}
                  type="checkbox"
                  className="accent-primary-main min-w-6 lg:w-7"
                  onChange={(e) => handleClick(e, item)}
                  checked={selectedItems.find((i: any) => i.product_id === item.product_id)}
                />
                <CartItem data={item} />
              </div>
              <hr />
            </>
          ))}
        </div>
        <div className="hidden lg:block w-1/3">
          <div className="my-14 p-5 rounded-lg bg-white px-3">
            <div className="font-bold text-xl text-center">Detail Pembayaran</div>
            <hr className="my-4" />
            <div className="flex flex-col gap-3 ">
              <div className="flex justify-between">
                <div className="">Jumlah</div>
                <div className="font-bold">{selectedItems.length} Items</div>
              </div>
              <div className="flex justify-between">
                <div className="font-bold">Total</div>
                <div className="font-bold">{formatMoney(getTotalSelectedItems())}</div>
              </div>
            </div>
            <hr className="my-4" />
            {selectedItems.length <= 0 ? (
              <div className="py-3 mx-20 cursor-pointer bg-gray-500 text-center rounded-3xl text-white text-lg font-semibold">
                Checkout
              </div>
            ) : (
              <Link href={'/checkout'} className="no-underline">
                <div className="py-3 mx-20 cursor-pointer bg-primary-main text-center rounded-3xl text-white text-lg font-semibold">
                  Checkout
                </div>
              </Link>
            )}
            <div className="flex flex-col gap-3 mt-4">
              <div className="py-3 bg-secondary-main text-center rounded-3xl text-white text-lg font-semibold">
                Lihat Keranjang Tersimpan
              </div>
              <div className="py-3 text-center rounded-3xl text-primary-main border-2 border-primary-main text-lg font-semibold">
                Berlangganan
              </div>
              <div className="py-3 text-center rounded-3xl text-primary-main border-2 border-primary-main text-lg font-semibold">
                Simpan Keranjang
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="lg:bg-slate-50 flex flex-col justify-between h-full">
      {myCarts.length <= 0 ? (
        <div className="flex items-center justify-center flex-col h-screen ">
          <Image src={'/assets/img/empty-cart.png'} width={256} height={100} objectFit="cover" alt="EmptyCart.png" />
          <div>Kamu masih belum memiliki produk pada Keranjang belanja</div>
        </div>
      ) : (
        buildCart()
      )}
      <section className="lg:hidden shadow-bottom-shadow bg-white sticky bottom-0">
        <div className="grid grid-cols-2 ">
          <div className="flex gap-2 rounded-tl-2xl border-r-0 border border-primary-main lg:px-3 justify-center py-7 text-lg font-bold text-primary-main">
            <Image src={'/assets/icons/subscription.svg'} width={23} height={23} alt="Subscription" />
            Berlangganan
          </div>
          <div className="flex gap-2 border rounded-tr-2xl border-primary-main lg:px-3  justify-center py-7 text-lg font-bold text-primary-main">
            <Image src={'/assets/icons/subscription.svg'} width={23} height={23} alt="Subscription" />
            Simpan Keranjang
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="flex flex-col border border-primary-main border-r-0 gap-2 px-3 text-lg justify-center items-center  ">
            {myCarts.length != 0 ? (
              <div>
                <div>
                  Jumlah : <span className="font-bold">{selectedItems.length} Items</span>
                </div>
                <div className="font-bold">Total : {formatMoney(getTotalSelectedItems())}</div>
              </div>
            ) : (
              <div>No Items</div>
            )}
          </div>
          {selectedItems.length <= 0 ? (
            <div className="flex gap-2 px-3 justify-center py-7 text-lg font-bold text-white bg-gray-500">Checkout</div>
          ) : (
            <Link href={'/checkout'} className="no-underline">
              <div className="flex gap-2 px-3 justify-center py-7 text-lg font-bold text-white bg-primary-main">
                Checkout
              </div>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
