"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/helpers";
import Swal from "sweetalert2";
import Modal from "react-modal";

function getData(slug: string) {
  const paymentData = JSON.parse(
    localStorage.getItem("paymentHistory") || "[]"
  );
  const orderNumber = decodeURIComponent(slug);
  const orderDetail = paymentData.find(
    (orderDetail: { orderNumber: any }) =>
      orderDetail.orderNumber === orderNumber
  );

  return orderDetail;
}

interface PaymentData {
  orderNumber: string;
}

interface Shipment {
  deliveryCode: string;
  deliveryDate: string;
  items: any[];
}

export default function SubscriptionDetail({
  params,
}: {
  params: { slug: string };
}) {
  const data = getData(params.slug);
  const router = useRouter();
  const [paymentHistory, setPaymentHistory] = useState<PaymentData[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [shipmentHistory, setShipmentHistory] = useState<Shipment[]>([]);
  const [openIndex, setOpenIndex] = useState<number[]>([]);

  // Mengambil data dari paymentHistory berdasarkan orderNumber
  useEffect(() => {
    const storedPaymentData = localStorage.getItem("paymentHistory");
    if (storedPaymentData) {
      setPaymentHistory(JSON.parse(storedPaymentData));
    }
    // Mengkonversi jika frekuensi harian maka jumlah hari dalam sebulan dikali Durasi Langganan
    if (data) {
      const selectedSubscription = parseInt(data.selectedSubscription, 10);
      let numberOfDeliveries: number;

      if (data.frequency === "Harian") {
        numberOfDeliveries = 30 * selectedSubscription; // Jumlah pengiriman harian berdasarkan bulan langganan
      } else {
        numberOfDeliveries = parseInt(data.numberOfDeliveries, 10); // Menggunakan jumlah pengiriman langsung dari data
      }

      //Konversi nama hari menjadi index hari dalam Minggu
      const daysOfWeek: { [key: string]: number } = {
        Minggu: 0,
        Senin: 1,
        Selasa: 2,
        Rabu: 3,
        Kamis: 4,
        Jumat: 5,
        Sabtu: 6,
      };

      // Inisiasi data shipmentDates kedalam array
      const shipmentDates: Shipment[] = [];

      for (let i = 0; i < numberOfDeliveries; i++) {
        const deliveryDate = new Date(data.checkoutDate);

        if (data.frequency === "Harian") {
          deliveryDate.setDate(deliveryDate.getDate() + i);
        } else if (data.frequency === "Mingguan") {
          const selectedDayIndex = daysOfWeek[data.selectedDay];
          const currentDayIndex = deliveryDate.getDay();
          let offsetDays = selectedDayIndex - currentDayIndex;
          if (offsetDays < 0) offsetDays += 7; // Jika selectedDay sudah lewat dalam minggu ini
          deliveryDate.setDate(deliveryDate.getDate() + i * 7 + offsetDays);
        } else if (data.frequency === "Bulanan") {
          deliveryDate.setMonth(deliveryDate.getMonth() + i);
          deliveryDate.setDate(data.selectedMonthDate);
        }
        //Memasukkan data kedalam shipmentHistory
        shipmentDates.push({
          deliveryCode: `SHP-${data.orderNumber}-${i + 1}`,
          deliveryDate: deliveryDate.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          items: data.selectedItems,
        });
      }

      setShipmentHistory(shipmentDates);
    }
  }, []);

  //Fungsi mengkalkulasi langganan berakhir berdasarkan durasi langganan
  const calculateSubscriptionEndDate = (
    startDate: string,
    subscriptionType: string
  ) => {
    const start = new Date(startDate);
    let durationInMonths = 0;

    switch (subscriptionType) {
      case "1 Bulan":
        durationInMonths = 1;
        break;
      case "3 Bulan":
        durationInMonths = 3;
        break;
      case "6 Bulan":
        durationInMonths = 6;
        break;
      case "1 Tahun":
        durationInMonths = 12;
        break;
      default:
        console.error("Unknown subscription type:", subscriptionType);
        return "Durasi tidak valid";
    }

    const end = new Date(start.setMonth(start.getMonth() + durationInMonths));
    const endDate = end.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const endTime = end.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    return `${endDate} ${endTime} WIB`;
  };

  //Fungsi menghitung semua quantitiy produk
  const calculateTotalQuantity = (items: any) => {
    return items.reduce(
      (total: any, item: any) => total + (Number(item.product_qty) || 0),
      0
    );
  };

  const totalQuantity = calculateTotalQuantity(data.selectedItems);

  //Fungsi untuk mengembalikan ke halaman checkout success
  const handlePaymentClick = () => {
    const index = paymentHistory.findIndex(
      (payment) => payment.orderNumber === data.orderNumber
    );
    if (index !== -1) {
      router.push(`/checkout-subscription-success?index=${index}`);
    } else {
      Swal.fire({
        title: "Oops!",
        text: "Data pembayaran tidak ditemukan. Silakan coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#FF7A45",
      });
    }
  };

  //Fungsi buka dan tutup modal riwayat pengiriman
  const handleOpenModalHistory = () => {
    setModalIsOpen(true);
  };

  const handleCloseModalHistory = () => {
    setModalIsOpen(false);
  };

  //Fungsi untuk mengelola state buka tutup accordion
  const toggleAccordion = (index: any) => {
    setOpenIndex((prevOpenIndex) =>
      prevOpenIndex.includes(index)
        ? prevOpenIndex.filter((i) => i !== index)
        : [...prevOpenIndex, index]
    );
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="w-full flex-col flex justify-center relative bg-white-soft">
      <div className="flex xs:ml-2 xs:mr-2 md:mr-10 md:ml-10 md:mb-10">
        <div className="w-full pl-10 pr-10 h-auto bg-white flex-col justify-center items-center gap-3 inline-flex xs:rounded-none xs:pl-0 xs:pr-0 xs:mt-2 md:justify-start md:rounded-2xl md:mt-10 md:pl-10 md:pr-10 md:gap-2 lg:justify-center lg:h-auto lg:gap-4">
          <div className="w-full justify-start items-center gap-2.5 inline-flex xs:gap-1 xs:mt-2 xs:justify-center xs:flex min-[400px]:justify-start min-[400px]:pl-4 min-[400px]:mt-4 md:gap:2.5 md:pl-0 md:mt-10 md:justify-start">
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
            <Link href={"/my-subscription"}>
              <p className="text-center text-primary-main text-xl font-bold font-['Helvetica'] leading-loose xs:text-sm md:text-lg lg:text-xl">
                Daftar Langganan
              </p>
            </Link>
            <img
              src="../assets/icon/iconamoon_arrow-right.svg"
              className=" relative xs:w-6 xs:h6 md:w-9 md:h-9"
            />
            <p className="text-center text-zinc-500 text-xl font-normal font-['Helvetica'] leading-loose xs:text-sm md:text-lg lg:text-xl">
              Detail {data.orderNumber}
            </p>
          </div>
          <hr className=" w-full h-px border-2 border-stone-500 "></hr>
          <div className="w-full xs:p-2 md:p-0">
            <div className="w-full justify-between items-center flex xs:gap-10 md:gap-2 ">
              <p className=" text-center bg-orange-300 rounded-xl font-bold text-gray-800 border-1 border-orange-500 xs:p-2 xs:text-sm md:text-base lg:p-3 lg:text-lg xl:text-xl">
                Paket {data.selectedSubscription} - Menunggu Pembayaran
              </p>
              <button
                className="bg-white rounded-xl font-bold text-secondary-main border-1 border-secondary-main xs:p-2 xs:text-sm md:text-base lg:p-3 lg:text-lg xl:text-xl"
                onClick={handlePaymentClick}
                disabled={paymentHistory.length === 0}
              >
                Lakukan Pembayaran
              </button>
            </div>
            <div className="w-full justify-between items-center xs:flex-col xs:justify-start xs:items-center xs:pt-3 xs:mb-2 xs:gap-2 min-[400px]:justify-between min-[400px]:items-center min-[400px]:flex-col min-[400px]:mt-0 min-[400px]:gap-3 md:gap-4 md:flex md:flex-row lg:gap-6 lg:mb-4 lg:mt-0">
              <div className="flex justify-between font-normal md:gap-3 ">
                <p className="xs:text-gray-800 xs:text-sm min-[400px]:text-lg md:text-gray-800 md:text-base md:gap-4 lg:text-lg">
                  {" "}
                  No.Pesanan{" "}
                </p>
                <p className="xs:text-black xs:font-medium xs:text-sm min-[400px]:text-lg md:font-normal md:text-gray-800 md:text-base md:gap-4 lg:text-lg">
                  {data.orderNumber}
                </p>
              </div>
              <div className="flex justify-between font-normal md:gap-3">
                <p className="font-normal xs:text-gray-800 xs:text-sm min-[400px]:text-lg md:text-gray-800 md:text-base md:gap-4 lg:text-lg ">
                  Tanggal Berlangganan
                </p>
                <p className="xs:text-black xs:font-medium xs:text-sm min-[400px]:text-lg md:font-normal md:text-gray-800 md:text-base md:gap-4 lg:text-lg">
                  {" "}
                  {data.checkoutDate
                    ? `${new Date(data.checkoutDate).toLocaleDateString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )} ${new Date(data.checkoutDate).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }
                      )}`
                    : "Tanggal tidak tersedia"}{" "}
                  WIB
                </p>
              </div>
            </div>
            <div className="w-full border-t border-dashed border-primary-main my-1 xs:p-0 md:p-2"></div>
          </div>
          <div className="w-full flex gap-3 flex-col justify-start items-start xs:p-2 md:p-0">
            <h1 className="font-bold xs:text-lg md:text-lg lg:text-xl">
              Rincian Langganan
            </h1>
            <div className="flex flex-col justify-center items-start xs:gap-2 md:gap-3 lg:gap-4">
              <div className="flex gap-2 justify-start items-center">
                <p className="text-gray-600 xs:text-xs min-[400px]:text-sm xs:w-32 min-[375px]:w-30 min-[400px]:w-36 md:text-lg md:w-44">
                  Durasi Berlangganan
                </p>
                <span>:</span>
                <p className="text-black xs:text-sm md:text-lg ">
                  {data.selectedSubscription}{" "}
                </p>
              </div>
              <div className="flex gap-2 justify-start items-center ">
                <p className="text-gray-600 xs:text-xs min-[400px]:text-sm xs:w-32 min-[375px]:w-30 min-[400px]:w-36 md:text-lg md:w-44">
                  Diskon Langganan
                </p>
                <span>:</span>
                <p className="text-black xs:text-sm md:text-lg ">
                  {" "}
                  {data.totalDiscount} %
                </p>
              </div>
              <div className="flex gap-2 justify-start items-start">
                <p className="text-gray-600 xs:text-xs min-[400px]:text-sm xs:w-[10rem] min-[375px]:w-[8rem] min-[400px]:w-36 md:text-lg md:w-44">
                  Langganan Berakhir
                </p>
                <span>:</span>
                <p className="text-black xs:text-sm md:text-lg w-auto ">
                  {data.selectedSubscription
                    ? calculateSubscriptionEndDate(
                        data.checkoutDate,
                        data.selectedSubscription
                      )
                    : "Durasi tidak tersedia"}{" "}
                </p>
              </div>
              <div className="flex gap-2 justify-start items-center">
                <p className="text-gray-600 xs:text-xs min-[400px]:text-sm xs:w-32 min-[375px]:w-30 min-[400px]:w-36 md:text-lg md:w-44   ">
                  Frekuensi Pengiriman
                </p>
                <span>:</span>
                <p className="text-black xs:text-sm md:text-lg ">
                  {data.frequency}
                </p>
              </div>
              <div className="flex gap-2 justify-start items-start">
                <p className="text-gray-600 xs:text-xs min-[400px]:text-sm xs:w-[10rem] min-[375px]:w-[8rem] min-[400px]:w-36 md:text-lg md:w-44   ">
                  Jadwal Pengiriman
                </p>
                <span>:</span>
                <p className="text-black xs:text-sm md:text-lg ">
                  {data.frequency === "Mingguan"
                    ? `Setiap ${data.selectedDay} - ${data.numberOfDeliveries}`
                    : data.frequency === "Bulanan"
                    ? `Setiap Tgl ${data.selectedMonthDate} - ${data.numberOfDeliveries}`
                    : data.numberOfDeliveries}
                </p>
              </div>
            </div>
          </div>
          <hr className=" w-full h-px border-2 border-stone-500 "></hr>
          <div className="w-full flex gap-3 flex-col justify-start items-start xs:p-2 md:p-0">
            <div className="w-full flex justify-between items-center">
              <h1 className="font-bold xs:text-base md:text-lg lg:text-xl">
                Info Pengiriman
              </h1>
              <button
                onClick={handleOpenModalHistory}
                className="bg-white rounded-xl font-bold text-primary-main border-1 border-primary-main xs:p-2 xs:text-sm md:text-base lg:p-3 lg:text-lg xl:text-xl"
              >
                Riwayat Pengiriman
              </button>
            </div>

            {/* Modal Riwayat Pengiriman*/}
            {modalIsOpen && (
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={handleCloseModalHistory}
                contentLabel="Berlangganan"
                className={`w-full h-full p-0 flex items-center justify-center outline-none  ${
                  modalIsOpen ? "animate-slide-in" : "animate-slide-out"
                }`}
                overlayClassName="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center"
              >
                <div className="bg-white h-full rounded-tr-lg rounded-tl-lg  w-full sm:w-3/4 md:w-full lg:w-full">
                  <div className="gap-4">
                    <div className="w-full z-50 flex justify-between items-center bg-white shadow-md p-2 rounded-tr-lg rounded-tl-lg xs:justify-end md:justify-between">
                      <h2 className="text-2xl font-bold p-2 xs:text-xl xs:mr-8 min-[400px]:mr-20 lg:text-2xl">
                        Riwayat Pengiriman
                      </h2>

                      <button
                        onClick={handleCloseModalHistory}
                        className=" text-white rounded px-2 py-1"
                      >
                        <img
                          src="../assets/icon/close-btn.svg"
                          className="h-8 w-8 xs:w-4 xs:h-4 lg:h-6 lg:w-6"
                        />
                      </button>
                    </div>
                    <div className="w-full overflow-y-auto flex flex-col justify-start items-start xs:p-4 xs:h-[45rem] xs:gap-4 md:p-6 lg:h-[45rem] lg:gap-6 lg:p-8 xl:p-10 xl:h-[30rem] ">
                      {shipmentHistory.map((shipment, index) => (
                        <div
                          key={index}
                          className="shipment-history-item w-full"
                        >
                          <div className="flex font-bold justify-start items-start xs:gap-0 xs:flex-col md:flex-row md:gap-2">
                            <p className="font-bold text-lg">
                              Pengiriman Ke-{index + 1} dari{" "}
                              {shipmentHistory.length}
                            </p>
                            <span className="hidden md:block"> - </span>
                            <p>Kode : {shipment.deliveryCode}</p>
                          </div>
                          <div className="flex justify-start gap-2 items-center">
                            <p className="font-bold">Tanggal Pengiriman </p>{" "}
                            <span> : </span> <p>{shipment.deliveryDate}</p>
                          </div>
                          <div className="mt-2">
                            <div
                              onClick={() => toggleAccordion(index)}
                              className=" mb-2 font-bold cursor-pointer gap-4 flex justify-start items-center "
                            >
                              <span className="">List Produk Dikirim</span>
                              <svg
                                className={`w-6 h-6 transform transition-transform duration-300 ${
                                  openIndex.includes(index)
                                    ? "rotate-180 text-primary-main"
                                    : "rotate-0 text-primary-main"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                ></path>
                              </svg>
                            </div>
                            {openIndex.includes(index) && (
                              <div className="w-full mb-2 gap-2 grid xs:grid-cols-1 md:grid-cols-3">
                                {shipment.items.map((item, itemIndex) => (
                                  <div
                                    key={itemIndex}
                                    className="w-full justify-start flex gap-2 p-2 "
                                  >
                                    <div className="pt-2 pb-2 bg-white rounded-lg shadow-card-shadow justify-start items-center gap-6 flex xs:w-full min-[400px]:pl-3 min-[400px]:pr-3 md:gap-3 md:rounded-lg md:p-0 md:w-[290px] md:pl-2 md:pr-2 lg:pt-4 lg:pb-4 lg:gap-6 lg:w-full ">
                                      <img
                                        className=" rounded-tr-lg rounded-tl-lg xs:w-24 xs:h-24 md:w-20 md:h-20 lg:w-30 lg:h-30 "
                                        src={item.product_img}
                                      />
                                      <div className="justify-start flex flex-col gap-2">
                                        <p className="font-bold xs:text-lg md:text-base lg:text-xl">
                                          {item.product_name}
                                        </p>
                                        <p>Dikirim : {item.product_qty} unit</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <hr />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Modal>
            )}

            <div className="flex flex-col  justify-center items-start xs:gap-2 md:gap-3 lg:gap-4">
              <div className="flex gap-2 justify-start items-start">
                <p className="flex text-gray-600 xs:text-sm xs:w-44 md:text-lg  ">
                  Alamat Pengiriman
                </p>
                <span>:</span>
                <div className="flex flex-col">
                  <p className="text-black xs:text-sm md:text-lg ">
                    {" "}
                    ({data.selectedAddress.labelAddress})
                  </p>
                  <p className="text-black font-bold xs:text-sm md:text-lg ">
                    {data.selectedAddress.nameAddress} -{" "}
                    {data.selectedAddress.businessType} {""}
                    {data.selectedAddress.companyName}
                  </p>
                  <p className="text-black xs:text-sm md:text-lg ">
                    {" "}
                    {data.selectedAddress.phoneNumberAddress}
                  </p>
                  <p className="text-black xs:text-sm md:text-lg ">
                    {" "}
                    {data.selectedAddress.address} - Kode Pos :{" "}
                    {data.selectedAddress.postalZip},{" "}
                    {data.selectedAddress.city} -{" "}
                    {data.selectedAddress.province}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 justify-start items-center">
                <p className="flex text-gray-600 xs:text-sm xs:w-30 md:text-lg md:w-44 ">
                  Metode Pengiriman
                </p>
                <span>:</span>
                <p className="text-black xs:text-sm md:text-lg ">
                  Pengiriman Reguler
                </p>
              </div>
              {/* <div className="flex gap-2 justify-start items-center">
                <p className="flex text-gray-600 xs:text-sm xs:w-30 md:text-lg md:w-44">
                  Status Pengiriman
                </p>
                <span className="text-gray-600 xs:text-sm md:text-lg">:</span>
                <p className="text-black xs:text-sm md:text-lg ">-</p>
              </div> */}
            </div>
          </div>
          <hr className=" w-full h-px border-2 border-stone-500 "></hr>
          <div className="w-full xs:p-2 md:p-0">
            <h1 className="font-bold xs:text-base md:text-lg lg:text-xl">
              Detail Produk
            </h1>
            <div className="flex justify-start gap-2.5 mt-3">
              <p className="text-gray-600 xs:text-sm md:text-lg">
                Jumlah Produk{" "}
              </p>
              <span> : </span>
              <p className="mb-2 text-black xs:text-sm md:text-lg">
                {data.selectedItems.length} Produk
              </p>
            </div>

            <div className="w-full justify-center items-center grid xs:gap-2 xs:grid-cols-1 xs:flex-col md:grid-cols-2 md:gap-2 md:flex-row lg:gap-2 lg:grid-cols-2 xl:grid-cols-3 ">
              {data.selectedItems.map((items: any, index: any) => (
                <div
                  key={index}
                  className="w-full justify-center gap-2 xs:w-full xs:p-4 min-[400px]:p-2 min-[400px]:flex md:p-1 "
                >
                  <div className="pt-2 pb-2 bg-white rounded-lg shadow-card-shadow justify-center items-center gap-6 flex xs:rounded-none xs:pl-0 xs:pr-0 xs:border-b-2 xs:border-b-stone-100 xs:shadow-none xs:w-full min-[400px]:pl-3 min-[400px]:pr-3 md:gap-3 md:rounded-lg md:p-0 md:w-[290px] md:pl-2 md:pr-2 md:shadow-card-shadow lg:pt-4 lg:pb-4 lg:gap-6 lg:w-full xl:pt-0 xl:pb-0 ">
                    <img
                      className=" rounded-tr-lg rounded-tl-lg xs:w-28 xs:h-24 min-[360px]:w-[118px] md:w-24 md:h-24 lg:w-40 lg:h-32 xl:w-32 xl:h-32 "
                      src={items.product_img}
                    />
                    <div className="w-full flex-col justify-between items-start gap-6 inline-flex">
                      <div className="w-full flex-col justify-start items-start gap-6 flex xs:gap-2 md:p-2 md:gap-0 lg:p-0 lg:gap-4 xl:gap-6">
                        <div className="flex-col justify-start items-start flex">
                          <div className="justify-start items-center gap-2.5 inline-flex">
                            <div className="flex-col justify-start items-start flex xs:gap-0 xs:p-0 md:gap-0 md:p-0 lg:p-2 lg:gap-1 ">
                              <p className="text-left text-black font-bold font-['Helvetica'] xs:text-base min-[360px]:text-base md:text-lg lg:text-xl">
                                {items.product_name}
                              </p>
                              <p className="mb-2 text-center text-secondary-main text-xl font-semibold font-['Helvetica'] xs:text-sm md:text-base">
                                {formatMoney(items.product_harga)} /Kg
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full justify-between items-center inline-flex xs:flex-col xs:justify-start xs:gap-1 xs:items-start min-[400px]:flex-row md:flex-col md:justify-end lg:items-center lg:flex-row lg:p-2">
                          <div className="flex-col justify-center items-start gap-6 inline-flex xs:justify-start md:justify-start lg:justify-end">
                            <p className=" text-zinc-800 font-normal font-['Helvetica'] leading-loose xs:text-sm xs:w-32 min-[400px]:text-sm md:w-24 md:text-sm lg:w-28 xl:w-16">
                              x {items.product_qty}
                            </p>
                          </div>
                          <div className=" w-full justify-end gap-3 flex xs:justify-start min-[400px]:justify-end md:justify-start lg:justify-end">
                            <div className="pl-4 flex xs:pl-0 md:pl-0 lg:pl-4">
                              <p className=" text-black font-bold font-['Helvetica'] leading-10 xs:text-base min-[400px]:text-base md:text-lg">
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
          <hr className=" w-full h-px border-2 border-stone-500 "></hr>
          <div className="w-full flex-col justify-start items-start mb-10">
            <h1 className="font-bold xs:text-base md:text-lg lg:text-xl">
              Rincian Pembayaran
            </h1>
            <div className="flex flex-col gap-2 mt-3">
              <div className="flex justify-between items-center">
                <h3 className="text-stone-700 xs:text-sm md:text-lg ">
                  Metode Pembayaran{" "}
                </h3>
                <h3 className=" text-black font-medium xs:text-sm md:text-lg">
                  {data.selectedPayment.name}
                </h3>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-stone-700 xs:text-sm md:text-lg ">
                  Total Item{" "}
                </h3>
                <h3 className=" text-black font-medium xs:text-sm md:text-lg">
                  {totalQuantity} item
                </h3>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-stone-700 xs:text-sm md:text-lg  ">
                  Subtotal Produk{" "}
                </h3>
                <h3 className=" text-black font-medium xs:text-sm md:text-lg">
                  {data.totalAmountDiscounted}
                </h3>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-stone-700 xs:text-sm md:text-lg  ">
                  Biaya Pengiriman{" "}
                </h3>
                <h3 className=" text-black font-medium xs:text-sm md:text-lg">
                  {formatMoney(data.shippingCost)}
                </h3>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-stone-700 xs:text-sm md:text-lg  ">
                  Diskon Berlangganan ({data.totalDiscount} %){" "}
                </h3>
                <h3 className=" text-black font-medium xs:text-sm md:text-lg">
                  - {data.totalDiscountPrice}
                </h3>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-stone-700 xs:text-sm md:text-lg  ">
                  PPN 11%{" "}
                </h3>
                <h3 className=" text-black font-medium xs:text-sm md:text-lg ">
                  {data.ppnAmount}
                </h3>
              </div>
              <hr className="p-2 mt-2"></hr>
              <div className="flex text-black justify-between items-center">
                <h3 className="font-bold xs:text-base md:text-lg lg:text-xl ">
                  Biaya Langganan{" "}
                </h3>
                <h3 className="font-bold xs:text-sm md:text-lg lg:text-xl">
                  {data.totalAmountDiscountedPpn}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
