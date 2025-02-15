"use client";
import CartItem from "@/components/cart-item";
import { useAppContext } from "@/context";
import { formatMoney } from "@/lib/helpers";
import Swal from "sweetalert2";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Modal from "react-modal";
import ProductSubscription from "@/components/product-subscription";
import calculateDiscountedPrice from "@/components/product-subscription";
import SubscriptionCard from "@/components/subscription-card";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomInputDate from "@/components/input-date";
import { format } from "path";

export default function Cart() {
  const { myCarts, deletAllCart, selectedItems, setSelectedItems } =
    useAppContext();
  const Swal = require("sweetalert2");
  const [isCheckAll, setIsCheckAll] = useState(false);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSubsOpen, setIsModalSubsOpen] = useState(false);
  const [selectedCart, setSelectedCart] = useState("");
  const [newCartName, setNewCartName] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [frequency, setFrequency] = useState("Harian");
  const [selectedDay, setSelectedDay] = useState("Senin");
  const [selectedMonthDate, setSelectedMonthDate] = useState(1);

  const [saveCarts, setSaveCarts] = useState(() => {
    // Mendapatkan keranjang yang disimpan dari localStorage saat komponen dipasang
    const savedCarts = localStorage.getItem("saveCarts");
    return savedCarts ? JSON.parse(savedCarts) : [];
  });

  //Array untuk menyimpan data berlangganan pada card
  const subscriptionOptions = [
    {
      duration: "1 Bulan",
      discounts: [
        { minAmount: 1000000, discount: 5 },
        { minAmount: 5000000, discount: 7 },
        { minAmount: 10000000, discount: 10 },
        { minAmount: 20000000, discount: 15 },
      ],
    },
    {
      duration: "3 Bulan",
      discounts: [
        { minAmount: 1000000, discount: 7 },
        { minAmount: 5000000, discount: 10 },
        { minAmount: 10000000, discount: 13 },
        { minAmount: 20000000, discount: 18 },
      ],
    },
    {
      duration: "6 Bulan",
      discounts: [
        { minAmount: 1000000, discount: 10 },
        { minAmount: 5000000, discount: 12 },
        { minAmount: 10000000, discount: 15 },
        { minAmount: 20000000, discount: 20 },
      ],
    },
    {
      duration: "1 Tahun",
      discounts: [
        { minAmount: 1000000, discount: 15 },
        { minAmount: 5000000, discount: 17 },
        { minAmount: 10000000, discount: 20 },
        { minAmount: 20000000, discount: 25 },
      ],
    },
  ];

  //Memastikan diskon yang diterapkan sesuai dengan minAmount
  const [selectedSubscription, setSelectedSubscription] = useState(
    subscriptionOptions[0]
  );

  //Menghitung jumlah pegiriman berdasarkan frekuensi pengiriman dan durasi berlangganan

  const calculateDeliveries = (frequency:any, duration:any) => {
    let result;

    // Handle "1 Tahun" case
    if (duration.trim().toLowerCase() === "1 tahun") {
        switch (frequency) {
            case "Harian":
                result = "Pengiriman Setiap Hari";
                break;
            case "Mingguan":
                result = `${12 * 4}x Pengiriman`;
                break;
            case "Bulanan":
                result = `${12}x Pengiriman`;
                break;
            default:
                return "Frekuensi tidak valid";
        }
    } else {
      //Hitung untuk durasi yang lain
        let deliveryCount = parseInt(duration);
        switch (frequency) {
            case "Harian":
                result = "Pengiriman Setiap Hari";
                break;
            case "Mingguan":
                result = `${deliveryCount * 4}x Pengiriman`;
                break;
            case "Bulanan":
                result = `${deliveryCount}x Pengiriman`;
                break;
            default:
                return "Frekuensi tidak valid";
        }
    }

    return result;
};


  //Validasi forn input tanggal pengiriman
  const handleMonthDateChange = (e:any) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= 31) {
      setSelectedMonthDate(value);
    } else if (value > 31) {
      setSelectedMonthDate(31);
    }
  };

  const handleMonthDateBlur = () => {
    if (!selectedMonthDate || selectedMonthDate < 1) {
      setSelectedMonthDate(1);
    }
  };

  const handleKeyDown = (e:any) => {
    const value = e.target.value;
    if (
      (e.key === 'e' || e.key === 'E') ||
      (e.key === '.' || e.key === ',') ||
      (e.key === '-' || e.key === '+') ||
      (value.length >= 2 && !isNaN(e.key)) ||
      (value === '' && e.key === '0')
    ) {
      e.preventDefault();
    }
  };

  //Memanggil subtotal dari SubscriptionCard
  const subtotal = selectedItems.reduce(
    (acc: any, i: any) => acc + i.product_harga * i.product_qty,
    0
  );

  //Fungsi untuk menghitung total harga sebelum pajak semua produk yang dipilih dari modal berlangganan
  const getTotalSelectedItemsSubs = () => {
    let total = 0;

    // Menghitung total harga semua produk tanpa diskon
    selectedItems.forEach((i: any) => {
      total += i.product_harga * i.product_qty;
    });

    // Mendapatkan diskon berdasarkan total harga dan range minAmount
    const { discounts } = selectedSubscription;
    let applicableDiscount = 0;
    for (let discount of discounts) {
      if (total >= discount.minAmount) {
        applicableDiscount = discount.discount;
      }
    }

    // Menerapkan diskon jika ada
    if (applicableDiscount > 0) {
      total = total * ((100 - applicableDiscount) / 100);
    }

    return total;
  };

  //Fungsi untuk menghitung total harga sebelum pajak semua produk yang dipilih dari modal berlangganan
  const getTotalSelectedItemsSubsPpn = () => {
    let total = 0;

    // Menghitung total harga semua produk tanpa diskon
    selectedItems.forEach((i: any) => {
      total += i.product_harga * i.product_qty;
    });

    // Mendapatkan diskon berdasarkan total harga dan range minAmount
    const { discounts } = selectedSubscription;
    let applicableDiscount = 0;
    for (let discount of discounts) {
      if (total >= discount.minAmount) {
        applicableDiscount = discount.discount;
      }
    }

    // Menerapkan diskon jika ada
    if (applicableDiscount > 0) {
      total = total * ((100 - applicableDiscount) / 100);
    }

    const PPN = total * 0.11;
    // Menambahkan PPN ke total
    total += PPN;

    //Menambhakan biaya pengiriman
    const shippingCost = 36000;
    total += shippingCost;

    return total;
  };

  const handleSelectAll = () => {
    const getInput = document.getElementsByTagName("input");
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
      text: `Apakah Kamu yakin ingin menghapus ${myCarts.length} Produk terpilih dari keranjang ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Tidak",
      reverseButtons: true,
      confirmButtonColor: "#6bc84d",
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

    //Menampilkan modal untuk melakukan simpan keranjang
    const handleModalSaveCart = () => {
      setIsModalOpen(true);
    };

    const handleCloseModalSaveCart = () => {
      setIsModalOpen(false);
    };

    //Menyimpan items terpilih ke keranjang yang sudah ada

    const handleSaveToExistingCart = (e: any) => {
      e.preventDefault();

      const newItems = selectedItems.map((item: { product_id: any }) => {
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
      });

      const existingCartIndex = saveCarts.findIndex(
        (cart: any) => cart.name.trim() === selectedCart.trim()
      );

      //Jika tidak ada produk yang dipilih , munculkan peringatan
      if (selectedItems.length === 0) {
        Swal.fire({
          title: "Tidak ada produk yang dipilih !",
          text: "Mohon pilih produk terlebih dahulu",
          icon: "warning",
          confirmButtonText: "Oke",
          confirmButtonColor: "#6bc84d",
          customClass: {
            confirmButton: "button-primary",
          },
        });
        return;
      }

      if (existingCartIndex !== -1) {
        // Jika terdapat keranjang dengan nama yang sama, tambahkan item baru ke dalamnya
        const updatedCarts = [...saveCarts];
        newItems.forEach((newItem: any) => {
          const existingItemIndex = updatedCarts[
            existingCartIndex
          ].items.findIndex(
            (item: any) => item.product_name === newItem.product_name
          );

          if (existingItemIndex !== -1) {
            // Jika item sudah ada di keranjang, tambahkan kuantitasnya
            updatedCarts[existingCartIndex].items[existingItemIndex].qty +=
              newItem.qty;
          } else {
            // Jika item tidak ada di keranjang, tambahkan sebagai item baru
            updatedCarts[existingCartIndex].items.push(newItem);
          }
        });
        setSaveCarts(updatedCarts);
        localStorage.setItem("saveCarts", JSON.stringify(updatedCarts));

        const itemsHtml = `
        <div style="display: flex; justify-content: center; ;">
          ${newItems
            .map(
              (item: {
                product_img: any;
                product_name: any;
                product_harga: any;
              }) => `
              <div style="display: flex; flex-direction: column; align-items: center; gap:5px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); padding: 10px; border-radius: 5px; margin: 10px;">
                <img
                  style= "width:280px border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; "
                  src="${item.product_img}" alt="${item.product_name}"
                />
                <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: center; gap: 2px; padding: 2px;">
                  <p style="text-align: center; color:#010101; font-size: 14px; font-weight: bold; font-family: Helvetica;">
                    ${item.product_name}
                  </p>
                  <p style="text-align: center; color:#FFBD41; font-size: 16px; font-weight: bold; font-family: Helvetica;">
                    Rp ${item.product_harga} /Kg
                  </p>
                </div>
              </div>
            `
            )
            .join("")}
        </div>
      `;
        Swal.fire({
          title: `Produk berhasil ditambahkan ke ${selectedCart}!`,
          icon: "success",
          html: `<br>${itemsHtml}`,
          confirmButtonText: "Oke",
          confirmButtonColor: "#6bc84d",
          customClass: {
            confirmButton: "button-primary",
          },
          willClose: () => {
            setIsModalOpen(false);
            window.location.reload();
          },
        });
      } else {
        // Jika tidak ada keranjang dengan nama yang sama, tampilkan kesalahan
        Swal.fire({
          title: "Pilih keranjang yang tersedia!",
          icon: "warning",
          confirmButtonText: "Oke",
          confirmButtonColor: "#6bc84d",
          customClass: {
            confirmButton: "button-primary",
          },
        });
      }
    };

    //Menyimpan items terpilih ke keranjang baru

    const handleSaveToNewCart = (e: any) => {
      e.preventDefault();

      const newSaveCart = {
        name: newCartName,
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

      const cartExists = saveCarts.some(
        (cart: any) => cart.name.trim() === newSaveCart.name.trim()
      );

      if (cartExists) {
        // Jika ada keranjang dengan nama yang sama, tampilkan SweetAlert dan jangan simpan keranjang baru
        Swal.fire({
          title: "Tidak Dapat Membuat Keranjang!",
          text: "Kamu sudah memiliki keranjang dengan nama yang sama!",
          icon: "warning",
          confirmButtonText: "OK",
        });
      } else {
        const itemsHtml = `
      <div style="display: flex; justify-content: center; ;">
        ${newSaveCart.items
          .map(
            (item: {
              product_img: any;
              product_name: any;
              product_harga: any;
            }) => `
              <div style="display: flex; flex-direction: column; align-items: center; gap:5px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); padding: 10px; border-radius: 5px; margin: 10px;">
                <img
                  style= "width:280px border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; "
                  src="${item.product_img}" alt="${item.product_name}"
                />
                <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: center; gap: 2px; padding: 2px;">
                  <p style="text-align: center; color:#010101; font-size: 14px; font-weight: bold; font-family: Helvetica;">
                    ${item.product_name}
                  </p>
                  <p style="text-align: center; color:#FFBD41; font-size: 16px; font-weight: bold; font-family: Helvetica;">
                    Rp ${item.product_harga} /Kg
                  </p>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    `;
        Swal.fire({
          title: `${newSaveCart.name} Berhasil Dibuat!`,
          html: `<br>${itemsHtml}`,
          icon: "success",
          confirmButtonText: "Oke",
          confirmButtonColor: "#6bc84d",
          customClass: {
            confirmButton: "button-primary",
          },
          willClose: () => {
            setIsModalOpen(false);
            window.location.reload();
          },
        });
        // Jika tidak ada keranjang dengan nama yang sama, simpan keranjang baru
        setSaveCarts((prevCarts: any) => {
          const updatedCarts = [...prevCarts, newSaveCart];
          localStorage.setItem("saveCarts", JSON.stringify(updatedCarts));
          return updatedCarts;
        });
      }
    };

    //Menampilkan modal untuk melakukan pembelian berlangganan
    const handleModalSubscription = () => {
      if (selectedItems.length === 0) {
        Swal.fire({
          title: "Tidak ada produk yang dipilih !",
          text: "Mohon pilih produk terlebih dahulu",
          icon: "warning",
          confirmButtonText: "Oke",
          confirmButtonColor: "#6bc84d",
          customClass: {
            confirmButton: "button-primary",
          },
        });
        return;
      }

      setIsModalSubsOpen(true);
    };

    const handleCloseModalSubscription = () => {
      setIsModalSubsOpen(false);
    };

    const today = new Date().toISOString().split("T")[0];

    //Menampilkan diskon harga yang didapatkan
    const getDiscountAmount = () => {
      let total = 0;

      // Menghitung total harga semua produk tanpa diskon
      selectedItems.forEach((i: any) => {
        total += i.product_harga * i.product_qty;
      });

      // Mendapatkan diskon berdasarkan total harga dan range minAmount
      const { discounts } = selectedSubscription;
      let applicableDiscount = 0;
      for (let discount of discounts) {
        if (total >= discount.minAmount) {
          applicableDiscount = discount.discount;
        }
      }
      const discountAmount = total * (applicableDiscount / 100);
      return discountAmount;
    };

    ////Menampilkan diskon yang diperoleh
    const getApplicableDiscount = () => {
      let total = 0;

      // Menghitung total harga semua produk tanpa diskon
      selectedItems.forEach((i: any) => {
        total += i.product_harga * i.product_qty;
      });

      // Mendapatkan diskon berdasarkan total harga dan range minAmount
      const { discounts } = selectedSubscription;
      let applicableDiscount = 0;
      for (let discount of discounts) {
        if (total >= discount.minAmount) {
          applicableDiscount = discount.discount;
        }

        return applicableDiscount;
      }
    };

    //Menghitung PPN 11%
    const getPPNAmount = () => {
      let total = 0;

      // Menghitung total harga semua produk tanpa diskon
      selectedItems.forEach((i: any) => {
        total += i.product_harga * i.product_qty;
      });

      // Mendapatkan diskon berdasarkan total harga dan range minAmount
      const ppnAmount = total * 0.11;
      return ppnAmount;
    };

    //Fungsi untuk checkout berlangganan
    const handleProceedToCheckout = () => {
      //Melakukan pengecekan apabila tanggal pengiriman kosong
     
      Swal.fire({
        icon: "success",
        title: "Produk berhasil di-checkout !",
        confirmButtonText: "Oke",
        confirmButtonColor: "#6bc84d",
      });

      const totalDiscountPrice = formatMoney(getDiscountAmount());
      const totalAmountDiscounted = formatMoney(getTotalSelectedItemsSubs());
      const totalAmountDiscountedPpn = formatMoney(
        getTotalSelectedItemsSubsPpn()
      );
      const currentDate = new Date();
      const totalDiscount = getApplicableDiscount();
      const ppnAmount = formatMoney(getPPNAmount());
      const shippingCost = 36000;
      const numberOfDeliveries = calculateDeliveries(frequency,selectedSubscription.duration);
      

      const dataToSend = {
        frequency,
        numberOfDeliveries,
        selectedDay ,
        selectedMonthDate,
        currentDate,
        selectedSubscription,
        selectedItems,
        totalAmountDiscounted,
        totalAmountDiscountedPpn,
        totalDiscount,
        totalDiscountPrice,
        shippingCost,
        ppnAmount,
      };

      // const updatedCarts = myCarts.filter((i: any) =>
      //   selectedItems.some(
      //     (selectedItem: any) => selectedItem.product_id !== i.product_id
      //   )
      // );

      // localStorage.setItem("myCarts", JSON.stringify(updatedCarts));
      localStorage.setItem("checkoutData", JSON.stringify(dataToSend));
      console.log(dataToSend);

      router.push(`/checkout-subscription`);
      return dataToSend;
    };

    return (
      <div className="flex h-[40rem]   gap-3 lg:mx-10">
        <div className="w-full overflow-auto lg:w-2/3 lg:my-8 lg:p-5 lg:rounded-lg lg:h-auto lg:bg-white xl:my-10">
          <div className="px-3 py-2">
            <div className="font-bold text-xl mb-4 ">
              Keranjang Belanja Anda
            </div>
            <div className="flex justify-between">
              <div className="flex gap-2.5">
                <input
                  type="checkbox"
                  className="accent-primary-main min-w-6 lg:w-7"
                  name="selectAll"
                  id="selectAll"
                  checked={
                    selectedItems.length == myCarts.length ? true : false
                  }
                  onChange={handleSelectAll}
                />
                <div>Pilih Semua</div>
              </div>
              <div
                className="font-bold cursor-pointer"
                onClick={deleteAllCarts}
              >
                Hapus <span>({myCarts.length})</span>
              </div>
            </div>
          </div>
          <hr className="border-4 border-gray-800 my-2" />

          {myCarts.map((item: any) => (
            <>
              <div className="px-3 py-4 flex gap-3 ">
                <input
                  id={item.product_id}
                  type="checkbox"
                  className="accent-primary-main min-w-6 lg:w-7"
                  onChange={(e) => handleClick(e, item)}
                  checked={selectedItems.find(
                    (i: any) => i.product_id === item.product_id
                  )}
                />
                <CartItem data={item} />
              </div>
              <hr />
            </>
          ))}
        </div>
        <div className="hidden lg:block w-1/3">
          <div className=" p-5 rounded-lg bg-white px-3 lg:my-8 xl:my-10">
            <div className="font-bold text-xl text-center">
              Detail Pembayaran
            </div>
            <hr className="my-4" />
            <div className="flex flex-col gap-3 ">
              <div className="flex justify-between">
                <div className="">Jumlah</div>
                <div className="font-bold">{selectedItems.length} Items</div>
              </div>
              <div className="flex justify-between">
                <div className="font-bold">Total</div>
                <div className="font-bold">
                  {formatMoney(getTotalSelectedItems())}
                </div>
              </div>
            </div>
            <hr className="my-4" />
            {selectedItems.length <= 0 ? (
              <div className="py-3 mx-20 cursor-pointer bg-gray-500 text-center rounded-3xl text-white text-lg font-semibold">
                Checkout
              </div>
            ) : (
              <Link href={"/checkout"} className="no-underline">
                <div className="py-3 mx-20 cursor-pointer bg-primary-main text-center rounded-3xl text-white text-lg font-semibold">
                  Checkout
                </div>
              </Link>
            )}
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() => router.push("/save-cart")}
                className="py-3 bg-secondary-main text-center rounded-3xl text-white text-lg font-semibold"
              >
                Lihat Keranjang Tersimpan
              </button>
              <div className="flex flex-col gap-3 ">
                <button
                  onClick={handleModalSubscription}
                  className="button-secondary w-full rounded-3xl text-primary-main"
                >
                  <Image
                    src={"/assets/icon/mdi_bell.svg"}
                    alt={"icon_bell"}
                    width={8}
                    height={8}
                    className="w-7 h-7 relative"
                  />
                  Berlangganan
                </button>
              </div>

              {/* Layout Modal Berlangganan */}

              {isModalSubsOpen && (
                <Modal
                  isOpen={isModalSubsOpen}
                  onRequestClose={handleCloseModalSubscription}
                  contentLabel="Berlangganan"
                  className={`w-full p-8 flex items-center justify-center outline-none xs:p-0 xs:pb-0 lg:pl-10 lg:pr-10 lg:pb-20  xl:pl-24 xl:pr-24 xl:pb-12 2xl:pb-20 ${
                    isModalSubsOpen ? "animate-slide-in" : "animate-slide-out"
                  }`}
                  overlayClassName="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center xs:bottom-0 xs:justify-end xs:items-end"
                >
                  <div className="bg-white h-full rounded-lg  w-full sm:w-3/4 md:w-full lg:w-full">
                    <div className="gap-4">
                      <div className="w-full z-50 flex justify-between items-center bg-white shadow-md p-2 rounded-tr-lg rounded-tl-lg xs:justify-end md:justify-between">
                        <h2 className="text-2xl font-bold p-2 xs:text-xl xs:mr-16 min-[400px]:mr-20 lg:text-2xl">
                          Berlangganan
                        </h2>

                        <button
                          onClick={handleCloseModalSubscription}
                          className=" text-white rounded px-2 py-1"
                        >
                          <img
                            src="./assets/icon/close-btn.svg"
                            className="h-8 w-8 xs:w-4 xs:h-4 lg:h-6 lg:w-6"
                          />
                        </button>
                      </div>
                      <div className="w-full overflow-auto xs:gap-2 xs:p-2 xs:h-[570px] min-[400px]:p-4 md:mt-0 md:p-4 md:gap-3 lg:h-[26rem] xl:h-80 xl:mt-0 xl:gap-4 xl:p-6 2xl:h-[30rem]">
                        {selectedItems.map((item:any, index:any) => (
                          <ProductSubscription key={index} data={item} />
                        ))}
                        <div className="w-full gap-3 flex justify-start items-center mt-4 mb-4">
                          <label
                            htmlFor="frequency"
                            className="w-52 block text-lg font-medium text-black xs:text-base md:text-xl"
                          >
                            Frekuensi Pengiriman
                          </label>
                          <select
                            id="frequency"
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="form-input w-7/12      "
                          >
                            <option value="Harian">Harian</option>
                            <option value="Mingguan">Mingguan</option>
                            <option value="Bulanan">Bulanan</option>
                          </select>
                        </div>

                        {frequency === "Mingguan" && (
                          <div className="w-full gap-3 flex justify-start items-center mt-4 mb-4">
                            <label
                              htmlFor="day"
                              className="w-52 block text-lg font-medium text-black xs:text-base md:text-xl"
                            >
                              Pilih Hari Pengiriman
                            </label>
                            <select
                              id="day"
                              value={selectedDay}
                              onChange={(e) => setSelectedDay(e.target.value)}
                              className="form-input form-input w-7/12 "
                            >
                              <option value="Senin">Senin</option>
                              <option value="Selasa">Selasa</option>
                              <option value="Rabu">Rabu</option>
                              <option value="Kamis">Kamis</option>
                              <option value="Jumat">Jumat</option>
                              <option value="Sabtu">Sabtu</option>
                              <option value="Minggu">Minggu</option>
                            </select>
                          </div>
                        )}

                        {frequency === "Bulanan" && (
                          <div className="w-full gap-3 flex justify-start items-center mt-4 mb-4">
                            <label
                              htmlFor="monthDate"
                              className="w-52 block text-lg font-medium text-black xs:text-base md:text-xl"
                            >
                              Tanggal Pengiriman
                            </label>
                            <input
                              type="number"
                              id="monthDate"
                              value={selectedMonthDate}
                              onChange={handleMonthDateChange}
                              onBlur={handleMonthDateBlur}
                              onKeyDown={handleKeyDown}
                              min="1"
                              max="31"
                              className="form-input w-7/12 "
                            />
                          </div>
                        )}
                          <hr/>
                        <div className="items-center mt-2 ">
                          <p className="block text-lg font-medium text-black xs:text-base md:text-xl">
                            Pilih Durasi Berlangganan
                          </p>
                        </div>
                        <div className="mt-3 justify-center items-center grid xs:gap-3 xs:grid-cols-1 xs:mb-4 min-[400px]:grid-cols-2 md:gap-4 lg:mb-2 lg:grid-cols-4 xl:grid-cols-4">
                          {subscriptionOptions.map((option, index) => (
                            <SubscriptionCard
                              key={index}
                              option={option}
                              isSelected={
                                selectedSubscription.duration ===
                                option.duration
                              }
                              onSelect={setSelectedSubscription}
                              subtotal={subtotal}
                              numberOfDeliveries={calculateDeliveries(frequency, option.duration)}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="w-full shadow-bottom-shadow flex items-center justify-center rounded-tr-lg rounded-tl-lg">
                        <div className="w-full flex justify-center bg-white items-center xs:p-0 lg:bg-transparent lg:rounded-br-lg lg:rounded-bl-lg">
                          <div className="flex justify-end items-center rounded-none h-20 w-full lg:flex-row lg:rounded-bl-lg">
                            <div className="flex justify-start items-center xs:flex-col xs:pr-10 md:pr-24 lg:pr-20 lg:flex-row">
                              <p className="w-auto text-center font-semibold xs:text-lg md:text-xl lg:text-2xl ">
                                Total Bayar :
                              </p>
                              <span className="text-center font-bold text-primary-main xs:p-0 xs:text-lg md:p-2 md:text-xl lg:text-2xl xl:text-3xl">
                                {formatMoney(getTotalSelectedItemsSubs())}
                              </span>
                            </div>
                            <button
                              onClick={handleProceedToCheckout}
                              type="submit"
                              className="button-primary rounded-none xs:h-full xs:w-1/2 md:w-1/2 lg:rounded-br-lg"
                            >
                              Lanjut ke Pembayaran
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              )}

              <button
                onClick={handleModalSaveCart}
                className="button-secondary w-full rounded-3xl text-primary-main"
              >
                <Image
                  src={"/assets/icon/save-cart.svg"}
                  alt={"icon_bell"}
                  width={8}
                  height={8}
                  className="w-7 h-7 relative"
                />
                Simpan Keranjang
              </button>
            </div>

            {/* Layout Modal Simpan Keranjang */}

            {isModalOpen && (
              <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModalSaveCart}
                contentLabel="Simpan Keranjang"
                className={`w-full p-8 flex items-center justify-center outline-none xs:pl-2 xs:pr-2 lg:pl-24 lg:pr-24 ${
                  isModalOpen ? "animate-slide-in" : "animate-slide-out"
                }`}
                overlayClassName="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center xs:bottom-0"
              >
                <div className="bg-white rounded-lg w-full sm:w-3/4 md:w-full lg:w-full">
                  <div className="gap-4">
                    <div className="w-full flex justify-between items-center bg-white shadow-md p-2 rounded-tr-lg rounded-tl-lg xs:justify-end md:justify-between">
                      <h2 className="text-2xl font-bold p-2 xs:text-xl xs:mr-16 lg:text-2xl">
                        Simpan Keranjang
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
                    <div className="w-full flex flex-col justify-stretch items-center xs:gap-0 md:gap-2 lg:p-4">
                      <form
                        onSubmit={handleSaveToExistingCart}
                        className="w-full"
                      >
                        <div className="w-full flex-col gap-2 ">
                          <div className="flex-col justify-center items-center p-4">
                            <p className="w-full text-2xl font-normal font-helvetica leading-4 mb-4 xs:text-lg xs:text-center min-[400px]:text-left md:text-xl lg:text-2xl">
                              Pilih keranjang untuk menyimpan produk terpilih :
                            </p>
                            <div className="flex gap-2 xs:flex-col min-[400px]:flex-row">
                              <select
                                className="form-input"
                                value={selectedCart}
                                onChange={(e) =>
                                  setSelectedCart(e.target.value)
                                }
                              >
                                <option value="">
                                  --- Pilih Keranjang ---
                                </option>
                                {saveCarts.map((cart: any, index: any) => (
                                  <option key={index} value={cart.name}>
                                    {cart.name}
                                  </option>
                                ))}
                              </select>
                              <button className="button-primary xs:text-sm xs:w-full min-[400px]:text-base min-[400px]:w-52">
                                + Tambahkan
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                      <div className="flex w-full justify-start items-center pl-4 xs:justify-center md:justify-start">
                        <Link href={"/save-cart"}>
                          <p className="font-bold text-xl xs:text-lg md:text-xl">
                            Lihat Daftar Keranjang
                          </p>
                        </Link>
                        <Image
                          src={"/assets/icon/material-symbols_double-arrow.svg"}
                          alt={"icon_bell"}
                          width={8}
                          height={8}
                          className="w-7 h-7 relative"
                        />
                      </div>
                      <hr className="w-full h-px border-2 border-primary-main mt-4 mr-4 ml-4" />
                      <form onSubmit={handleSaveToNewCart} className="w-full">
                        <div className="w-full flex-col gap-4 ">
                          <div className="flex-col justify-center items-center p-4">
                            <p className="w-56 text-2xl font-normal font-helvetica leading-10 mb-2 xs:text-lg md:text-xl lg:text-2xl">
                              Atau Buat Baru
                            </p>
                            <div className="flex gap-2 xs:flex-col min-[400px]:flex-row">
                              <input
                                className="form-input"
                                id="name_cart"
                                type="text"
                                value={newCartName}
                                placeholder="Buat Daftar Baru"
                                onChange={(e) => setNewCartName(e.target.value)}
                                required
                              />
                              <button className="button-primary xs:text-sm xs:w-full min-[400px]:text-base min-[400px]:w-52">
                                Buat
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        </div>
      </div>
    );
  };
  const handleModalSaveCart = () => {
    setIsModalOpen(true);
  };

  const handleModalSubscription = () => {
    if (selectedItems.length === 0) {
      Swal.fire({
        title: "Tidak ada produk yang dipilih !",
        text: "Mohon pilih produk terlebih dahulu",
        icon: "warning",
        confirmButtonText: "Oke",
        confirmButtonColor: "#6bc84d",
        customClass: {
          confirmButton: "button-primary",
        },
      });
      return;
    }

    setIsModalSubsOpen(true);
  };

  return (
    <div className="lg:bg-slate-50">
      {myCarts.length <= 0 ? (
        <div className="flex items-center justify-center flex-col h-screen ">
          <Image
            src={"/assets/img/empty-cart.png"}
            width={256}
            height={100}
            objectFit="cover"
            alt="EmptyCart.png"
          />
          <div>Kamu masih belum memiliki produk pada Keranjang belanja</div>
        </div>
      ) : (
        buildCart()
      )}
      <section className="lg:hidden shadow-bottom-shadow ">
        <div className="grid grid-cols-2 h-20 rounded-tl-2xl rounded-tr-2xl">
          <button
            onClick={handleModalSubscription}
            className="flex gap-2 rounded-tl-2xl border-r-0 border-1 border-primary-main justify-center items-center text-base font-bold text-primary-main"
          >
            <Image
              src={"/assets/icons/subscription.svg"}
              width={20}
              height={20}
              alt="Subscription"
            />
            Berlangganan
          </button>
          <button
            onClick={handleModalSaveCart}
            className="flex gap-2 border-1 border-l-0 rounded-tr-2xl border-primary-main justify-center items-center text-base font-bold text-primary-main"
          >
            <Image
              src={"/assets/icons/save-cart.svg"}
              width={20}
              height={20}
              alt="save-cart"
            />
            Simpan Keranjang
          </button>
        </div>
        <div className="grid grid-cols-2">
          <div className="flex flex-col border border-primary-main border-r-0 gap-2 px-3 text-lg justify-center items-center  ">
            {myCarts.length != 0 ? (
              <div>
                <div>
                  Jumlah :{" "}
                  <span className="font-bold">
                    {selectedItems.length} Items
                  </span>
                </div>
                <div className="font-bold">
                  Total : {formatMoney(getTotalSelectedItems())}
                </div>
              </div>
            ) : (
              <div>No Items</div>
            )}
          </div>
          <div className="flex gap-2 px-3 justify-center py-7 text-lg font-bold text-white bg-primary-main">
            Checkout
          </div>
        </div>
      </section>
    </div>
  );
}
