"use client";

import { useAppContext } from "@/context";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

function SearchButton() {
  return (
    // <div className=" flex grow items-center  border-[1px] bg-white border-secondary-main rounded-full overflow-hidden text-black ">
    <div className="flex items-center w-full bg-white rounded-full border-secondary-main grow border-[1px]">
      <div className="mx-3 block ">
        <Image
          src="/assets/icons/search.svg"
          width={25}
          height={20}
          alt="search_icon"
        />
      </div>
      <input
        type="text"
        placeholder="Cari produk disini"
        className="w-full flex-grow pr-4 py-2 outline-none"
      ></input>
      <button className="bg-green-500 border-[1px] border-green-500 rounded-r-full text-white px-4 py-2">
        Cari
      </button>
    </div>
  );
}

function Auth() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [birthDate, setBirthDate] = useState(() => {
    const userEmailKey = 'userEmail';
    const savedEmail = localStorage.getItem(userEmailKey);

    // Dapatkan tanggal lahir dari penyimpanan lokal menggunakan email pengguna
    const userBirthDateKey = `userBirthDate_${savedEmail}`;
    return localStorage.getItem(userBirthDateKey);
  });

  const [gender, setGender] = useState(() => {
    const userEmailKey = 'userEmail';
    const savedEmail = localStorage.getItem(userEmailKey);

    // Dapatkan tanggal lahir dari penyimpanan lokal menggunakan email pengguna
    const userBirthDateKey = `userBirthDate_${savedEmail}`;
    return localStorage.getItem(userBirthDateKey);
  });

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  useEffect(() => {
    const storedName = localStorage.getItem("currentUserName");
    if (storedName) {
      setName(storedName);
    }
  }, [router]);

  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (userEmail && isLoggedIn) {
      setEmail(userEmail);
    }
  }, [router]);

  const handleClearBirthDate = () => {
    const userEmailKey = 'userEmail';
    const savedEmail = localStorage.getItem(userEmailKey);

    // Hapus tanggal lahir dari penyimpanan lokal menggunakan email pengguna
    const userBirthDateKey = `userBirthDate_${savedEmail}`;
    localStorage.removeItem(userBirthDateKey);

    setBirthDate(null);
  };

  const handleClearGender = () => {
    const userEmailKey = 'userEmail';
    const savedEmail = localStorage.getItem(userEmailKey);

    // Hapus tanggal lahir dari penyimpanan lokal menggunakan email pengguna
    const userGenderKey = `userGender_${savedEmail}`;
    localStorage.removeItem(userGenderKey);

    setGender(null);
  };

  const handleLogout = () => {

    Swal.fire({
      title: "Apa kamu yakin ingin keluar?",
      imageUrl: "../assets/icon/ic_round-warning.svg",
      imageHeight: 100,
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "Batal!",
      confirmButtonText: "Konfirmasi!",
      customClass: {
        confirmButton: 'inline-block mx-2 bg-primary-main text-white py-2 px-4 rounded',
        cancelButton: 'inline-block mx-2 bg-white border-1 border-primary-main text-primary-main py-2 px-4 rounded',
    },
    buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Anda berhasil keluar!",
          icon: "success",
          confirmButtonColor: "#6BC84D",
        });
        localStorage.removeItem("currentUserName");
        localStorage.removeItem("currentUserId")
        localStorage.removeItem("isLoggedIn");
        // localStorage.removeItem("userBirthday")
        // localStorage.removeItem("userGender")
        localStorage.removeItem("userEmail")
        handleClearBirthDate()
        handleClearGender()
        setEmail("");
        setName("");
        router.push("/");
      }
    });
  };

  useEffect(() => {
    function handleOutsideClick(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [dropdownOpen]);

  return (
    <div ref={dropdownRef} className="relative justify-center items-center">
      {name && (
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="pl-2 flex justify-center items-center gap-2"
        >
          <Image
            src={"/assets/icon/user-fill.svg"}
            alt={"icon_user"}
            width={8}
            height={8}
            className="w-8 h-8 relative"
          ></Image>
          <div className="flex">
            <h2 className="text-center m-0 text-slate-800 font-semibold text-lg xs:text-base lg:text-lg">
              {name.split(" ")[0]}
            </h2>
          </div>

          <Image
            src={"/assets/icon/iconamoon_arrow-down.svg"}
            alt={"icon_arrow_down"}
            width={8}
            height={8}
            className="w-8 h-8 relative"
          ></Image>
        </button>
      )}
      {email ? (
        <></>
      ) : (
        <div className="flex">
          <button
            onClick={handleLogin}
            className="py-2.5 px-4 font-semibold cursor-pointer border-[1px] bg-white border-secondary-main rounded-lg"
          >
            Masuk
          </button>
          <div className="border-black border-r-[1px] pr-3"></div>
          <button
            onClick={handleRegister}
            className="py-2.5 px-4 font-semibold ml-3 cursor-pointer bg-primary-main text-white rounded-lg"
          >
            Daftar
          </button>
        </div>
      )}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 z-50 w-56 bg-white border-2 border-stone-300 divide-y divide-gray-100 rounded-md shadow-lg">
          <div className="mt-2 gap-2 flex-col items-center justify-center">
            <button
              onClick={() => router.push("/save-cart")}
              className="bg-[#fefefe] px-2 py-1 mr-4 flex w-full hover:bg-primary-surface"
            >
              <Image
                src={"/assets/icon/save-cart.svg"}
                alt={"icon_save_cart"}
                width={8}
                height={8}
                className="w-7 h-7 relative"
              ></Image>
              <p className="text-black text-base pl-2">Keranjang Tersimpan</p>
            </button>
            <button
              onClick={() => router.push("/myOrders")}
              className="bg-[#fefefe] px-2 py-1 mr-4 flex w-full hover:bg-primary-surface"
            >
              <Image
                src={"/assets/icon/box-fill.svg"}
                alt={"icon_box"}
                width={8}
                height={8}
                className="w-7 h-7 relative"
              ></Image>
              <p className="text-black text-base pl-2">Pesanan Saya</p>
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="bg-[#fefefe] px-2 py-1 mr-4 flex w-full hover:bg-primary-surface"
            >
              <Image
                src={"/assets/icon/material-symbols_settings.svg"}
                alt={"icon_settings"}
                width={8}
                height={8}
                className="w-7 h-7 relative"
              ></Image>
              <p className="text-black pl-2">Pengaturan</p>
            </button>
          </div>
          <div className="relative">
            <button
              onClick={handleLogout}
              className="bg-[#fefefe] px-2 py-1 mr-4 flex w-full hover:bg-primary-surface"
            >
              <Image
                src={"/assets/icon/majesticons_logout.svg"}
                alt={"icon_logout"}
                width={8}
                height={8}
                className="w-7 h-7 relative"
              ></Image>
              <p className="text-black pl-2">Keluar</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header({ props }: { props: any }) {
  const { myCarts, isMobile, saveCarts } = useAppContext();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSaveCart = () => {
    router.push("/save-cart");
  };

  return (
    <>
      {props.home &&
      (!isMobile || props.title == 'home' || props.title == 'Checkout Success' || props.title == 'Orders') ? (
        <div className="z-10 shadow-shadow-top lg:flex lg:flex-row px-4 py-3 bg-secondary-surface gap-4 sticky top-0 w-full items-center">
          <div className="flex items-center">
            {/* Jika sdh login */}
            <div className="hidden lg:hidden">
              <Image
                src={"/assets/icons/menu.png"}
                width={50}
                height={28.5}
                alt="icons_cart"
              />
            </div>
            {/* End */}
            <div className="w-full">
              <Link href={"/"}>
                <Image
                  src="/assets/img/logo.png"
                  alt="Logo Dapur Nusantara"
                  width={100}
                  height={24}
                />
              </Link>
            </div>
            <div className="lg:hidden flex">
              <Auth />
            </div>
          </div>
          {props.title != 'Checkout' && (
            <>
              <div className="lg:order-3 hidden lg:flex">
                <Auth />
              </div>

              <div className="flex xs:mt-3 xs:gap-3 lg:gap-10 lg:mt-0 w-full ">
                <div className="w-full">
                  <SearchButton />
                </div>

            <Link
              href={"/my-subscription"}
              className="flex items-center gap-2.5 no-underline text-black lg:mr-3"
            >
              <Image
                src={"/assets/icons/user-cart.svg"}
                width={35}
                height={35}
                alt="icons_user_cart"
                className="w-11 lg:w-8"
              />
              <div className="hidden lg:flex">MySubscription</div>
            </Link>

                <Link href={'/cart'} className="flex gap-2.5 items-center mr-5 no-underline text-black">
                  <Image src={'/assets/icons/cart.svg'} width={30} height={35} alt="icons_cart" className="w-6" />
                  <div className="flex gap-1">
                    <div className="hidden lg:flex">MyCart</div>
                    <span>{myCarts.length > 0 && `(${myCarts.length})`} </span>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="z-10 flex bg-secondary-surface px-4 py-3 gap-4 sticky top-0 items-center shadow-shadow-top mb-3">
          <Image
            src={"/assets/icons/back.svg"}
            width={100}
            height={100}
            alt="back.png"
            className="w-6 cursor-pointer"
            onClick={handleBack}
          />
          {props.title == 'Keranjang Saya' ? (
            <div className="flex justify-between items-center w-full">
              <div className="font-bold tracking-wide text-xl">
                {props.title}
                <span className="text-base font-normal">{myCarts.length > 0 && ` (${myCarts.length})`} </span>
              </div>
              <div className="flex gap-2">
                <Image src={'/assets/icons/save-cart.svg'} width={100} height={100} alt="back.png" className="w-6" />
                <span className="text-base font-bold">(4)</span>
              </div>
            </div>
          ) : (
            <div className="font-bold tracking-wide text-xl">{props.title}</div>
          )}
        </div>
      )}
    </>
  );
}
