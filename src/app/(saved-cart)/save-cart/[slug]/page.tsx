"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { formatMoney } from "@/lib/helpers";
import { useAppContext } from "@/context";

function getData(slug: string) {
  const savedCarts = JSON.parse(localStorage.getItem("saveCarts") || "[]");
  const cartName = decodeURIComponent(slug);
  const cart = savedCarts.find((cart: { name: any }) => cart.name === cartName);
  console.log("Saved Cart:", cart);
  return cart;
}

export default function SaveCartDetail({
  params,
}: {
  params: { slug: string };
}) {
  const data = getData(params.slug);
  const router = useRouter();

  const [savedCarts, setSavedCarts] = useState([]);
  const { setSelectedItems, addToCart } = useAppContext();

  useEffect(() => {
    const loadedCarts = JSON.parse(localStorage.getItem("saveCarts") || "[]");
    setSavedCarts(loadedCarts);
  }, []);

  //Menampilkan ranom image
  const images = [
    "/assets/icon/icon-cart.png",
    "/assets/icon/icon-cart2.png",
    "/assets/icon/icon-cart3.png",
    "/assets/icon/icon-cart4.png",
    "/assets/icon/icon-cart5.png",
    "/assets/icon/icon-cart6.png",
  ];

  function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }

  //Fungsi untuk hapus cart tersimpan
  function handleDeleteCart() {
    Swal.fire({
      title: `Apa kamu yakin ingin menghapus ${data.name} ini?`,
      imageUrl: "../assets/icon/ic_round-warning.svg",
      imageHeight: 100,
      showCancelButton: true,
      confirmButtonText: "Konfirmasi",
      cancelButtonColor: "#d33",
      cancelButtonText: "Batal!",
      customClass: {
        confirmButton:
          "inline-block mx-2 bg-primary-main text-white py-2 px-4 rounded",
        cancelButton:
          "inline-block mx-2 bg-white border-1 border-primary-main text-primary-main py-2 px-4 rounded",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const savedCarts = JSON.parse(
          localStorage.getItem("saveCarts") || "[]"
        );
        const newSavedCarts = savedCarts.filter(
          (cart: { name: any }) => cart.name !== data.name
        );
        localStorage.setItem("saveCarts", JSON.stringify(newSavedCarts));
        router.push("/save-cart");
        Swal.fire({
          title: "Keranjang berhasil dihapus!",
          icon: "success",
          confirmButtonColor: "#6BC84D",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: `Kamu tidak jadi menghapus, keranjang ${data.name} diamankan!`,
          icon: "info",
          confirmButtonColor: "#6BC84D",
        });
      }
    });
  }

  //Fungsi untuk mengubah nama keranjang tersimpan

  function handleUpdateCartName() {
    Swal.fire({
      title: "Ubah Nama Keranjang",
      text: "Masukkan nama keranjang baru",
      input: "text",
      inputValue: data.name,
      showCancelButton: true,
      confirmButtonText: "Ubah",
      confirmButtonColor: "#6bb84d",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const savedCarts = JSON.parse(
          localStorage.getItem("saveCarts") || "[]"
        );
        const nameExists = savedCarts.some(
          (cart: { name: string }) => cart.name === result.value
        );

        if (nameExists) {
          Swal.fire({
            title: "Nama keranjang sudah ada!",
            text: "Silakan gunakan nama yang berbeda.",
            icon: "warning",
            confirmButtonText: "OK",
          });
          return;
        }

        const cartToUpdate = savedCarts.find(
          (cart: { name: string }) => cart.name === data.name
        );
        setSavedCarts(savedCarts);

        if (cartToUpdate) {
          cartToUpdate.name = result.value;
          localStorage.setItem("saveCarts", JSON.stringify(savedCarts));
          router.push("/save-cart");
          Swal.fire({
            title: "Nama keranjang Berhasil diubah!",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "Tidak dapat mengubah nama!",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  }

  //Fungsi checkout dari keranjang teirsimpan
  const handleCheckout = () => {
    if (data.items.length === 0) {
      Swal.fire({
        title: "Keranjang Kosong!",
        text: "Tidak ada produk yang di simpan!",
        imageUrl: "../assets/icon/ic_round-warning.svg",
        imageHeight: 100,
        confirmButtonText: "OK",
        confirmButtonColor: "#6bc84d",
        customClass: {
          confirmButton: "button-primary",
        },
      });
      return;
    } else {
      addToCart(data?.items);
      setSelectedItems(data?.items);

      router.push("/cart");
      Swal.fire({
        title: `Produk dari ${data.name} berhasil di-checkout!`,
        icon: "success",
        confirmButtonText: "Oke",
        confirmButtonColor: "#6bc84d",
        customClass: {
          confirmButton: "button-primary",
        },
      });
    }
  };

  return (
    <div className="w-full flex-col flex justify-center relative bg-white-soft">
      <div className="flex xs:ml-2 xs:mr-2 md:mr-10 md:ml-10">
        <div className="w-full mb-10 pl-10 pr-10 h-auto bg-white flex-col justify-center items-center gap-4 inline-flex xs:rounded-none xs:pl-0 xs:pr-0 xs:mt-2 md:justify-start md:rounded-2xl md:mt-10 md:pl-10 md:pr-10 md:gap-2 lg:justify-center lg:h-auto lg:gap-4">
          <div className="w-full justify-start items-center gap-2.5 inline-flex xs:gap-1 xs:mt-2 xs:justify-center xs:flex min-[400px]:justify-start min-[400px]:pl-4 min-[400px]:mt-4 md:gap:2.5 md:mt-10 md:justify-start">
            <Link href={"/"}>
              <img
                src="../assets/icon/home-icon.svg"
                className=" relative xs:w-6 xs:h6 md:w-9 md:h-9 xs:block min-[430px]:hidden"
              />
            </Link>
            <img
              src="../assets/icon/iconamoon_arrow-right.svg"
              className=" relative xs:w-6 xs:h6 md:w-9 md:h-9 xs:block min-[430px]:hidden"
            />
            <Link href={"/save-cart"}>
              <p className="text-center text-primary-main text-xl font-bold font-['Helvetica'] leading-loose xs:text-sm md:text-lg lg:text-xl">
                Keranjang Tersimpan
              </p>
            </Link>
            <img
              src="../assets/icon/iconamoon_arrow-right.svg"
              className=" relative xs:w-6 xs:h6 md:w-9 md:h-9"
            />
            <p className="text-center text-zinc-500 text-xl font-normal font-['Helvetica'] leading-loose xs:text-sm md:text-lg lg:text-xl">
              Detail {data?.product_name}
            </p>
          </div>
          <div className="w-full h-28 justify-between items-center gap-6 flex xs:h-32 xs:mt-4 xs:flex-col xs:justify-center xs:items-center min-[400px]:justify-between min-[400px]:items-center min-[400px]:flex-row min-[400px]:h-20 min-[400px]:mt-0 min-[400px]:gap-3 lg:mt-4">
            <div className="w-full h-28 justify-start items-center gap-6 flex xs:justify-center min-[400px]:w-10/12  min-[400px]:justify-start min-[400px]:p-2 min-[400px]:gap-3 min-[400px]:flex-row md:justify-start">
              <div className="bg-primary-surface rounded-full justify-center items-center flex xs:w-[52px] xs:h-12 min-[360px]:w-12 min-[360px]:h-12 md:w-16 md:h-[4rem] xl:w-16 xl:h-16 ">
                <img
                  className="w-10 h-10 xs:w-8 xs:h-8 md:w-10 md:h-10"
                  src={getRandomImage()}
                />
              </div>
              <div className="flex-col justify-center items-start inline-flex md:gap-3 lg:2">
                <div className="flex justify-between items-end xs:gap-2 lg:gap-8">
                  <p className="w-full text-black text-2xl font-bold font-['Helvetica'] leading-6 xs:text-base md:text-lg lg:text-xl xl:text-2xl">
                    {data?.name}
                  </p>
                  <div className="ml-4 flex justify-start items-center xs:gap-0 xs:ml-0 xs:justify-center md:gap-4 md:justify-start lg:gap-8">
                    <button
                      onClick={() => handleUpdateCartName()}
                      className="text-center inline-flex items-center"
                    >
                      <img
                        className="xs:w-5 xs:h-5 md:w-7 md:h-7 "
                        src="../assets/icon/material-edit.svg"
                      />
                      <p className="text-secondary-main  font-semibold text-lg xs:hidden lg:block md:text-base lg:text-lg">
                        Ubah
                      </p>
                    </button>
                    <button
                      onClick={() => handleDeleteCart()}
                      className="text-center inline-flex items-center xl:ml-2"
                    >
                      <img
                        className="xs:w-5 xs:h-5 md:w-7 md:h-7"
                        src="../assets/icon/delete-fill.svg"
                      />
                      <p className="text-red-500 font-semibold text-lg xs:hidden lg:block md:text-base lg:text-lg">
                        Hapus
                      </p>
                    </button>
                  </div>
                </div>

                <div className="justify-start items-center gap-2 inline-flex xs:gap-2 min-[400px]:gap-1 md:gap-2">
                  <p className="text-zinc-800 text-xl font-normal font-['Helvetica'] leading-loose xs:text-sm min-[400px]:text-xs md:text-base lg:text-lg xl:text-xl">
                    {data?.items.length} Produk
                  </p>
                  <p className="text-zinc-800 text-xl font-normal font-['Helvetica'] leading-loose xs:text-sm md:text-base lg:text-lg xl:text-xl">
                    -
                  </p>
                  <p className="text-black text-xl font-bold font-['Helvetica'] leading-loose xs:text-xs md:text-base lg:text-lg xl:text-xl">
                    {formatMoney(
                      data?.items.reduce(
                        (subtotal: any, item: any) =>
                          subtotal +
                          (Number(item.product_harga) || 0) *
                            (Number(item.product_qty) || 0),
                        0
                      ) || 0
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex xs:w-2/3 min-[400px]:p-2 md:p-0 md:w-1/2 lg:w-1/3">
              <button
                onClick={() => handleCheckout()}
                className="button-primary xs:text-sm xs:w-full min-[400px]:text-sm md:text-base lg:text-xl"
              >
                Checkout Keranjang
              </button>
            </div>
          </div>
          <hr className="w-full h-px border-3 border-stone-300 xs:border xs:mb-4"></hr>

          <div className="w-full justify-center items-center gap-6 grid mb-10 xs:gap-2 xs:grid-cols-1 xs:flex-col md:grid-cols-2 md:gap-2 md:flex-row lg:gap-4 ">
            {data?.items.map((items: any, index: any) => (
              <div
                key={index}
                className="w-full justify-center gap-4 xs:w-full xs:p-4 min-[400px]:p-2 min-[400px]:flex "
              >
                <div className="pt-2 pb-2 bg-white rounded-lg shadow-card-shadow justify-center items-center gap-6 flex xs:rounded-none xs:pl-0 xs:pr-0 xs:border-b-2 xs:border-b-stone-100 xs:shadow-none xs:w-full min-[400px]:pl-6 min-[400px]:pr-6 md:gap-3 md:rounded-lg md:p-0 md:w-[290px] md:pl-2 md:pr-2 md:shadow-card-shadow lg:pt-4 lg:pb-4 lg:gap-6 lg:w-full xl:pt-0 xl:pb-0 ">
                  <img
                    className="w-40 h-60 rounded-tr-lg rounded-tl-lg xs:w-28 xs:h-24 min-[360px]:w-[118px] md:w-24 md:h-24 lg:w-40 lg:h-32 xl:w-48 xl:h-48 "
                    src={items.product_img}
                  />
                  <div className="w-full flex-col justify-between items-start gap-6 inline-flex">
                    <div className="w-full flex-col justify-start items-start gap-6 flex xs:gap-2 md:p-2 md:gap-0 lg:p-0 lg:gap-4 xl:gap-6">
                      <div className="flex-col justify-start items-start flex">
                        <div className="justify-start items-center gap-2.5 inline-flex">
                          <div className="flex-col justify-start items-start flex xs:gap-0 xs:p-0 md:gap-0 md:p-0 lg:p-2 lg:gap-2 ">
                            <p className="text-left text-black font-bold font-['Helvetica'] xs:text-base min-[360px]:text-base lg:text-2xl">
                              {items.product_name}
                            </p>
                            <p className="mb-2 text-center text-secondary-main text-xl font-semibold font-['Helvetica'] xs:text-sm lg:text-xl">
                              {formatMoney(items.product_harga)} /Kg
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full justify-between items-center inline-flex xs:flex-col xs:justify-start xs:gap-1 xs:items-start min-[400px]:flex-row md:flex-col md:justify-end lg:items-center lg:flex-row">
                        <div className="flex-col justify-center items-start gap-6 inline-flex xs:justify-start md:justify-start lg:justify-end">
                          <p className="w-24 text-zinc-800 font-normal font-['Helvetica'] leading-loose xs:text-sm min-[400px]:text-sm md:w-20 md:text-sm lg:w-18 lg:text-base xl:w-24 xl:text-xl">
                            Jumlah : {items.product_qty}
                          </p>
                        </div>
                        <div className=" w-full justify-end gap-3 flex xs:justify-start min-[400px]:justify-end md:justify-start lg:justify-end">
                          <div className="pl-4 flex xs:pl-0 md:pl-0 lg:pl-4">
                            <p className=" text-black font-bold font-['Helvetica'] leading-10 xs:text-base min-[400px]:text-base lg:text-xl xl:text-2xl">
                              {formatMoney(
                                (Number(items.product_harga) || 0) *
                                  (Number(items.product_qty) || 0)
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
