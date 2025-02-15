"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const handleRegister = (e: any) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((user: { email: string }) => user.email === email)) {
      Swal.fire({
        title: "Warning!",
        text: "Email sudah digunakan!",
        imageUrl: "./assets/icon/ic_round-warning.svg",
        imageHeight: 100,
        confirmButtonColor: "#6BC84D",
      });
      return;
    } else if (password !== retypePassword) {
      Swal.fire({
        title: "Error!",
        text: "Password yang diisikan tidak sama!",
        icon: "error",
        confirmButtonColor: "#6bc84d",
        confirmButtonText: "OK",
      });
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const fileArrayBuffer = event.target?.result as ArrayBuffer;
        const fileBlob = new Blob([fileArrayBuffer], { type: file.type });
        localStorage.setItem("fileData", URL.createObjectURL(fileBlob));
        localStorage.setItem("fileName", file.name);
      };
      reader.readAsArrayBuffer(file);
    }

    users.push({
      email,
      name,
      phoneNumber,
      password,
      file: file ? {
        fileName: file.name,
        fileData: file,
      } : undefined,
    });
    console.log("Pengguna :", users);

    localStorage.setItem("users", JSON.stringify(users));

    Swal.fire({
      title: "Berhasil!",
      text: "Registrasi Sukses",
      icon: "success",
      confirmButtonColor: "#6bc84d",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/login");
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const maxFileSize = 10 * 1024 * 1024; // 10 MB
      if (selectedFile.size > maxFileSize) {
        Swal.fire({
          title: "Error!",
          text: "Maksimal ukuran file adalah 10MB",
          icon: "error",
          confirmButtonColor: "#6bc84d",
          confirmButtonText: "OK",
        });
        setFile(undefined);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          localStorage.setItem("fileData", base64);
          localStorage.setItem("fileName", selectedFile.name);
          setFile(selectedFile);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  return (
    <div className="relative flex flex-col bg-white mb-10">
      <img
        src="./assets/wave2.svg"
        className="w-full hidden md:block top-0 xs:w-full xs:absolute xs:bg-clip-content xs:bg-center "
        alt="Wave"
      />
      <div className="flex flex-col md:flex-row justify-center items-center gap-12 lg:gap-12 xs:gap-0 mb-10 xs:pl-5 xs:pr-5 xs:mb-0 xs:flex xs:mt-4 md:mt-20 lg:mt-40">
        <div className="w-full h-screen md:w-full lg:w-full bg-white p-4 flex-col justify-start items-center gap-12 md:pl-12 md:pr-12 lg:flex lg:justify-start xs:gap-0 xs:h-auto xs:p-1">
          <div className="flex justify-center items-center gap-4 p-4  xs:p-0 xs:gap-2 lg:gap-4 ">
            <img
              className="w-64 h-32 xs:w-48 xs:h-24"
              src="./assets/logo.png"
            />
          </div>

          <div className=" flex flex-col justify-center items-center xs:p-0 md:p-4">
            <h1 className="font-helvetica p-2 text-center font-bold text-4xl xs:text-2xl">
              Daftar Sekarang !
            </h1>
            <div className="w-full flex justify-center text-center xs:flex-col xs:mb-3 sm:block sm:flex-col md:mb-0">
              <span className="text-black text-xl font-semibold font-['Helvetica'] leading-7 lg:text-lg">
                Sudah punya akun ?{" "}
              </span>
              <Link href={"./login"}>
                <span className="ml-2 text-primary-main text-xl font-bold font-['Helvetica'] xs:text-md xs:text-md sm:text-lg md:text-xl lg:text-lg leading-7 hover:text-primary-bold hover:underline">
                  Masuk Disini
                </span>
              </Link>
            </div>
          </div>
          <hr className="w-full bg-slate-500 " />
          <div className="w-full flex flex-col justify-stretch items-center gap-6 xs:p-0 xs:gap-4 md:p-4">
            <form onSubmit={handleRegister} className="w-full ">
              <div className="lg:pl-20 lg:pr-20 grid grid-cols-1 md:grid-cols-1 md:gap-4 gap-6 xs:gap-2 lg:grid-cols-2 lg:gap-6">
                <div className="w-full flex flex-col gap-2 ">
                  <label className="label-form ">Nama Lengkap</label>
                  <input
                    className="form-input"
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <label className="label-form" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="form-input"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="user@example.com"
                    onInput={(e) => {
                      const errorMessage =
                        document.getElementById("email-error");
                      if (!e.currentTarget.validity.valid) {
                        if (errorMessage) errorMessage.style.display = "block";
                      } else {
                        if (errorMessage) errorMessage.style.display = "none";
                      }
                    }}
                  />
                  <p
                    id="email-error"
                    className="font-helvetica text-sm text-red-500"
                    style={{ display: "none" }}
                  >
                    Email yang Kamu masukkan tidak valid!
                  </p>
                </div>
                <div className="w-full flex flex-col gap-2 ">
                  <label className="label-form">Phone</label>
                  <input
                    className="form-input"
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="081-234-567-789"
                    required
                    onInput={(e) => {
                      const phoneNumber = (e.target as HTMLInputElement).value;
                      const phoneNumberRegex = /^08\d{8,11}$/;
                      const errorMessage =
                        document.getElementById("phone-error");

                      if (!phoneNumberRegex.test(phoneNumber)) {
                        if (errorMessage) errorMessage.style.display = "block";
                      } else {
                        if (errorMessage) errorMessage.style.display = "none";
                      }
                    }}
                  />
                  <p
                    id="phone-error"
                    className="font-helvetica text-sm text-red-500"
                    style={{ display: "none" }}
                  >
                    Format nomor telepon tidak valid. Nomor telepon Indonesia
                    harus dimulai dengan angka 08 dan terdiri dari 10-13 digit.
                  </p>
                </div>
                <div className="w-full flex flex-col gap-2">
                  <label className="label-form">Password</label>
                  <div className="relative">
                    <input
                      className="form-input pr-10"
                      id="password"
                      type={isPasswordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                    />
                    <span
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => {
                        setIsPasswordVisible(!isPasswordVisible);
                      }}
                    >
                      <img
                        src={
                          isPasswordVisible
                            ? "/assets/icon/mdi_eye.svg"
                            : "/assets/icon/mdi_eye-off.svg"
                        }
                        alt=" "
                      />
                    </span>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                  <label className="label-form">Retype Password</label>
                  <div className="relative">
                    <input
                      className="form-input pr-10"
                      id="password"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Password"
                      value={retypePassword}
                      onChange={(e) => setRetypePassword(e.target.value)}
                      required
                    />
                    <span
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => {
                        setIsPasswordVisible(!isPasswordVisible);
                      }}
                    >
                      <img
                        src={
                          isPasswordVisible
                            ? "/assets/icon/mdi_eye.svg"
                            : "/assets/icon/mdi_eye-off.svg"
                        }
                        alt=" "
                      />
                    </span>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                  <label className="label-form" htmlFor="file">
                    Legal Document (Optional)
                  </label>
                  <input
                    className="form-input"
                    id="fileUpload"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf, image/jpeg, image/png"
                  />
                  {file && (
                    <span className="font-helvetica text-sm text-stone-400">
                      File yang dipilih: {file.name} (
                      {(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  )}
                  <span className="font-helvetica text-sm text-stone-400">
                    *Max File Size : 10 MB (PDF, JPEG/JPG/PNG)
                  </span>
                </div>
              </div>
              <div className="flex justify-center items-center ">
                <div className="lg:w-2/3 mt-4 flex justify-center items-center lg:pl-20 lg:pr-20 xs:w-full">
                  <button type="submit" className="button-primary">
                    Register
                  </button>
                </div>
              </div>
            </form>
            <div className="flex flex-col justify-center items-center font-helvetica">
              <span className="w-1/2 text-md text-center xs:w-[80%] lg:w-1/2">
                Dengan mendaftar, saya menyetujui{" "}
                <span className=" text-md text-center">
                  Syarat dan Ketentuan serta Kebijakan Privasi
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
