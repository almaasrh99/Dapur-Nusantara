"use client";
import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/helpers";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Modal from "react-modal";
import Swal from "sweetalert2";

const CheckoutSubscription = () => {
  interface Subscription {
    duration: string;
    currentDate: string;
  }

  type PaymentMethod = {
    id: number;
    type: string;
    name: string;
    image: string;
  };

  const router = useRouter();
  const [isModalOpenAddresses, setIsModalOpenAddresses] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalPaymentOpen, setModalPaymentOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [poNumber, setPoNumber] = useState("");
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<
    number | null
  >(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [phoneNumberAddress, setPhoneNumberAddress] = useState("");
  const [nameAddress, setNameAddress] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalZip, setPostalZip] = useState("");
  const [labelAddress, setLabelAddress] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [editingAddress, setEditingAddress] = useState({
    index: null,
    address: null,
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [checkoutData, setCheckoutData] = useState<{
    paymentMethod: PaymentMethod | null;
  }>({
    paymentMethod: null,
  });

  const [data, setData] = useState({
    currentDate: "",
    selectedSubscription: null as Subscription | null,
    selectedItems: [],
    totalAmountDiscounted: null,
    totalAmountDiscountedPpn: null,
    totalDiscount: null,
    totalDiscountPrice: null,
    ppnAmount: null,
    shippingCost: 36000,
    frequency: "",
    numberOfDeliveries: "",
    selectedDay: "",
    selectedMonthDate: null,
  });

  interface Address {
    labelAddress: string;
    nameAddress: string;
    businessType: string;
    companyName: string;
    phoneNumberAddress: number;
    address: string;
    postalZip: number;
    province: string;
    city: string;
  }

  //Mengambil data checkout dari localstorage
  useEffect(() => {
    const storedData = localStorage.getItem("checkoutData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
    }
  }, []);

  //Menampilkan modal alamat pengiriman
  const handleModalAddress = () => {
    setIsModalOpenAddresses(true);
  };

  const handleCloseModalAddresses = () => {
    setIsModalOpenAddresses(false);
    window.location.reload();
  };

  //Menampilkan data alamat yang sudah disimpan dari localstorage
  useEffect(() => {
    if (isModalOpenAddresses) {
      const savedAddresses = JSON.parse(
        localStorage.getItem("addresses") || "[]"
      );
      setAddresses(savedAddresses);
    }
  }, [isModalOpenAddresses]);

  //Fungsi untuk memilih alamat pengiriman
  const handleSelectClick = (address: Address, index: number) => {
    setSelectedAddress(address);
    setSelectedAddressIndex(index);
    localStorage.setItem("selectedAddress", JSON.stringify(address));
    localStorage.setItem("selectedAddressIndex", index.toString());

    Swal.fire({
      title: "Alamat berhasil dipilih!",
      icon: "success",
      showConfirmButton: false,
    });

    setIsModalOpenAddresses(false);
  };

  // Memuat indeks alamat yang dipilih dari penyimpanan lokal saat komponen dipasang
  useEffect(() => {
    const storedSelectedAddress = localStorage.getItem("selectedAddress");
    const storedSelectedAddressIndex = localStorage.getItem(
      "selectedAddressIndex"
    );
    if (storedSelectedAddress) {
      setSelectedAddress(JSON.parse(storedSelectedAddress));
    }
    if (storedSelectedAddressIndex !== null) {
      setSelectedAddressIndex(parseInt(storedSelectedAddressIndex, 10));
    }
  }, []);

  //Buka atau tutup modals tambah alamat
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setNameAddress("");
    setPhoneNumberAddress("");
    setAddress("");
    setPostalZip("");
    setProvince("");
    setCity("");
    setLabelAddress("");
    setBusinessType("");
    setCompanyName("");
  };

  //Tambah atau ubah alamat pengguna
  const handleSubmit = (e: any) => {
    e.preventDefault();

    const newAddress = {
      nameAddress,
      phoneNumberAddress,
      address,
      companyName,
      province,
      businessType,
      labelAddress,
      postalZip,
      city,
    };

    let newAddresses;
    if (editingAddress.index !== null) {
      // Perbarui alamat yang ada
      newAddresses = addresses.map((address, i) =>
        i === editingAddress.index ? newAddress : address
      );
      //Mereset editingAdress.index
      setEditingAddress({ index: null, address: null });
    } else {
      //Tambah alamat baru
      newAddresses = [...addresses, newAddress];
    }

    // Perbarui status dan penyimpanan lokal
    setAddresses(newAddresses);
    localStorage.setItem("addresses", JSON.stringify(newAddresses));

    setNameAddress("");
    setPhoneNumberAddress("");
    setAddress("");
    setPostalZip("");
    setProvince("");
    setCity("");
    setLabelAddress("");
    setBusinessType("");
    setCompanyName("");
    setEditingAddress({ index: null, address: null });

    closeModal();

    Swal.fire({
      title: "Alamat berhasil diperbarui!",
      icon: "success",
      confirmButtonColor: "#6BC84D",
    });
  };

  const handleEditClick = (index: any) => {
    const storedAddresses = JSON.parse(
      localStorage.getItem("addresses") || "[]"
    );

    const addressToEdit = storedAddresses[index];
    setEditingAddress({ index, address: addressToEdit });

    if (addressToEdit) {
      setNameAddress(addressToEdit.nameAddress || "");
      setPhoneNumberAddress(addressToEdit.phoneNumberAddress || "");
      setAddress(addressToEdit.address || "");
      setCompanyName(addressToEdit.companyName || "");
      setProvince(addressToEdit.province || "");
      setBusinessType(addressToEdit.businessType || "");
      setLabelAddress(addressToEdit.labelAddress || "");
      setPostalZip(addressToEdit.postalZip || "");
      setCity(addressToEdit.city || "");
    }

    openModal();
  };

  useEffect(() => {
    if (editingAddress.address) {
      setNameAddress(editingAddress.address.nameAddress || "");
      setPhoneNumberAddress(editingAddress.address.phoneNumberAddress || "");
      setAddress(editingAddress.address.address || "");
      setCompanyName(editingAddress.address.companyName || "");
      setProvince(editingAddress.address.province || "");
      setBusinessType(editingAddress.address.businessType || "");
      setLabelAddress(editingAddress.address.labelAddress || "");
      setPostalZip(editingAddress.address.postalZip || "");
      setCity(editingAddress.address.city || "");
    }
  }, [editingAddress]);

  //Fungsi menampilkan atau menutup metode pembayaran

  const handleModalPayment = () => {
    setModalPaymentOpen(true);
  };

  const handelCloseModalPayment = () => {
    setModalPaymentOpen(false);
  };

  //Data daftar Metode Bayar
  const paymentMethods: PaymentMethod[] = [
    {
      id: 1,
      type: "Virtual Account Bank",
      name: "Mandiri Virtual Account",
      image: "/assets/icon/mandiri.png",
    },
    {
      id: 2,
      type: "Virtual Account Bank",
      name: "BCA Virtual Account",
      image: "/assets/icon/bca.png",
    },
    {
      id: 3,
      type: "Virtual Account Bank",
      name: "BNI Virtual Account",
      image: "/assets/icon/bni.png",
    },
    { id: 5, type: "E-Wallet", name: "Gopay", image: "/assets/icon/gopay.png" },
    {
      id: 6,
      type: "E-Wallet",
      name: "ShopeePay",
      image: "/assets/icon/shopee.png",
    },
  ];

  //Fungsi untuk konfirmasi memilih metode pembayaran
  const handleSelectPaymentMethod = (id: any) => {
    setSelectedPaymentMethod(id);
  };

  // Membuat pemisahan metode pembayaran dengan filter
  const virtualAccountMethods = paymentMethods.filter(
    (method) => method.type === "Virtual Account Bank"
  );

  const eWalletMethods = paymentMethods.filter(
    (method) => method.type === "E-Wallet"
  );

  // Fungsi untuk konfirmasi memilih metode pembayaran
  const handleConfirmPaymentMethod = () => {
    if (selectedPaymentMethod !== null) {
      const selectedMethod =
        paymentMethods.find((method) => method.id === selectedPaymentMethod) ||
        null;
      setCheckoutData((prevData) => ({
        ...prevData,
        paymentMethod: selectedMethod,
      }));

      localStorage.setItem("SelectedPayment", JSON.stringify(selectedMethod));

      Swal.fire({
        title: `Metode Pembayaran ${
          selectedMethod?.name ?? ""
        } berhasil dipilih!`,
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#6BC84D",
      });
      handelCloseModalPayment();
    } else {
      Swal.fire({
        title: `Metode Pembayaran belum dipilih!`,
        imageUrl: "../assets/icon/ic_round-warning.svg",
        imageHeight: 100,
        confirmButtonText: "Ok",
        confirmButtonColor: "#6BC84D",
      });
    }
  };

  //Mengambil data selected payment dari localstorage.
  useEffect(() => {
    const savedPaymentMethod = localStorage.getItem("SelectedPayment");
    if (savedPaymentMethod) {
      const parsedMethod = JSON.parse(savedPaymentMethod);
      setSelectedPaymentMethod(parsedMethod.id);
      setCheckoutData((prevData) => ({
        ...prevData,
        paymentMethod: parsedMethod,
      }));
    }
  }, []);

  //Fungsi generate virtual code
  const generateVirtualCode = () => {
    let virtualCode = "";
    for (let i = 0; i < 16; i++) {
      virtualCode += Math.floor(Math.random() * 10);
    }
    return virtualCode;
  };

  //Fungsi generate Order Number
  const generateOrderNumber = () => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0"); // Mengambil tanggal
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Mengambil bulan (ditambah 1 karena getMonth() mengembalikan bulan dari 0-11)
    const year = date.getFullYear().toString(); // Mengambil tahun
    const timestamp = `${day}${month}${year}`; // Menggabungkan tanggal, bulan, dan tahun
    const randomSuffix = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0"); // Menambahkan 3 digit acak
    return `ORDER-${timestamp}-${randomSuffix}`;
  };

  //Fungsi untuk melakukan konfirmasi checkout payment
  const handlePayment = () => {
    if (!selectedAddress) {
      Swal.fire({
        title: "Alamat pengiriman belum dipilih!",
        text: "Silahkan pilih alamat terlebih dahulu sebelum melakukan pembayaran pesanan !",
        imageUrl: "/assets/icon/warning.svg",
        confirmButtonColor: "#6bc84d",
        width: "80%",
      });
    } else if (!selectedPaymentMethod) {
      Swal.fire({
        title: "Metode pembayaran belum dipilih!",
        text: "Silahkan pilih metode pembayaran terlebih dahulu sebelum melakukan pembayaran pesanan !",
        imageUrl: "/assets/icon/warning.svg",
        confirmButtonColor: "#6bc84d",
        width: "80%",
      });
    } else {
      const selectedPayment = checkoutData?.paymentMethod || [];
      const totalAmountDiscounted = data.totalAmountDiscounted || 0;
      const totalAmountDiscountedPpn = data.totalAmountDiscountedPpn || 0;
      const totalDiscount = data.totalDiscount || 0;
      const totalDiscountPrice = data.totalDiscountPrice || 0;
      const ppnAmount = data.ppnAmount || 0;
      const selectedItems = data.selectedItems || [];
      const selectedSubscription = data.selectedSubscription?.duration || null;
      const shippingCost = data.shippingCost || 0;
      const frequency = data.frequency;
      const numberOfDeliveries = data.numberOfDeliveries;
      const selectedDay = data.selectedDay;
      const selectedMonthDate = data.selectedMonthDate;

      const paymentData = {
        selectedAddress,
        selectedPayment,
        totalAmountDiscounted,
        totalAmountDiscountedPpn,
        totalDiscount,
        totalDiscountPrice,
        ppnAmount,
        checkoutDate: new Date(),
        selectedSubscription,
        selectedItems,
        virtualCode: generateVirtualCode(),
        orderNumber: generateOrderNumber(),
        poNumber,
        shippingCost,
        frequency,
        numberOfDeliveries,
        selectedDay,
        selectedMonthDate,
        
      };

      // Ambil array pembayaran dari localStorage atau inisialisasi sebagai array kosong
      const paymentHistoryString = localStorage.getItem("paymentHistory");
      const paymentHistory = paymentHistoryString
        ? JSON.parse(paymentHistoryString)
        : [];

      // Dapatkan indeks baru untuk data pembayaran yang baru
      const newIndex = paymentHistory.length;

      // Tambahkan data pembayaran baru ke array
      paymentHistory.push(paymentData);

      // Simpan kembali array yang diperbarui ke localStorage
      localStorage.setItem("paymentHistory", JSON.stringify(paymentHistory));
      console.log(paymentHistory);

      // Tampilkan pesan sukses dan navigasikan ke halaman sukses dengan indeks
      Swal.fire({
        title: "Checkout-Berlangganan Berhasil!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#6BC84D",
      }).then(() => {
        router.push(`/checkout-subscription-success?index=${newIndex}`);
      });
      return paymentData;
    }
  };

  return (
    <div className="bg-white-soft ">
      <div className="box-border flex flex-wrap xs:gap-0 md:gap-4 lg:gap-0 xl:gap-4">
        <div className=" w-full flex flex-col xs:p-0 xs:gap-2.5 md:w-full lg:p-4 lg:gap-4 lg:w-[60%] xl:w-[65%]">
          <div className="p-4 bg-white w-full md:w-full rounded-lg ">
            <h1 className="font-bold xs:text-base mb-3 md:text-lg lg:text-xl xl:text-2xl">
              Berlangganan
            </h1>
            <hr className="p-2"></hr>
            <div className="flex flex-col gap-2.5 justify-center items-start">
              <div className="flex-col justify-center gap-4 items-start flex">
                <div className="items-center inline-flex xs:gap-2 md:gap-8 lg:gap-6">
                  <p className="text-zinc-800 font-normal font-['Helvetica'] leading-10 xs:w-28 xs:text-sm min-[375px]:w-36 min-[400px]:text-base min-[400px]:w-40 md:w-48 md:text-xl lg:w-52 ">
                    Tanggal Mulai
                  </p>
                  <p className="text-zinc-800 font-normal font-['Helvetica'] leading-10 xs:text-sm min-[400px]:text-base md:text-xl ">
                    :
                  </p>
                  <p className="text-black text-2xl font-normal font-['Helvetica'] leading-10 xs:text-sm min-[400px]:text-base md:text-xl">
                    {data.currentDate
                      ? `${new Date(data.currentDate).toLocaleDateString(
                          "id-ID"
                        )} ${new Date(data.currentDate).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          }
                        )}`
                      : null}
                  </p>
                </div>
              </div>
              <div className="flex-col justify-center gap-4 items-start flex">
                <div className="items-center inline-flex xs:gap-2 md:gap-8 lg:gap-6">
                  <p className="text-zinc-800 font-normal font-['Helvetica'] leading-10 xs:w-28 xs:text-sm min-[375px]:w-36 min-[400px]:text-base min-[400px]:w-40 md:w-48 md:text-xl lg:w-52 ">
                    Durasi Langganan
                  </p>
                  <p className="text-zinc-800 font-normal font-['Helvetica'] leading-10 xs:text-sm min-[400px]:text-base md:text-xl">
                    :
                  </p>
                  <p className="text-black text-2xl font-normal font-['Helvetica'] leading-10 xs:text-sm min-[400px]:text-base md:text-xl">
                    {data.selectedSubscription?.duration}
                  </p>
                </div>
              </div>
              <div className="flex-col justify-center gap-4 items-start flex">
                <div className="items-center inline-flex xs:gap-2 md:gap-8 lg:gap-6">
                  <p className="text-zinc-800 font-normal font-['Helvetica'] leading-10 xs:w-28 xs:text-sm min-[375px]:w-36 min-[400px]:text-base min-[400px]:w-40 md:w-48 md:text-xl lg:w-52 ">
                    Frekuensi Pengiriman
                  </p>
                  <p className="text-zinc-800 font-normal font-['Helvetica'] leading-10 xs:text-sm min-[400px]:text-base md:text-xl">
                    :
                  </p>
                  <p className="text-black text-2xl font-normal font-['Helvetica'] leading-10 xs:text-sm min-[400px]:text-base md:text-xl">
                    {data.frequency}
                  </p>
                </div>
              </div>
              <div className="flex-col justify-center gap-4 items-start flex">
                <div className="items-start inline-flex xs:gap-2 md:gap-8 lg:gap-6">
                  <p className="text-zinc-800 font-normal font-['Helvetica'] leading-10 xs:w-36 xs:text-sm min-[375px]:w-36 min-[400px]:text-base min-[400px]:w-40 md:w-48 md:text-xl lg:w-[14rem] xl:w-52">
                    Jadwal Pengiriman
                  </p>
                  <p className="text-zinc-800 font-normal font-['Helvetica'] leading-10 xs:text-sm min-[400px]:text-base md:text-xl">
                    :
                  </p>
                  <p className="text-black text-2xl font-normal font-['Helvetica'] leading-10 xs:text-sm min-[375px]:w-max min-[400px]:text-base md:text-xl">
                    {data.frequency === "Mingguan"
                      ? `Setiap ${data.selectedDay} - ${data.numberOfDeliveries}`
                      : data.frequency === "Bulanan"
                      ? `Setiap Tgl ${data.selectedMonthDate} - ${data.numberOfDeliveries}`
                      : data.numberOfDeliveries}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white w-full md:w-full rounded-lg ">
            <h1 className="font-bold xs:text-base mb-3 md:text-lg lg:text-xl xl:text-2xl">
              Alamat Pengiriman
            </h1>
            <hr className="p-2"></hr>
            <div className="flex flex-col p-3">
              <div className="justify-center gap-3">
                <div className="w-full items-center xs:gap-2 md:gap-8 lg:gap-6">
                  {selectedAddress ? (
                    <div className="flex-col justify-start gap-2 items-center xs:mb-2 lg:mb-0">
                      <div className="flex items-center">
                        <Image
                          src={"/assets/icon/icon_location_fill.svg"}
                          alt={"icon_location"}
                          width={8}
                          height={8}
                          className="w-7 h-7 relative"
                        />
                        <p className="pl-2 font-bold xs:text-sm min-[400px]:text-base md:text-xl">
                          {selectedAddress.labelAddress} -{" "}
                          {selectedAddress.nameAddress}
                        </p>
                      </div>
                      <div className="mt-2 gap-1 flex flex-col">
                        <p className="xs:text-sm min-[400px]:text-base md:text-xl">
                          {selectedAddress.businessType}{" "}
                          {selectedAddress.companyName}
                        </p>
                        <p className="xs:text-sm min-[400px]:text-base md:text-xl">
                          {selectedAddress.phoneNumberAddress}
                        </p>
                        <p className="xs:text-sm min-[400px]:text-base md:text-xl">
                          {selectedAddress.address} -{" "}
                          {selectedAddress.postalZip}
                        </p>
                        <p className="xs:text-sm min-[400px]:text-base md:text-xl">
                          {selectedAddress.province} - {selectedAddress.city}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-2 items-center border-1 bg-red-200 border-red-600 p-4 rounded-lg mb-3">
                      <img
                        className="w-8 h-8"
                        src="./assets/icon/ph_warning.svg"
                      />
                      <p className="text-gray-600 italic font-semibold xs:text-sm min-[400px]:text-base md:text-lg">
                        Silahkan masukkan alamat pengiriman Anda agar transaksi
                        dapat dilanjutkan!
                      </p>
                    </div>
                  )}
                </div>
                <div className="items-center justify-center flex lg:mt-4 xl:mt-0">
                  <button
                    onClick={handleModalAddress}
                    className="button-secondary text-primary-main xs:w-full md:w-1/3 lg:w-1/2 xl:w-1/3"
                  >
                    <Image
                      src={"/assets/icon/icon_location_fill.svg"}
                      alt={"icon_location"}
                      width={8}
                      height={8}
                      className="w-7 h-7 relative"
                    />
                    Pilih Alamat
                  </button>
                </div>
                {/* Layout Modal Alamat Pengiriman */}

                {isModalOpenAddresses && (
                  <Modal
                    isOpen={isModalOpenAddresses}
                    onRequestClose={handleCloseModalAddresses}
                    contentLabel="Daftar Alamat"
                    className={`w-full p-8 flex items-center justify-center outline-none xs:pl-0 xs:pr-0 md:pl-10 md:pr-10 lg:pl-[50px] lg:pr-[50px] xl:pl-24 xl:pr-24 ${
                      isModalOpenAddresses
                        ? "animate-slide-in"
                        : "animate-slide-out"
                    }`}
                    overlayClassName="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center xs:bottom-0"
                  >
                    <div className="bg-white rounded-lg w-full sm:w-3/4 md:w-full lg:w-full">
                      <div className="gap-4">
                        <div className="w-full z-50 flex justify-between items-center bg-white shadow-md p-2 rounded-tr-lg rounded-tl-lg xs:justify-end md:justify-between">
                          <h2 className="text-2xl font-bold p-2 xs:text-xl xs:mr-16 min-[400px]:mr-20 lg:text-2xl">
                            Daftar Alamat
                          </h2>

                          <button
                            onClick={handleCloseModalAddresses}
                            className=" text-white rounded px-2 py-1"
                          >
                            <img
                              src="./assets/icon/close-btn.svg"
                              className="h-8 w-8 xs:w-4 xs:h-4 lg:h-6 lg:w-6"
                            />
                          </button>
                        </div>
                        <div className="w-full xs:mb-10 xs:gap-2 xs:p-2 xs:h-[550px] min-[400px]:p-4 min-[400px]:mb-16 md:mt-0 md:p-4 md:gap-3 md:mb-2 md:h-auto lg:h-[28rem] lg:mb-4 lg:p-6 xl:h-[24rem] xl:mt-0 xl:mb-8 xl:gap-4 xl:p-6">
                          <div className="w-full overflow-auto xs:mb-10 xs:gap-2 xs:p-2 xs:h-[550px] min-[400px]:p-4 min-[400px]:mb-16 md:mt-0 md:p-4 md:gap-3 md:mb-2 lg:h-[26rem] lg:mb-4 lg:p-6 xl:h-[24rem] xl:mt-0 xl:mb-8 xl:gap-4 xl:p-6">
                            <div className="flex justify-center items-center mb-2 xs:p-4 lg:p-0 ">
                              <button
                                onClick={openModal}
                                className="button-secondary text-xl font-semibold text-primary-main xs:text-base xs:w-[80%] md:w-1/3 lg:flex lg:w-1/3"
                              >
                                + Tambah Alamat
                              </button>
                            </div>
                            <Modal
                              isOpen={modalIsOpen}
                              onRequestClose={closeModal}
                              contentLabel="Tambah Alamat"
                              className={`w-full flex items-center justify-center outline-none xs:p-0 lg:p-10 xl:p-24  ${
                                modalIsOpen
                                  ? "animate-slide-in"
                                  : "animate-slide-out"
                              }`}
                              overlayClassName="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center xs:justify-end xs:items-end lg:items-center lg:justify-center"
                            >
                              <div className="bg-white rounded-lg w-full sm:w-3/4 md:w-full lg:w-full">
                                <div className="gap-4">
                                  <div className="w-full flex justify-between items-center bg-white shadow-md p-2 rounded-tr-lg rounded-tl-lg">
                                    <h2 className="text-2xl font-bold p-2 xs:text-xl lg:text-2xl">
                                      {editingAddress.index !== null
                                        ? "Ubah Alamat"
                                        : "Tambah Alamat"}
                                    </h2>
                                    <button
                                      onClick={closeModal}
                                      className=" text-white rounded px-2 py-1"
                                    >
                                      <img
                                        src="./assets/icon/close-btn.svg"
                                        className="h-8 w-8 xs:w-4 xs:h-4 lg:h-6 lg:w-6"
                                      />
                                    </button>
                                  </div>
                                  <div className="w-full flex flex-col justify-stretch items-center gap-6 xs:gap-4 xs:pl-0 xs:pr-0 xs:pt-4 xs:pb-0 ">
                                    <form
                                      onSubmit={handleSubmit}
                                      className="w-full"
                                    >
                                      <div className="w-full overflow-auto xs:gap-2 xs:p-2 xs:mb-4 xs:h-[600px] min-[400px]:p-4 md:mt-0 md:p-4 md:gap-3 lg:h-[26rem] xl:h-[20rem] xl:mt-0 xl:gap-4 xl:p-6 2xl:h-[30rem]">
                                        <div className="lg:pl-8 lg:pr-8 grid grid-cols-1 gap-6 xs:gap-2 xs:pl-4 xs:pr-4 md:grid-cols-1 md:gap-4 lg:grid-cols-2 lg:gap-6">
                                          <div className="w-full flex flex-col gap-2 ">
                                            <label className="label-form ">
                                              Nama Penerima
                                            </label>
                                            <input
                                              className="form-input"
                                              id="name"
                                              type="text"
                                              value={nameAddress}
                                              onChange={(e) =>
                                                setNameAddress(e.target.value)
                                              }
                                              required
                                            />
                                          </div>
                                          <div className="w-full flex flex-col gap-2 ">
                                            <label className="label-form">
                                              Telepon
                                            </label>
                                            <input
                                              className="form-input"
                                              id="phone"
                                              type="tel"
                                              value={phoneNumberAddress}
                                              onChange={(e) =>
                                                setPhoneNumberAddress(
                                                  e.target.value
                                                )
                                              }
                                              placeholder="081-234-567-789"
                                              required
                                              onInput={(e) => {
                                                const phoneNumber = (
                                                  e.target as HTMLInputElement
                                                ).value;
                                                const phoneNumberRegex =
                                                  /^08\d{8,11}$/;
                                                const errorMessage =
                                                  document.getElementById(
                                                    "phone-error"
                                                  );

                                                if (
                                                  !phoneNumberRegex.test(
                                                    phoneNumber
                                                  )
                                                ) {
                                                  if (errorMessage)
                                                    errorMessage.style.display =
                                                      "block";
                                                } else {
                                                  if (errorMessage)
                                                    errorMessage.style.display =
                                                      "none";
                                                }
                                              }}
                                            />
                                            <p
                                              id="phone-error"
                                              className="font-helvetica text-sm text-red-500"
                                              style={{ display: "none" }}
                                            >
                                              Format nomor telepon tidak valid.
                                              Nomor telepon Indonesia harus
                                              dimulai dengan angka 08 dan
                                              terdiri dari 10-13 digit.
                                            </p>
                                          </div>
                                          <div className="w-full flex flex-col gap-2 ">
                                            <label className="label-form ">
                                              Provinsi
                                            </label>
                                            <select
                                              className="form-input"
                                              id="provinsi"
                                              value={province}
                                              onChange={(e) =>
                                                setProvince(e.target.value)
                                              }
                                              required
                                            >
                                              <option value="">
                                                --Pilih Provinsi--
                                              </option>
                                              <option value="Aceh">Aceh</option>
                                              <option value="Sumatera Utara">
                                                Sumatera Utara
                                              </option>
                                              <option value="Sumatera Barat">
                                                Sumatera Barat
                                              </option>
                                              <option value="Riau">Riau</option>
                                              <option value="Jambi">
                                                Jambi
                                              </option>
                                              <option value="Sumatera Selatan">
                                                Sumatera Selatan
                                              </option>
                                              <option value="Bengkulu">
                                                Bengkulu
                                              </option>
                                              <option value="Lampung">
                                                Lampung
                                              </option>
                                              <option value="Bangka Belitung">
                                                Bangka Belitung
                                              </option>
                                              <option value="Banten">
                                                Banten
                                              </option>
                                              <option value="Jakarta">
                                                Jakarta
                                              </option>
                                              <option value="Jawa Barat">
                                                Jawa Barat
                                              </option>
                                              <option value="Jawa Tengah">
                                                Jawa Tengah
                                              </option>
                                              <option value="Jawa Timur">
                                                Jawa Timur
                                              </option>
                                              <option value="Yogyakarta">
                                                Yogyakarta
                                              </option>
                                              <option value="Bali">Bali</option>
                                              <option value="Nusa Tenggara Barat">
                                                Nusa Tenggara Barat
                                              </option>
                                            </select>
                                          </div>
                                          <div className="w-full flex flex-col gap-2 ">
                                            <label className="label-form ">
                                              Kota/Kabupaten
                                            </label>
                                            <select
                                              className="form-input"
                                              id="city"
                                              value={city}
                                              onChange={(e) =>
                                                setCity(e.target.value)
                                              }
                                              required
                                            >
                                              <option value="">
                                                --Pilih Kota/Kabupaten--
                                              </option>
                                              <option value="Surabaya">
                                                Surabaya
                                              </option>
                                              <option value="Sleman">
                                                Sleman
                                              </option>
                                              <option value="Malang">
                                                Malang
                                              </option>
                                              <option value="Jakarta">
                                                Jakarta
                                              </option>
                                            </select>
                                          </div>
                                          <div className="w-full flex flex-col gap-2 ">
                                            <label className="label-form ">
                                              Detail Alamat (Gedung, Kawasan,
                                              Nama Jalan dan Blok)
                                            </label>
                                            <textarea
                                              className="form-input h-48 2xl:h-[13.5rem]"
                                              id="alamat"
                                              value={address}
                                              onChange={(e) =>
                                                setAddress(e.target.value)
                                              }
                                              required
                                            />
                                          </div>
                                          <div className="w-full flex flex-col gap-4 justify-start">
                                            <label className="label-form ">
                                              Label Alamat
                                            </label>
                                            <input
                                              className="form-input"
                                              id="label-address"
                                              type="text"
                                              value={labelAddress}
                                              onChange={(e) =>
                                                setLabelAddress(e.target.value)
                                              }
                                              required
                                            />

                                            <label className="label-form ">
                                              Kode Pos
                                            </label>
                                            <input
                                              className="form-input"
                                              id="postal_code"
                                              type="number"
                                              value={postalZip}
                                              onChange={(e) =>
                                                setPostalZip(e.target.value)
                                              }
                                              required
                                            />
                                          </div>
                                          <div className="w-full flex flex-col gap-2 ">
                                            <label className="label-form ">
                                              Badan Usaha
                                            </label>
                                            <select
                                              className="form-input"
                                              id="business_type"
                                              value={businessType}
                                              onChange={(e) =>
                                                setBusinessType(e.target.value)
                                              }
                                              required
                                            >
                                              <option value="">
                                                --Pilih Badan Usaha--
                                              </option>
                                              <option value="PT">
                                                PT (Perseroan Terbatas)
                                              </option>
                                              <option value="CV">CV</option>
                                              <option value="Frima">
                                                Firma
                                              </option>
                                              <option value="Koperasi">
                                                Koperasi
                                              </option>
                                              <option value="Yayasan">
                                                Yayasan
                                              </option>
                                              <option value="UD">
                                                UD (Usaha Dagang)
                                              </option>
                                            </select>
                                          </div>
                                          <div className="w-full flex flex-col gap-2 ">
                                            <label className="label-form ">
                                              Nama Perusahaan
                                            </label>
                                            <input
                                              className="form-input"
                                              id="company_name"
                                              type="text"
                                              value={companyName}
                                              onChange={(e) =>
                                                setCompanyName(e.target.value)
                                              }
                                              required
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="w-full shadow-bottom-shadow flex items-center justify-center rounded-tr-lg rounded-tl-lg">
                                        <div className="w-full flex justify-center bg-white items-center xs:p-0 lg:p-4 lg:bg-transparent lg:rounded-br-lg lg:rounded-bl-lg">
                                          <button
                                            type="submit"
                                            className="button-primary xs:h-20 xs:rounded-none xs:rounded-tl-xl xs:rounded-tr-xl lg:w-1/2 lg:h-16 lg:rounded-2xl xs:shadow-bottom-shadow lg:shadow-none "
                                          >
                                            Simpan Alamat
                                          </button>
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </Modal>
                            {addresses.length === 0 ? (
                              <div className="p-2 xs:p-4 lg:p-0 lg:pt-4">
                                <div className="w-full p-10 bg-white rounded-2xl border border-stone-400 justify-center items-center gap-9 inline-flex xs:gap-6">
                                  <img
                                    className="w-8 h-8"
                                    src="./assets/icon/icon_location.svg"
                                  />
                                  <p className="italic text-xl font-bold text-stone-700">
                                    Kamu masih belum memiliki daftar alamat!
                                  </p>
                                </div>
                              </div>
                            ) : (
                              addresses
                                .slice()
                                .reverse()
                                .map((address, index) => {
                                  const originalIndex =
                                    addresses.length - 1 - index;
                                  return (
                                    <div
                                      className="p-2 xs:p-4 lg:p-0 lg:pt-4"
                                      key={originalIndex}
                                    >
                                      <div
                                        className={`w-full h-auto p-4 rounded-2xl border-1 border-primary-main flex-col justify-center items-start gap-9 inline-flex xs:gap-6 ${
                                          selectedAddressIndex === originalIndex
                                            ? "bg-primary-surface"
                                            : ""
                                        }`}
                                      >
                                        <div className="justify-start items-center gap-8 inline-flex xs:gap-4 xs:w-full xs:flex xs:justify-between lg:justify-start">
                                          <div className="w-36 h-14 p-2.5 bg-neutral-100 rounded-2xl justify-center items-center gap-2.5 flex">
                                            <h1 className="text-zinc-800 text-lg font-bold font-['Helvetica'] leading-10 xs:text-sm md:text-lg lg:text-lg">
                                              {address.labelAddress}
                                            </h1>
                                          </div>
                                          <div className="justify-start items-center gap-2.5 inline-flex">
                                            <button
                                              onClick={() =>
                                                handleEditClick(originalIndex)
                                              }
                                              className="text-center inline-flex items-center"
                                            >
                                              <img
                                                className="xs:w-5 xs:h-5 md:w-8 md:h-8 lg:w-8 lg:h-8 "
                                                src="./assets/icon/material-edit.svg"
                                              />
                                              <p className="text-secondary-main  font-semibold text-lg xs:text-base md:text-lg lg:text-lg">
                                                Ubah Alamat
                                              </p>
                                            </button>
                                          </div>
                                        </div>

                                        <div className="w-full flex justify-start items-center gap-10 xs:gap-6 xs:flex-col lg:flex-row">
                                          <div className="w-full flex-col justify-start items-start gap-2.5">
                                            {address && (
                                              <>
                                                <div className="flex justify-start items-center xs:flex xs:flex-col xs:justify-center xs:items-start md:flex-row md:justify-start lg:flex-row lg:justify-start lg:items-center">
                                                  <p className="text-black text-2xl font-bold font-['Helvetica'] leading-10 xs:text-lg">
                                                    {address.nameAddress}
                                                  </p>
                                                  <span className="pl-2 md:block xs:hidden">
                                                    -
                                                  </span>
                                                  <p className="pl-2 text-black text-xl italic font-semibold font-['Helvetica'] leading-10 xs:pl-0 xs:text-lg lg:pl-2">
                                                    ({address?.businessType}{" "}
                                                    {address?.companyName})
                                                  </p>
                                                </div>
                                                <p className="text-black text-xl font-normal font-['Helvetica'] leading-10 xs:text-lg">
                                                  {address?.phoneNumberAddress}
                                                </p>
                                                <p className="text-black text-xl font-normal font-['Helvetica'] xs:text-lg">
                                                  {address?.address} -{" "}
                                                  {address?.postalZip}
                                                </p>
                                                <div className="flex">
                                                  <p className="text-black text-xl font-normal font-['Helvetica'] xs:text-lg">
                                                    {address?.province}
                                                  </p>
                                                  <span className="pl-2 pr-2">
                                                    -
                                                  </span>
                                                  <p className="text-black text-xl font-normal font-['Helvetica'] xs:text-lg">
                                                    {address?.city}
                                                  </p>
                                                </div>
                                              </>
                                            )}
                                          </div>
                                          <button
                                            onClick={() =>
                                              handleSelectClick(
                                                address,
                                                originalIndex
                                              )
                                            }
                                            className={`button-primary xs:w-full xs:text-base md:w-1/2 lg:w-1/2 ${
                                              selectedAddressIndex ===
                                              originalIndex
                                                ? "button-secondary xs:w-full xs:text-base md:w-1/2 lg:w-1/2 text-primary-main"
                                                : ""
                                            }`}
                                          >
                                            {selectedAddressIndex ===
                                            originalIndex ? (
                                              <>
                                                <img
                                                  src="./assets/icon/check.svg"
                                                  className="xs:w-5 xs:h-5 lg:w-8 lg:h-8"
                                                />
                                                Terpilih
                                              </>
                                            ) : (
                                              "Pilih"
                                            )}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal>
                )}
              </div>
            </div>
          </div>
          <div className="p-4 bg-white w-full md:w-full rounded-lg ">
            <h1 className="font-bold xs:text-base mb-3 md:text-lg lg:text-xl xl:text-2xl">
              Nomor PO (Optional)
            </h1>
            <hr className="p-2"></hr>
            <div className="flex flex-col gap-2.5 justify-center p-3">
              <div className="flex flex-col justify-center gap-3">
                <div className="w-full items-center xs:gap-2 md:gap-8 lg:gap-6">
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Masukkan Nomor PO"
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                  />
                </div>
                <p className="font-normal xs:text-base md:text-lg lg:text-xl">
                  Kami akan menerbitkan invoice berdasarkan nomor PO yang telah
                  Anda ajukan
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white w-full md:w-full rounded-lg ">
            <div className="flex justify-between items-center pb-4">
              <h1 className="font-bold xs:text-base md:text-lg lg:text-xl xl:text-2xl">
                Review Pesanan{" "}
              </h1>
              <button
                className="button-secondary text-primary-main xs:w-1/2 md:w-1/4 lg:w-1/3 xl:w-1/4"
                onClick={() => router.push("/cart")}
              >
                <p className="xs:tex-sm md:text-lg lg:text-xl ">Ubah Pesanan</p>
              </button>
            </div>

            <hr className="p-2"></hr>
            <div className="flex flex-col gap-2.5 justify-center items-start">
              <div className="flex-col justify-center gap-4 items-start flex">
                <div className="w-full gap-4 flex flex-col justify-center">
                  {data.selectedItems.map((i: any, index: any) => (
                    <div key={index} className="w-full gap-2">
                      <div className=" bg-white justify-center items-center gap-6 flex xs:w-[280px] xs:flex-col min-[400px]:flex-row min-[400px]:w-[23rem]  md:w-[650px] lg:p-3 lg:w-[550px] xl:p-4 xl:w-[800px] ">
                        <img
                          className="w-40 h-60 rounded-tr-lg rounded-tl-lg xs:w-28 xs:h-28 min-[360px]:w-[118px] md:w-24 md:h-24 lg:w-40 lg:h-32 xl:w-48 xl:h-48 "
                          src={i.product_img}
                        />
                        <div className="w-full flex-col justify-between gap-6 inline-flex xs:items-center min-[400px]:items-start">
                          <div className="w-full flex-col justify-start gap-6 flex xs:gap-2 xs:items-center min-[400px]:items-start md:p-2 md:gap-0 lg:p-0 lg:gap-4 xl:gap-6 ">
                            <div className="flex-col justify-start items-start flex">
                              <div className="justify-start items-center gap-2.5 inline-flex">
                                <div className="flex-col justify-start items-start flex xs:gap-0 xs:p-0 md:gap-0 md:p-0 lg:p-2 lg:gap-2 ">
                                  <p className="text-left text-black font-bold font-['Helvetica'] xs:text-base min-[360px]:text-base lg:text-2xl">
                                    {i.product_name}
                                  </p>
                                  <p className=" text-center text-secondary-main text-xl font-semibold font-['Helvetica']  xs:text-sm min-[400px]:mb-2 lg:text-xl">
                                    {formatMoney(i.product_harga)} /Kg
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="w-full justify-between items-center inline-flex xs:flex-col xs:justify-center xs:items-center min-[400px]:items-start min-[400px]:flex-row md:flex-row md:justify-start lg:justify-start lg:items-center xl:justify-end ">
                              <div className="flex-col justify-center gap-6 inline-flex xs:items-center min-[400px]:justify-start lg:justify-end">
                                <p className=" text-zinc-800 font-normal font-['Helvetica'] leading-loose xs:w-24 xs:text-sm md:w-96 md:text-lg lg:w-64 xl:w-80 ">
                                  Jumlah : {i.product_qty}
                                </p>
                              </div>
                              <div className="justify-end gap-3 xs:w-24 xs:justify-start min-[400px]:justify-end md:justify-start lg:justify-end xl:w-full">
                                <div className=" flex xs:pl-0 xs:w-30 md:pl-0 lg:pl-0 lg:w-60 xl:pl-4 xl:w-64">
                                  <p className=" text-black font-bold font-['Helvetica'] leading-10 xs:text-base min-[400px]:text-base lg:text-xl xl:text-2xl">
                                    {formatMoney(
                                      (Number(i.product_harga) || 0) *
                                        (Number(i.product_qty) || 0)
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr className="border-2 border-neutral-600 px-2"></hr>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg h-1/2 xs:mt-2.5 xs:p-4 xs:m-0 xs:mb-4 xs:w-full lg:w-[40%] lg:m-0 lg:mt-4 xl:m-0 xl:mt-4 xl:w-[32%]           ">
          <h1 className="font-bold xs:text-base xs:text-left mb-3 md:text-lg lg:text-center lg:text-xl xl:text-2xl">
            Pembayaran
          </h1>
          <hr className="p-2 xs:mb-0 lg:mb-2"></hr>
          {checkoutData.paymentMethod && (
            <div className="flex justify-center items-center">
              <div className="flex items-center mt-2 xs:flex-col xs:gap-2 lg:flex-row lg:gap-4">
                <Image
                  src={checkoutData.paymentMethod.image}
                  alt={checkoutData.paymentMethod.name}
                  width={100}
                  height={100}
                  className="rounded-lg xs:h-12 xs:w-24 md:w-36 md:h-16 lg:w-28 lg:h-12"
                />
                <div>
                  <p className="font-semibold xs:text-base md:text-lg">
                    {checkoutData.paymentMethod.name}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-center xs:p-2 md:p-4 ">
            <button
              onClick={handleModalPayment}
              className="button-tertiary md:w-1/2 lg:w-full "
            >
              Pilih Metode Pembayaran
            </button>
          </div>

          {/* Layout Modal Metode Pembayaran */}
          {modalPaymentOpen && (
            <Modal
              isOpen={modalPaymentOpen}
              onRequestClose={handelCloseModalPayment}
              contentLabel="Metode Bayar"
              className={`w-full p-8 flex items-center justify-center outline-none xs:pl-0 xs:pr-0 lg:pl-[50px] lg:pr-[50px] xl:w-1/2 ${
                modalPaymentOpen ? "animate-slide-in" : "animate-slide-out"
              }`}
              overlayClassName="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center xs:bottom-0"
            >
              <div className="bg-white rounded-lg w-full sm:w-3/4 md:w-full lg:w-full">
                <div className="gap-4">
                  <div className="w-full z-50 flex justify-between items-center bg-white shadow-md p-2 rounded-tr-lg rounded-tl-lg xs:justify-end md:justify-between">
                    <h2 className="text-2xl font-bold p-2 xs:text-xl xs:mr-16 min-[400px]:mr-20 lg:text-2xl">
                      Pilih Metode Pembayaran
                    </h2>

                    <button
                      onClick={handelCloseModalPayment}
                      className=" text-white rounded px-2 py-1"
                    >
                      <img
                        src="./assets/icon/close-btn.svg"
                        className="h-8 w-8 xs:w-4 xs:h-4 lg:h-6 lg:w-6"
                      />
                    </button>
                  </div>
                  <div className="w-full xs:mb-0 xs:gap-2 xs:p-2 xs:h-[550px] min-[400px]:p-4 min-[400px]:mb-16 md:mt-0 md:p-4 md:gap-3 md:mb-8 lg:h-full lg:mb-4 lg:p-6 xl:mt-0 xl:mb-8 xl:gap-4 xl:p-4">
                    <div className="w-full flex flex-col overflow-auto xs:mb-0 xs:gap-2 xs:p-2 xs:h-[500px] min-[400px]:p-4 min-[400px]:mb-0 md:mt-0 md:p-4 md:gap-3 md:mb-2 lg:h-[26rem] lg:mb-10 lg:p-6 xl:h-[22rem] xl:mt-0 xl:mb-8 xl:gap-4 xl:p-6 2xl:h-[30rem]">
                      <h3 className="text-xl font-bold mb-2">
                        Virtual Account Bank
                      </h3>
                      {virtualAccountMethods.map((method) => (
                        <div
                          key={method.id}
                          onClick={() => handleSelectPaymentMethod(method.id)}
                          className={`flex justify-start items-center rounded-xl cursor-pointer xs:p-2 xs:mb-3 md:mb-4 md:p-4 ${
                            selectedPaymentMethod === method.id
                              ? "border-2 border-primary-main"
                              : "border border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={selectedPaymentMethod === method.id}
                            onChange={() =>
                              handleSelectPaymentMethod(method.id)
                            }
                            className="form-radio h-4 w-4 text-primary-main"
                          />
                          <div className="flex items-center gap-4">
                            <Image
                              src={method.image}
                              alt={method.name}
                              width={100}
                              height={100}
                              className="rounded-lg "
                            />
                            <div>
                              <p className="font-semibold xs:text-base md:text-lg">
                                {method.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <h3 className="text-xl font-bold mt-4 mb-2">E-Wallet</h3>
                      {eWalletMethods.map((method) => (
                        <div
                          key={method.id}
                          onClick={() => handleSelectPaymentMethod(method.id)}
                          className={`flex justify-start items-center rounded-xl cursor-pointer xs:p-2 xs:mb-3 md:mb-4 md:p-4 ${
                            selectedPaymentMethod === method.id
                              ? "border-2 border-primary-main"
                              : "border border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={selectedPaymentMethod === method.id}
                            onChange={() =>
                              handleSelectPaymentMethod(method.id)
                            }
                            className="form-radio h-4 w-4 text-primary-main"
                          />
                          <div className="flex items-center gap-4">
                            <Image
                              src={method.image}
                              alt={method.name}
                              width={100}
                              height={100}
                              className="rounded-lg"
                            />
                            <div>
                              <p className="font-semibold xs:text-base md:text-lg">
                                {method.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="fixed bg-white border-t border-gray-200 xs:bottom-0 xs:p-0 xs:w-full xs:left-0 md:p-3 lg:left-auto lg:bottom-28 lg:w-[80%] xl:w-[37%] xl:mx-auto xl:block xl:pr-4 xl:bottom-8 2xl:w-[40%] 2xl:bottom-20">
                        <button
                          onClick={handleConfirmPaymentMethod}
                          className="button-primary block mx-auto xs:w-full xs:rounded-none xs:rounded-tr-lg xs:rounded-tl-lg xs:h-24 md:rounded-lg md:h-auto md:w-1/2 md:p-8 lg:w-1/2 xl:p-4 xl:w-full"
                        >
                          Pilih Metode Pembayaran
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          )}

          <h1 className="font-bold xs:text-base xs:text-left xs:mb-1 xs:mt-2 md:text-lg lg:text-center lg:mb-3 lg:text-xl xl:text-2xl">
            Rincian Pesanan
          </h1>
          <hr className="p-2 mb-2"></hr>
          <div className="flex flex-col gap-2 xs:mb-24 min-[400px]:mb-16 lg:mb-0">
            <div className="flex text-black justify-between items-center">
              <h3 className="xs:text-sm md:text-lg ">Jumlah </h3>
              <h3 className=" text-stone-700 xs:text-sm md:text-lg">
                {data.selectedItems.length} Produk
              </h3>
            </div>
            <div className="flex text-black justify-between items-center">
              <h3 className="xs:text-sm md:text-lg lg:text-xl ">
                Subtotal Produk{" "}
              </h3>
              <h3 className=" text-stone-700 xs:text-sm md:text-lg">
                {data.totalAmountDiscounted}
              </h3>
            </div>
            <div className="flex text-black justify-between items-center">
              <h3 className="xs:text-sm md:text-lg lg:text-xl ">
                Biaya Pengiriman{" "}
              </h3>
              <h3 className=" text-stone-700 xs:text-sm md:text-lg">
                {formatMoney(data.shippingCost)}
              </h3>
            </div>
            <div className="flex text-black justify-between items-center">
              <h3 className="xs:text-sm md:text-lg lg:text-xl ">
                Diskon Berlangganan ({data.totalDiscount} %){" "}
              </h3>
              <h3 className=" text-stone-700 xs:text-sm md:text-lg">
                - {data.totalDiscountPrice}
              </h3>
            </div>
            <div className="flex text-black justify-between items-center">
              <h3 className="xs:text-sm md:text-lg lg:text-xl ">PPN 11% </h3>
              <h3 className=" text-stone-700 xs:text-sm md:text-lg ">
                {data.ppnAmount}
              </h3>
            </div>
            <hr className="p-2 mt-2 xs:hidden lg:block"></hr>
            <div className="flex text-black justify-between items-center">
              <h3 className="font-bold xs:text-sm xs:hidden md:text-lg lg:block  ">
                Total Pesanan{" "}
              </h3>
              <h3 className="font-bold xs:text-sm xs:hidden lg:block md:text-lg">
                {data.totalAmountDiscountedPpn}
              </h3>
            </div>
            <div className="p-4 xs:hidden lg:block">
              <button onClick={handlePayment} className="button-primary">
                Bayar Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
      <section className="w-full lg:hidden shadow-bottom-shadow bg-white fixed bottom-0">
        <div className="grid grid-cols-2">
          <div className="flex flex-col border-1 border-primary-main rounded-tl-xl gap-2 px-3 text-lg justify-center items-center  ">
            <div>
              <div className="font-bold flex flex-col justify-center items-center">
                <p className="text-base">Total pesanan</p>
                <p className="text-lg">{data.totalAmountDiscountedPpn}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handlePayment}
            className="flex gap-2 px-3 justify-center py-7 rounded-tr-xl font-bold text-white bg-primary-main"
          >
            <p className="text-xl">Bayar Sekarang</p>
          </button>
        </div>
      </section>
    </div>
  );
};

export default CheckoutSubscription;
