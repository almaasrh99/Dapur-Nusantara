"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";
import { useQRCode } from "next-qrcode";

function CheckoutSubscriptionSuccessPage() {
  const { Canvas } = useQRCode();

  interface Data {
    checkoutDate: string;
    selectedItems: any[];
    selectedAddress: string;
    selectedPayment: {
      type: string;
      name: string;
      image: string;
    };
    totalAmountDiscountedPpn: number | null;
    virtualCode: number;
    orderNumber: string;
  }

  const [data, setData] = useState<Data | null>(null);
  const searchParams = useSearchParams();
  const index = searchParams.get("index");
  const [timeLeft, setTimeLeft] = useState("");

  //Mengambil data dari paymentHistory dan menampilkannya berdasarkan index saat ini
  useEffect(() => {
    const storedPaymentData = localStorage.getItem("paymentHistory");
    if (storedPaymentData && index !== null) {
      const parsedPaymentData = JSON.parse(storedPaymentData);
      const selectedData = parsedPaymentData[parseInt(index, 10)];
      setData(selectedData);
    }
  }, [index]);

  //Fungsi menampilkan waktu countdown untuk pembayaran
  useEffect(() => {
    if (!data?.checkoutDate) return;

    const checkoutTime = new Date(data.checkoutDate).getTime();
    const paymentDeadline = checkoutTime + 24 * 60 * 60 * 1000; //menambahkan 24 jam (dalam milidetik) ke checkoutTime untuk mendapatkan batas waktu pembayaran

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = paymentDeadline - now;

      if (distance < 0) {
        setTimeLeft("Waktu pembayaran telah berakhir");
        return;
      }

      const hours = Math.floor(
        (distance % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
      );
      const minutes = Math.floor((distance % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((distance % (60 * 1000)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      );
    };

    const countdownInterval = setInterval(updateCountdown, 1000);
    return () => clearInterval(countdownInterval);
  }, [data]);

  // Fungsi menyalin kode virtual account
  const [copySuccess, setCopySuccess] = useState(false);
  const copyToClipboard = () => {
    const virtualCode = data?.virtualCode;

    if (virtualCode !== undefined && typeof virtualCode === "string") {
      navigator.clipboard
        .writeText(virtualCode)
        .then(() => {
          setCopySuccess(true);
          toast.success(
            "Kode Virtual Account berhasil disalin ke clipboard!",
            {}
          );
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          toast.error("Gagal menyalin nomor ke clipboard.", {});
        });
    } else {
      toast.error("Nomor Virtual Account tidak tersedia atau tidak valid.", {});
    }
  };

  //Mendapatkan link QR berbeda untuk E-Wallet
  const getQRText = () => {

    if (data?.selectedPayment.name === "ShopeePay") {
      return "https://shopee.co.id/payments";
    } else if (data?.selectedPayment.name === "Gopay") {
      // Redirect to GoPay page
      return "https://www.gopay.co.id";
    }
    return "";
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="flex flex-col justify-center items-center mb-10 xs:gap-2 xs:p-2 md:gap-4 md:p-4">
      <h1 className="font-bold p-4 text-center uppercase xs:text-lg md:text-xl lg:text-2xl xl:text-3xl">
        Terimakasih
      </h1>
      <p className="text-center xs:text-base md:text-lg lg:text-xl">
        Pesanan Anda telah berhasil dilakukan pada hari ini{" "}
        <span className="font-bold italic xs:text:base md:text-xl">
          {data.checkoutDate
            ? `${new Date(data.checkoutDate).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })} Pukul ${new Date(data.checkoutDate).toLocaleTimeString(
                "id-ID",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                }
              )}`
            : "Tanggal tidak tersedia"}{" "}
          WIB
        </span>{" "}
        dengan nomor pesanan{" "}
        <Link href={`/my-subscription/${data.orderNumber}`}>
          <span className="text-secondary-main font-semibold cursor-pointer">
            {data.orderNumber}
          </span>
        </Link>
      </p>

      <div className="justify-center">
        <p className="text-center xs:text-base md:text-lg lg:text-xl">
          Nominal yang harus dibayar :{" "}
          <span className="text-primary-main font-bold xs:text-lg md:text-xl xl:text-2xl">
            {data.totalAmountDiscountedPpn}
          </span>{" "}
        </p>
      </div>
      <div className="flex flex-col justify-center items-center bg-gray-200 rounded-lg xs:w-[90%] xs:gap-2 xs:p-2 md:w-[80%] md:gap-4 md:p-8">
        <div className="flex-col flex justify-center items-center gap-2 mb-2">
          <Image
            src={data.selectedPayment.image}
            alt={data.selectedPayment.name}
            width={200}
            height={200}
          />
          <p className="font-normal xs:text-base md:text-lg lg:text-xl">
            {data.selectedPayment.name}
          </p>
          {data.selectedPayment.type === "Virtual Account Bank" ? (
            <p className="font-bold xs:text-lg md:text-xl lg:text-2xl">
              {data.virtualCode}
            </p>
          ) : data.selectedPayment.type === "E-Wallet" ? (
            <Canvas
              text={getQRText()}
              options={{
                errorCorrectionLevel: "M",
                margin: 3,
                scale: 4,
                width: 200,
                color: {
                  dark: "#070707",
                  light: "#F0F0F0",
                },
              }}
            />
          ) : null}
        </div>

        {data.selectedPayment.type !== "E-Wallet" && (
          <button
            className="bg-white border-2 border-gray-300 rounded-md p-3 text-lg"
            onClick={copyToClipboard}
          >
            Salin Nomor
          </button>
        )}

        <p className="xs:text-lg text-center md:text-lg lg:text-xl">
          Batas waktu pembayaran pesanan sampai{" "}
          <span className="font-bold italic xs:text:base md:text-xl">
            {data.checkoutDate
              ? `${new Date(
                  new Date(data.checkoutDate).getTime() + 24 * 60 * 60 * 1000
                ).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })} Pukul ${new Date(
                  new Date(data.checkoutDate).getTime() + 24 * 60 * 60 * 1000
                ).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}`
              : "Tanggal tidak tersedia"}{" "}
            WIB
          </span>
        </p>
        <div className="bg-red-300 rounded-xl xs:p-2 md:p-3 lg:p-4">
          <p className="m-0 xs:text-lg md:text-lg lg:text-xl">
            Waktu tersisa:{" "}
            <span className="font-bold text-red-700">{timeLeft}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSubscriptionSuccessPage;
