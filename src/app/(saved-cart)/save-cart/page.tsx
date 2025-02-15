"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { formatMoney, soldAmount } from "@/lib/helpers";
import Swal from "sweetalert2";
import Modal from "react-modal";
import CardProductRecommend from "../../../components/card-product-recommend";
import { useAppContext } from "@/context";
import { useRouter } from "next/navigation";

export default function SaveCart() {
  const [saveCarts, setSaveCarts] = useState([]);
  const [cartName, setCartName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { myCarts, selectedItems, setSelectedItems, addToCart } =
    useAppContext();
  const router = useRouter();

  // Memuat cart yang disimpan dari localStorage saat komponen dimuat

  useEffect(() => {
    const savedCarts = localStorage.getItem("saveCarts");
    setSaveCarts(savedCarts ? JSON.parse(savedCarts) : []);
  }, []);

  console.log(saveCarts);

  const images = [
    "/assets/icon/icon-cart.png",
    "/assets/icon/icon-cart2.png",
    "/assets/icon/icon-cart3.png",
    "/assets/icon/icon-cart4.png",
    "/assets/icon/icon-cart5.png",
    "/assets/icon/icon-cart6.png",
  ];

  const removeAllCarts = () => {
    localStorage.removeItem("saveCarts");
    setSaveCarts([]);
  };

  //Membuat keranjang baru dan menampilkan modal untuk memilih produk yang akan dimasukkan
  const handleAddSaveCart = (e: any) => {
    e.preventDefault();

    const saveCarts = JSON.parse(localStorage.getItem("saveCarts") || "[]");
    const newCart = {
      name: cartName,
      items: [],
    };

    const cartExists = saveCarts.some((cart: any) => cart.name === cartName);

    if (cartExists) {
      Swal.fire({
        title: "Tidak Dapat Membuat Keranjang!",
        text: "Kamu sudah memiliki keranjang dengan nama yang sama!",
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else {
      saveCarts.push(newCart);
      localStorage.setItem("saveCarts", JSON.stringify(saveCarts));

      Swal.fire({
        title: `${cartName} berhasil dibuat!`,
        icon: "success",
        confirmButtonText: "Oke",
        confirmButtonColor: "#6bc84d",
        customClass: {
          confirmButton: "button-primary",
        },
        willClose: () => {
          setIsModalOpen(true);
        },
      });
    }
  };

  //Tutup Modal Simpan Keranjang
  const handleCloseModalSaveCart = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  //Fungsi menambahkan produk rekomendasi kedalam cart yang baru dibuat

  const handleAddToCart = (e: any) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      // Tampilkan peringatan sukses saat produk ditambahkan ke troli
      Swal.fire({
        title: "Pilih produk dulu ya!",
        text: "Tidak ada produk yang dipilih!",
        icon: "warning",
        confirmButtonText: "Close",
        confirmButtonColor: "#d33",
        customClass: {
          confirmButton: "button-primary",
        },
      });
      return;
    }

    const saveCarts = JSON.parse(localStorage.getItem("saveCarts") || "[]");
    const newCart = {
      name: cartName,
      items: selectedItems.map((item: { product_id: any }) => {
        const foundItem = myCarts.find(
          (i: any) => i.product_id === item.product_id
        );
        return {
          product_id: foundItem.product_id,
          product_img: foundItem.product_img,
          product_name: foundItem.product_name,
          product_qty: foundItem.product_qty,
          product_harga: foundItem.product_harga,
        };
      }),
    };

    const cartExists = saveCarts.some((cart: any) => cart.name === cartName);

    if (cartExists) {
      // Temukan keranjang yang sudah ada dan tambahkan item baru ke dalamnya
      const existingCartIndex = saveCarts.findIndex(
        (cart: any) => cart.name === cartName
      );
      if (existingCartIndex !== -1) {
        saveCarts[existingCartIndex].items = [
          ...saveCarts[existingCartIndex].items,
          ...newCart.items,
        ];
        localStorage.setItem("saveCarts", JSON.stringify(saveCarts));
        Swal.fire({
          title: "Produk Berhasil Ditambahkan !",
          text: `Produk telah ditambahkan pada ${cartName}!`,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#6bb84d",
          willClose: () => {
            setIsModalOpen(false);
            window.location.reload();
          },
        });
      }
    } else {
      Swal.fire({
        title: "Gagal Memasukkan Produk!",
        text: "Produk tidak dapat dimasukkan kedalam cart!",
        icon: "error",
        confirmButtonText: "Oke",
        confirmButtonColor: "#6bc84d",
        customClass: {
          confirmButton: "button-primary",
        },
      });
    }
  };

  //Fungsi untuk melakukan select item dengan checkbox
  const handleClick = (e: any, item: any) => {
    const { checked, id } = e.target;
    if (!checked) {
      setSelectedItems(selectedItems.filter((i: any) => i.product_id != id));
    } else {
      const newSelectedItems = [...selectedItems, item];
      setSelectedItems(newSelectedItems);
    }
  };

  //Fungsi untuk melakukan checkout keranjang tersimpan

  const handleCheckout = (carts: any, index: any) => {
    if (carts.items.length === 0) {
      Swal.fire({
        title: "Keranjang Kosong!",
        text: "Tidak ada produk yang di simpan!",
        imageUrl: "../assets/icon/ic_round-warning.svg",
        imageHeight: 100,
        confirmButtonText: "Oke",
        confirmButtonColor: "#d33",
        customClass: {
          confirmButton: "button-primary",
        },
      });
      return;
    } else {
      addToCart(carts.items);
    setSelectedItems(carts.items);

    const saveCarts = JSON.parse(localStorage.getItem("saveCarts") || "[]");

    const selectedCart = saveCarts[index];

    const cartName = selectedCart.name;

    router.push("/cart");
    Swal.fire({
      title: `Produk dari ${cartName} berhasil di-checkout!`,
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
    <div className="w-full">
      <div className="w-full flex-col justify-center items-center inline-flex mb-10 xs:gap-2 xs:p-2 md:p-4 lg:gap-3 xl:gap-4">
        <form
          onSubmit={handleAddSaveCart}
          className=" justify-center items-start gap-6 flex-col lg:mt-4 xs:p-4 xs:w-full md:w-2/3 lg:w-1/2"
        >
          <div className="gap-4 ">
            <label className=" text-black text-2xl font-bold font-['Helvetica'] leading-10 xs:text-lg md:text-xl lg:text-2xl">
              Buat Keranjang Baru
            </label>
            <div className="flex gap-2 mt-4 xs:gap-2 xs:mt-2 md:gap-4 md:mt-4">
              <input
                className="form-input"
                id="cartName"
                type="text"
                placeholder="Masukkan nama keranjang"
                value={cartName}
                onChange={(e) => setCartName(e.target.value)}
                required
              />

              <button
                type="submit"
                className="button-primary xs:w-1/2 lg:w-1/3 "
              >
                Buat
              </button>
            </div>
          </div>
        </form>
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModalSaveCart}
            contentLabel="Simpan Keranjang"
            className={`w-full p-8 flex items-center justify-center outline-none xs:pl-0 xs:pr-0 lg:pl-10 lg:pr-10 xl:pl-24 xl:pr-24  ${
              isModalOpen ? "animate-slide-in" : "animate-slide-out"
            }`}
            overlayClassName="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center xs:bottom-0"
          >
            <div className="bg-white rounded-lg w-full sm:w-3/4 md:w-full lg:w-full">
              <div className="gap-2">
                <div className="w-full flex justify-between items-center bg-white shadow-md rounded-tr-lg rounded-tl-lg xs:p-2 md:p-4">
                  <img
                    className="xs:w-6 xs:h-6 md:w-9 md:h-9 lg:w-10 lg:h-10"
                    src={"./assets/icon/icon-check.svg"}
                  />
                  <h2 className="text-2xl text-left font-bold p-2 xs:text-xl lg:text-3xl">
                    {cartName} Berhasil Dibuat
                  </h2>
                  <button
                    onClick={handleCloseModalSaveCart}
                    className=" text-white rounded px-2 py-1"
                  >
                    <img
                      src="./assets/icon/close-btn.svg"
                      className="h-8 w-8 xs:w-4 xs:h-4 lg:h-6 lg:w-6"
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-start items-center mt-4 xs:justify-center md:justify-start">
                <h1 className="font-bold xs:text-lg md:text-xl md:pl-10 lg:text-2xl xl:pl-8 xl:pr-8">
                  Produk Rekomendasi
                </h1>
              </div>
              {myCarts.length > 0 ? (
                <div className="grid overflow-auto justify-items-center xs:grid-cols-1 xs:mb-36 xs:mt-4 xs:gap-4 xs:p-2 xs:h-[550px] min-[400px]:grid-cols-3 min-[400px]:p-4 min-[400px]:mb-28 md:mt-0 md:p-8 md:grid-cols-3 md:gap-6 md:mb-24 lg:grid-cols-4 lg:h-[26rem] lg:mb- lg:p-6 xl:h-[18rem] xl:mt-0 xl:mb-4 xl:gap-4 xl:p-10 xl:grid-cols-5 2xl:h-[20rem]">
                  {myCarts.map((item: any) => (
                    <>
                      <div className="text-center shadow-card-shadow w-full rounded-lg xs:w-64 min-[400px]:w-[116px] min-[400px]:h-[280px] md:w-full md:h-[320px] lg:h-[350px]">
                        <div className="w-full flex items-center justify-center relative">
                          <div className="justify-center">
                            <input
                              id={item.product_id}
                              type="checkbox"
                              className="accent-primary-main m-2 w-5 h-5 top-0 left-0 absolute"
                              onChange={(e) => handleClick(e, item)}
                              checked={selectedItems.find(
                                (i: any) => i.product_id === item.product_id
                              )}
                            />
                            <CardProductRecommend data={item} />
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              ) : (
                <div className="w-full flex items-center gap-3 justify-center flex-col xs:h-[550px] lg:h-[28rem] ">
                  <Image
                    src={"/assets/img/empty-cart.png"}
                    width={240}
                    height={100}
                    objectFit="cover"
                    alt="EmptyCart.png"
                  />
                  <h1 className="text-2xl font-bold text-center">
                    Kamu belum memiliki produk yang tersimpan di keranjang !
                  </h1>
                  <p className="text-xl text-center font-semibold">
                    Cari produk dulu yuk !
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="button-primary w-1/3"
                  >
                    + Pilih Produk
                  </button>
                </div>
              )}
              <div className="w-full flex justify-center bg-white items-center xs:p-0 lg:p-4 lg:bg-transparent lg:pt-12 xl:w-full xl:h-10">
                {myCarts.length > 0 && (
                  <div className=" fixed flex justify-center shadow-bottom-shadow items-center xs:bg-white xs:p-4 xs:bottom-0 xs:w-full xs:gap-2 xs:pl-0 xs:pr-0 md:bg-none md:gap-4 md:p-4 lg:w-[90%] lg:mb-0 lg:rounded-bl-lg lg:rounded-br-lg lg:p-4 lg:pl-20 lg:pr-20 lg:gap-4 lg:bottom-10 xl:p-2 xl:bottom-4 xl:w-[85%] 2xl:bottom-32 2xl:w-[1253px]">
                    <button
                      onClick={handleCloseModalSaveCart}
                      type="submit"
                      className="button-secondary text-primary-main xs:h-20 xs:w-60 xs:rounded-none xs:rounded-tl-xl xs:rounded-tr-xl xs:shadow-bottom-shadow md:rounded-2xl lg:w-72 lg:h-16 lg:shadow-none "
                    >
                      Lewati
                    </button>
                    <button
                      onClick={handleAddToCart}
                      type="submit"
                      className="button-primary xs:h-20 xs:rounded-none xs:rounded-tl-xl xs:rounded-tr-xl xs:w-60 md:rounded-2xl lg:w-72 lg:h-16 xs:shadow-bottom-shadow lg:shadow-none "
                    >
                      Tambahkan
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )}
        {/* <button
          onClick={removeAllCarts}
          className="bg-red-500 text-white p-4 rounded-xl text-xl font-semibold "
        >
          Hapus Semua Keranjang Tersimpan
        </button> */}
        <div className=" w-full justify-center items-center">
          {saveCarts.length === 0 ? (
            <div className="w-full flex items-center justify-center flex-col h-screen ">
              <Image
                src={"/assets/img/empty-cart.png"}
                width={256}
                height={100}
                objectFit="cover"
                alt="EmptyCart.png"
              />
              <h1 className="text-2xl font-semibold text-center">
                Kamu masih belum memiliki produk pada Keranjang belanja
              </h1>
            </div>
          ) : (
            <div className=" grid p-2 xs:p-2 xs:gap-y-8 xs:grid-cols-1 md:w-full md:gap-y-6 md:pl-10 md:pr-10 md:grid-cols-1 lg:flex-row lg:grid-cols-2 lg:gap-y-6 lg:gap-x-6 xl:gap-y-8 xl:gap-x-0">
              {saveCarts.map((cart: any, index) => {
                const randomImage =
                  images[Math.floor(Math.random() * images.length)];
                return (
                  <div
                    key={index}
                    className="w-full justify-center items-center gap-6 inline-flex "
                  >
                    <div className=" bg-white rounded-2xl shadow-card-shadow  flex-col justify-center items-center gap-4 inline-flex xs:w-full xs:p-2 min-[400px]:w-[96%] md:w-full md:p-4 lg:w-full xl:w-[95%]">
                      <div className="w-full h-auto justify-start items-center gap-6 inline-flex xs:flex-col xs:gap-2 xs:justify-center min-[400px]:flex-row min-[400px]:justify-center min-[400px]:gap-4 md:gap-6 md:justify-center lg:justify-center lg:gap-4 xl:gap-6">
                        <div className="justify-start items-center gap-6 flex xs:p-2 xs:w-full min-[400px]:w-[50%] min-[400px]:justify-start min-[400px]:gap-4 md:p-2 md:w-[55%] lg:p-4 ">
                          <div className="bg-primary-surface rounded-full justify-center items-center flex xs:w-16 xs:h-[45px] min-[400px]:w-16 min-[400px]:h-10 md:w-20 md:h-14 lg:w-24 xl:w-20 xl:h-16 ">
                            <img
                              className="xs:w-6 xs:h-6 md:w-9 md:h-9 lg:w-10 lg:h-10"
                              src={randomImage}
                            />
                          </div>
                          <div className="w-full flex-col justify-start items-start inline-flex ">
                            <p className="text-black text-2xl font-bold font-['Helvetica'] leading-6 xs:text-base md:text-lg lg:text-xl xl:text-2xl">
                              {cart.name}
                            </p>
                            <p className="text-zinc-800 text-xl font-normal font-['Helvetica'] leading-loose xs:text-sm md:text-base lg:text-lg xl:text-xl">
                              {cart.items.length} Produk
                            </p>
                          </div>
                        </div>
                        <div className="justify-center items-center gap-2.5 flex">
                          <Link href={`/save-cart/${cart.name}`}>
                            <div className="text-black text-xl font-['Helvetica'] leading-loose xs:text-sm md:text-base lg:text-base xl:text-xl">
                              Lihat detail produk
                            </div>
                          </Link>
                          <img
                            src="./assets/icon/arrow-right.svg"
                            className="w-6 h-6 relative"
                          />
                        </div>
                      </div>
                      <div className="justify-center items-center grid xs:grid-cols-3 xs:gap-2.5 min-[375px]:gap-3 min-[400px]:grid-cols-3 md:gap-6 lg:gap-4 ">
                        {cart.items
                          .slice(0, 3)
                          .map((item: any, itemIndex: any) => (
                            <div
                              key={itemIndex}
                              className=" bg-white rounded-lg shadow-card-shadow flex-col justify-start items-center inline-flex xs:w-[80px] xs:h-[120px] min-[400px]:p-2 min-[400px]:w-[110px] min-[400px]:h-[135px] md:w-44 md:h-56 lg:w-32 lg:h-[195px] xl:w-44 xl:h-full"
                            >
                              <img
                                className="bg-auto rounded-tr-lg rounded-tl-lg xs:w-[70px] md:w-40 md:h-36 lg:w-28 lg:h-40 xl:w-44  "
                                src={item.product_img}
                              />
                              <div className="flex-col justify-start items-center flex xs:gap-0 xs:p-0 min-[400px]:gap-1 md:gap-2 md:p-0 lg:gap-1 ">
                                <p className="text-center leading-none text-black font-normal font-['Helvetica'] xs:text-[10px] min-[400px]:text-xs md:text-base lg:text-base xl:text-lg  ">
                                  {item.product_name}
                                </p>
                                <p className="text-center text-secondary-main text-xl font-bold font-['Helvetica'] xs:text-[10px] min-[400px]:text-xs md:text-lg lg:text-base xl:text-lg">
                                  {formatMoney(item.product_harga)} /Kg
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className="flex xs:w-2/3">
                        <button
                          onClick={() => handleCheckout(cart, index)}
                          className="button-primary xs:text-sm xs:w-full min-[400px]:text-base"
                        >
                          Checkout Keranjang
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
