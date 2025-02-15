"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import CustomInputDateSubscription from "@/components/input-date-subscription";

export default function MySubscriptionPage() {
  const router = useRouter();
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<Array<Date | null>>([null, null]);
  const [startDate, endDate] = dateRange;
  

  useEffect(() => {
    const storedPaymentData = localStorage.getItem("paymentHistory");
    if (storedPaymentData) {
      const parsedPaymentData = JSON.parse(storedPaymentData);
      setPaymentHistory(parsedPaymentData);
    }
  }, []);


  //Mendapatkan gambar yang sesuai dengan langganan yang dipilih
  const getSubscriptionImage = (selectedSubscription: any) => {
    switch (selectedSubscription) {
      case "1 Bulan":
        return "/assets/1bulan.png";
      case "3 Bulan":
        return "/assets/3bulan.png";
      case "6 Bulan":
        return "/assets/6bulan.png";
      case "1 Tahun":
        return "/assets/1tahun.png";
      default:
        return "/assets/default.png";
    }
  };



  //Fungsi mengatur tanggal mulai dari 00:00:00 sampai berakhirnya hari di 23:59;59
  const startOfDay = (date:any) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const endOfDay = (date:any) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  };

  //Fungsi filter tanggal berdasarkan checkoutDate langganan
  const filterPaymentHistory = (history:any, start:any, end:any) => {
    if (!start && !end) return history;

    const normalizedStart = start ? startOfDay(start) : null;
    const normalizedEnd = end ? endOfDay(end) : null;

    return history.filter((item:any )=> {
      const checkoutDate = new Date(item.checkoutDate);
      return (!normalizedStart || checkoutDate >= normalizedStart) && (!normalizedEnd || checkoutDate <= normalizedEnd);
    });
  };

  const filteredHistory = filterPaymentHistory(paymentHistory, startDate, endDate);
  

  return (
    <div className="container xs:mx-0 md:pl-6 md:pr-6 md:mx-auto lg:pl-10 lg:pr-10 lg:mb-8">
    <h1 className="font-bold mt-8 mb-4 xs:text-lg md:text-xl lg:text-2xl">Daftar Langganan Saya</h1>

    <div className="mb-4 flex items-center justify-center gap-4 min-[375px]:ml-16 min-[400px]:ml-24 md:ml-0">
      <div className="">
        <label htmlFor="dateRange" className="block mb-1"></label>
        <DatePicker
          id="dateRange"
          selected={startDate}
          onChange={(update) => {
            setDateRange(update);
          }}
          startDate={startDate || undefined}
          endDate={endDate || undefined}
          selectsRange
          isClearable
          className="p-2 border rounded xl:w-[80rem] "
          dateFormat="dd/MM/yyyy"
          customInput={
            <CustomInputDateSubscription
              value={""}
              onClick={() => {}}
            />
          }
        />
      </div>
    </div>

    {filteredHistory.length === 0 ? (
      <div className="flex items-center justify-center flex-col h-screen">
        <Image
          src="/assets/img/empty-cart.png"
          width={256}
          height={100}
          objectFit="cover"
          alt="EmptyCart.png"
        />
        <p className="font-bold text-center xs:text-lg md:text-xl lg:text-2xl">
          Kamu masih belum memiliki pembelian berlangganan!
        </p>
      </div>
    ) : (
      <div className="flex flex-col gap-4">
        {filteredHistory
          .sort((a:any, b:any) => {
            const dateA = a.checkoutDate ? new Date(a.checkoutDate).getTime() : 0;
            const dateB = b.checkoutDate ? new Date(b.checkoutDate).getTime() : 0;
            return dateB - dateA;
          })
          .map((data:any, index:any) => (
            <div
              key={index}
              className="flex items-center justify-center bg-white rounded-lg shadow-card-shadow xs:p-2 xs:w-full min-[375px]:w-[350px] min-[400px]:w-[400px] md:w-full md:p-4 lg:p-6"
            >
              <div className="flex items-center justify-center mr-4">
                <Image
                  src={getSubscriptionImage(data.selectedSubscription)}
                  alt="SubscriptionImage"
                  width={300}
                  height={300}
                  className="relative xs:hidden xs:h-24 xs:w-24 min-[400px]:block md:w-40 md:h-40 lg:w-32 lg:h-32"
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center xs:items-start">
                  <div className="flex justify-between items-start xs:gap-1 xs:flex-col md:gap-0 md:items-start lg:items-center lg:flex-row lg:gap-3">
                    <p className="font-bold xs:mb-0 xs:text-xs md:mb-2 md:text-xl lg:text-2xl">
                      Paket {data.selectedSubscription} Berlangganan
                    </p>
                    <span className=" hidden font-bold xs:mb-0 xs:text-base md:mb-2 md:text-lg lg:block lg:text-2xl">
                      -
                    </span>
                    <p className="font-normal xs:mb-0 xs:text-sm md:mb-2 md:text-base lg:text-xl xl:text-2xl">
                      {data.orderNumber}
                    </p>
                  </div>
                  <div className="flex flex-col justify-between items-end ml-auto">
                    <p className="font-normal text-gray-600 xs:text-xs md:text-lg mb-2">
                      {data.checkoutDate
                        ? `${new Date(data.checkoutDate).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "short",
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
                        : "Tanggal tidak tersedia"}
                    </p>
                  </div>
                </div>
                <p className="font-normal xs:text-sm md:text-lg lg:text-xl xs:mb-2 md:mb-2 lg:mb-4">
                  Jumlah Produk Berlangganan : {data.selectedItems.length} Produk
                </p>
                <div className="flex justify-between items-center xs:items-start xs:flex-col md:items-center lg:flex-row">
                  <p className="w-full font-bold xs:text-base md:text-xl lg:text-xl xl:text-2xl">
                    Biaya Berlangganan : {data.totalAmountDiscountedPpn}
                  </p>
                  <div className="flex justify-end items-center w-full mb-2 xs:justify-start lg:justify-end">
                    <Link href={`/my-subscription/${data.orderNumber}`}>
                      <p className="font-medium xs:text-base md:text-lg xl:text-xl">
                        Lihat Detail Langganan
                      </p>
                    </Link>
                    <Image
                      src="/assets/icon/material-symbols_double-arrow.svg"
                      alt="icon_bell"
                      width={8}
                      height={8}
                      className="relative xs:h-5 xs:w-5 md:w-7 md:h-7"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    )}
  </div>
  
  );
}
