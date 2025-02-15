"use client";
import React from "react";
import { useState , useEffect} from "react";
import Link from "next/link";
// import  {signIn}  from 'next-auth/react';
// import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';


export default function Login() {
  const [name, setName] = useState('');
  const [imageSrc,setImageSrc] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState('');
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible]=useState(false)

  // useEffect(() => {
  //   if (localStorage.getItem('email')) {
  //     router.push('/');
  //   }
  // }, []);

  // useEffect(() => {
  //   const storedName = localStorage.getItem('currentUserName');
  //   if (storedName) {
  //     setName(storedName);
  //   }
  // }, []);
  
  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const handleLogin = (e:any) => {
    e.preventDefault();
  

     // Mengambil data users yang tersimpan di localstorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
     // Memeriksa apakah email dan kata sandi cocok dengan nilai yang disimpan
    const user = users.find((user: { email: string; password: string; }) => user.email === email && user.password === password);
    if (user) {

    const userNameKey = 'currentUserName'; 
    const savedName = localStorage.getItem(userNameKey);

    if (!savedName) {
      localStorage.setItem(userNameKey, user.name);
    }

    setName(savedName || user.name);
    setImageSrc(user.image);
      // Tetapkan isLoggedIn di localStorage
      localStorage.setItem('email', user.email);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', user.id);
      localStorage.setItem('phoneNumber', user.phoneNumber);
      localStorage.setItem('currentUserName', user.name);
      localStorage.setItem('birtDate', user.birtDate);
      localStorage.setItem('password', user.password);
      localStorage.setItem(`userImage_${user.email}`, user.image);
     
      console.log('User :',user)
      // Tampilkan peringatan berhasil dan alihkan ke halaman beranda
      Swal.fire({
        title: 'Sukses!',
        text: 'Login Berhasil !',
        icon: 'success',
        confirmButtonColor: '#6bc84d',
        confirmButtonText: 'OK'
       
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/');
        }
      });
    } else {
      Swal.fire({
        title: 'Login Gagal!',
        text: 'Email atau password salah!',
        icon: 'error',
        confirmButtonColor: '#6bc84d',
        confirmButtonText: 'OK'
      });
    }
  };

  // useEffect(() => {
  //   const storedName = localStorage.getItem('currentUserName');
  //   if (storedName) {
  //     setName(storedName);
  //   }
  // }, []);

  return (
    
    <div className="relative flex flex-col bg-white mb-10">
      <img
        src="./assets/wave2.svg"
        className="w-full h-auto bg-cover top-0 xs:w-full xs:absolute xs:bg-clip-content xs:bg-center"
        alt="Wave"
      />
      <div className="flex flex-col pl-20 pr-20 md:flex-row justify-center items-center gap-12 lg:gap-12 xs:gap-0 mb-10 xs:pl-5 xs:pr-5 xs:mb-0 xs:flex xs:mt-20 lg:mt-40 lg:pl-20 lg:pr-20">
        <div className="w-1/2 p-10 flex-col justify-center items-center gap-12 lg:gap-12 inline-flex xs:p-0 md:w-1/2">
          <img
            src="./assets/illustrasi-shopping.png"
            className="w-full p-8 bg-cover hidden md:block"
            alt="Illustration"
          />
        </div>
        <div className="w-full h-screen md:w-1/2 lg:w-[45%] bg-white rounded-lg p-4 shadow-md flex-col justify-start items-center gap-12 xs:gap-0 xs:h-auto xs:p-1">
          <div className="flex-col justify-center items-center gap-4 flex p-4">
            <img
              className="w-64 h-32 xs:w-48 xs:h-24"
              src="./assets/logo.png"
            />
          </div>
          <hr className="w-full bg-slate-500 md:mb-4 " />
          <div className="w-full flex flex-col justify-center items-center gap-6 ">
            <form onSubmit={handleLogin} className="w-full flex-col justify-center items-center gap-6 ">
              <div className="flex-col justify-center items-start gap-4 flex xs:p-0 min-[400px]:p-4 md:p-0 lg:p-4 xl:p-12">
                <div className="w-full pl-10 pr-10 flex-col justify-center items-start gap-2 flex xs:pl-0 xs:pr-0">
                  <label className="label-form">Username</label>
                  <input
                    className="form-input"
                    id="username"
                    type="email"
                    placeholder="Email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="w-full pl-10 pr-10 flex-col justify-center items-start gap-2 flex xs:pl-0 xs:pr-0">
                  <label className="label-form">Password</label>
                  <div className="w-full relative">
                    <input
                      className="form-input pr-10"
                      id="password"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Password"
                      value={password} onChange={(e) => setPassword(e.target.value)}
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
                <div className="flex flex-col justify-start items-start gap-4 ">
                  <button onClick={handleForgotPassword} className=" text-tertiary text-md font-semibold font-['Helvetica'] leading-relaxed xs:pl-2 xs:pr-5 xs:text-md sm:text-lg md:text-xl lg:text-lg lg:pl-2 lg:pr-5">
                    Lupa Password
                  </button>
                </div>
                <div className="w-full pl-10 pr-10 xs:pl-0 xs:pr-0">
                  <button type="submit" className="button-primary">Login</button>
                </div>

                <div className="w-full flex justify-center text-center xs:flex-col sm:block sm:flex-col md:flex  lg:block">
                  <span className="text-black text-xl font-semibold font-['Helvetica'] leading-7 lg:text-lg">
                    Belum punya akun ?{" "}
                  </span>
                  <Link href={"./register"}>
                    <span className="ml-2 text-secondary-main text-xl font-bold font-['Helvetica'] xs:text-md xs:text-md sm:text-lg md:text-xl lg:text-lg leading-7 hover:text-secondary-bold hover:underline">
                      Daftar Disini
                    </span>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

