"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
// import { useSession} from "next-auth/react";
import Link from "next/link";
import Modal from "react-modal";
import ModalAlamat from "@/components/modal-alamat";
import { useAppContext } from "@/context";
// import { FileViewer } from "react-file-viewer-v2";

export default function Profile() {
  const {
    setModalAddressIsOpen,
    editingAddress,
    setEditingAddress,
    selectedAddressIndex,
    setSelectedAddressIndex,
  } = useAppContext();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [nameAddress, setNameAddress] = useState("");
  const [phoneNumberAddress, setPhoneNumberAddress] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fileData, setFileData] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(
    "./assets/icon/user_image.png"
  );
  const [imageSrc, setImageSrc] = useState("./assets/icon/user_image.png");
  // const [modalIsOpen, setModalIsOpen] = useState(false);
  const [address, setAddress] = useState("");
  // const [city, setCity] = useState("");
  // const [province, setProvince] = useState("");
  // const [postalZip, setPostalZip] = useState("");
  // const [labelAddress, setLabelAddress] = useState("");
  // const [businessType, setBusinessType] = useState("");
  // const [companyName, setCompanyName] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  // const [editingAddress, setEditingAddress] = useState({
  //   index: null,
  //   address: null,
  // });

  // const [selectedAddressIndex, setSelectedAddressIndex] = useState<
  //   number | null
  // >(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fileData = localStorage.getItem("fileData");
    const storedFileName = localStorage.getItem("fileName");
    setFileData(fileData || undefined);
    setFileName(storedFileName || undefined);
  }, []);

  const openModalFile = () => setIsModalOpen(true);
  const closeModalFile = () => setIsModalOpen(false);

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

  //Buka atau tutup modals tambah alamat
  const openModal = () => {
    setModalAddressIsOpen(true);
  };

  const handleSelectClick = (address: Address, index: number) => {
    setSelectedAddress(address);
    setSelectedAddressIndex(index);
    localStorage.setItem("selectedAddress", JSON.stringify(address));
    localStorage.setItem("selectedAddressIndex", index.toString());
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

  //Ubah alamat pengguna
  const handleEditClick = (index: any) => {
    const storedAddresses = JSON.parse(
      localStorage.getItem("addresses") || "[]"
    );

    const addressToEdit = storedAddresses[index];
    setEditingAddress({ index: index, address: addressToEdit });
    setModalAddressIsOpen(true);
  };

  // //Submit alamat pengguna
  // const handleUpdateAddress = (index: number, newAddress: any) => {
  //   // Buat array baru dengan alamat yang diperbarui
  //   const updatedAddresses = addresses.map((address, i) => (i === index ? newAddress : address));

  //   // Perbarui status dan penyimpanan lokal
  //   setAddresses(updatedAddresses);
  //   localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
  // };

  useEffect(() => {
    // Get pengguna saat ini berdasarkan email atau ID
    const userEmail = localStorage.getItem("userEmail");

    // Get gambar dari local storage dari user saat ini atau id
    const savedImage = localStorage.getItem(`userImage_${userEmail}`);

    if (savedImage) {
      const imageUrl = savedImage.split("?")[0];
      setImageSrc(imageUrl);
    }
  }, []);

  //Function untuk mengupload Image
  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      //Tambahkan timestamp ke URL sumber gambar
      const imageUrl = `${reader.result}?timestamp=${new Date().getTime()}`;

      // Perbarui URL sumber gambar dalam state
      setSelectedImage(imageUrl);
      setImageSrc(imageUrl);

      // Simpan data gambar ke penyimpanan lokal
      const userId = "currentUserId";
      localStorage.setItem(userId, imageUrl);
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImageSrc("");
      setSelectedImage("");
    }
  };

  useEffect(() => {
    // Ambil data gambar dari penyimpanan lokal
    const userIdProfile = "currentUserId";
    const savedImage = localStorage.getItem(userIdProfile);

    if (savedImage) {
      // Hapus timestamp dari URL sumber gambar
      const imageUrl = savedImage.split("?")[0];

      // Perbarui URL sumber gambar di negara bagian
      setImageSrc(imageUrl);
    }
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem("currentUserName");
    if (storedName) {
      setName(storedName);
    }
  }, [router]);

  // Untuk Login

  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userPhone = localStorage.getItem("phoneNumber");
    const storedPassword = localStorage.getItem("password");
    const fileData = localStorage.getItem("fileData");
    const userImage = localStorage.getItem(`userImage_${userEmail}`);

    if (userEmail && isLoggedIn) {
      setEmail(userEmail);
      if (userPhone) {
        setPhoneNumber(userPhone);
      }

      if (storedPassword) {
        setPassword(storedPassword);
      }

      if (fileData) {
        setFileData(fileData);
      }

      if (fileName) {
        setFileName(fileName);
      }

      if (userImage) {
        setSelectedImage(userImage);
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleUpdateName = () => {
    Swal.fire({
      title: "Ubah nama",
      text: "Anda hanya diperbolehkan untuk mengganti nama satu kali lagi. Pastikan nama yang dipilih sudah sesuai.",
      inputLabel: "Nama Lengkap",
      input: "text",
      inputValue: name,
      inputPlaceholder: "Nama baru",
      showCancelButton: false,
      showCloseButton: true,
      confirmButtonColor: "#6bc84d",
      confirmButtonText: "Simpan",
      preConfirm: (name) => {
        if (!name) {
          Swal.showValidationMessage("Mohon isikan nama baru!");
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Nama berhasil diubah!",
          icon: "success",
          confirmButtonColor: "#6BC84D",
        });
        // Tentukan key untuk nama pengguna di penyimpanan lokal
        const userNameKey = "currentUserName";
        // Simpan nama baru ke penyimpanan lokal, timpa nama aslinya
        localStorage.setItem(userNameKey, result.value);

        // Perbarui status nama
        setName(result.value);

        // Ambil pengguna dari penyimpanan lokal
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        // Temukan pengguna saat ini dan perbarui namanya
        const userIndex = users.findIndex((user: any) => user.name === name);
        if (userIndex !== -1) {
          users[userIndex].name = result.value;

          // Simpan kembali pengguna yang diperbarui ke penyimpanan lokal
          localStorage.setItem("users", JSON.stringify(users));
        }
      }
    });
  };

  useEffect(() => {
    //Ambil data nama dari penyimpanan lokal
    const userNameKey = "userName";
    const savedName = localStorage.getItem(userNameKey);

    if (savedName) {
      setName(savedName);
    }
  }, []);

  const handleUpdatePhone = () => {
    Swal.fire({
      title: "Ubah No.Telepon",
      text: "Anda hanya diperbolehkan untuk mengganti No.Telepon satu kali lagi. Pastikan data sudah sesuai.",
      inputLabel: "No.Telepon",
      input: "text",
      inputValue: phoneNumber,
      inputPlaceholder: "Nomor baru",
      showCancelButton: false,
      showCloseButton: true,
      confirmButtonColor: "#6bc84d",
      confirmButtonText: "Simpan",
      preConfirm: (phoneNumber) => {
        if (!phoneNumber) {
          Swal.showValidationMessage("Mohon isikan nomor baru!");
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Nomor berhasil diubah!",
          icon: "success",
          confirmButtonColor: "#6BC84D",
        });
        // Tentukan key untuk nomor telepon pengguna di penyimpanan lokal
        const userPhoneKey = "userPhone";
        // Simpan nomor telepon baru ke penyimpanan lokal, timpa nomor telepon aslinya
        localStorage.setItem(userPhoneKey, result.value);

        // Perbarui status nomor telelpon
        setPhoneNumber(result.value);

        // Ambil pengguna dari penyimpanan lokal
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        // Temukan pengguna saat ini dan perbarui nomor teleponnya
        const userIndex = users.findIndex((user: any) => user.email === email);
        if (userIndex !== -1) {
          users[userIndex].phoneNumber = result.value;

          // Simpan kembali pengguna yang diperbarui ke penyimpanan lokal
          localStorage.setItem("users", JSON.stringify(users));
        }
      }
    });
  };

  useEffect(() => {
    //Ambil data phone dari penyimpanan lokal
    const userPhoneKey = "userPhone";
    const savedPhone = localStorage.getItem(userPhoneKey);

    if (savedPhone) {
      setPhoneNumber(savedPhone);
    }
  }, []);

  const handleUpdateEmail = () => {
    Swal.fire({
      title: "Ubah E-mail",
      text: "Anda hanya diperbolehkan untuk mengganti E-mail satu kali lagi. Pastikan data sudah sesuai.",
      inputLabel: "E-mail",
      input: "text",
      inputValue: email,
      inputPlaceholder: "Email baru",
      showCancelButton: false,
      showCloseButton: true,
      confirmButtonColor: "#6bc84d",
      confirmButtonText: "Simpan",
      preConfirm: (phoneNumber) => {
        if (!phoneNumber) {
          Swal.showValidationMessage("Mohon isikan e-mail baru!");
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "E-mail berhasil diubah!",
          icon: "success",
          confirmButtonColor: "#6BC84D",
        });
        // Tentukan key untuk nomor telepon pengguna di penyimpanan lokal
        const userEmailKey = "userEmail";
        // Simpan nomor telepon baru ke penyimpanan lokal, timpa nomor telepon aslinya
        localStorage.setItem(userEmailKey, result.value);

        // Perbarui status nomor telelpon
        setEmail(result.value);

        // Ambil pengguna dari penyimpanan lokal
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        // Temukan pengguna saat ini dan perbarui nomor teleponnya
        const userIndex = users.findIndex((user: any) => user.email === email);
        if (userIndex !== -1) {
          users[userIndex].email = result.value;

          // Simpan kembali pengguna yang diperbarui ke penyimpanan lokal
          localStorage.setItem("users", JSON.stringify(users));
        }
      }
    });
  };

  useEffect(() => {
    //Ambil data email dari penyimpanan lokal
    const userEmailKey = "userEmail";
    const savedEmail = localStorage.getItem(userEmailKey);

    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleUpdatePassword = () => {
    Swal.fire({
      title: "Ubah Password",
      html: `
        <input id="new-password" type="password" class="swal2-input" placeholder="Password baru" oninput="this.style.borderColor = 'green'">
        <input id="confirm-password" type="password" class="swal2-input" placeholder="Konfirmasi password baru" oninput="this.style.borderColor = 'green'">
      `,
      focusConfirm: false,
      showCancelButton: false,
      showCloseButton: true,
      confirmButtonColor: "#6bc84d",
      confirmButtonText: "Simpan",
      preConfirm: () => {
        const newPassword = (
          document.getElementById("new-password") as HTMLInputElement
        ).value;
        const confirmPassword = (
          document.getElementById("confirm-password") as HTMLInputElement
        ).value;

        if (!newPassword) {
          Swal.showValidationMessage("Mohon isikan password baru!");
          return false;
        }

        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage("Password tidak sama!");
          return false;
        }

        return newPassword;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Password berhasil diubah!",
          icon: "success",
          confirmButtonColor: "#6BC84D",
        });
        // Tentukan key untuk password pengguna di penyimpanan lokal
        const userPasswordKey = "password";
        // Simpan password baru ke penyimpanan lokal, replace password aslinya
        localStorage.setItem(userPasswordKey, result.value);

        // Perbarui status password
        setPassword(result.value);

        // Ambil pengguna dari penyimpanan lokal
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        // Temukan pengguna saat ini dan perbarui passwordnya
        const user = users.find((user: any) => user.email === email);
        if (user) {
          // Mengatur kata sandi pada objek pengguna
          user.password = result.value;

          // Simpan kembali pengguna yang diperbarui ke penyimpanan lokal
          localStorage.setItem("users", JSON.stringify(users));
        }
      }
    });
  };

  useEffect(() => {
    //Ambil data password dari penyimpanan lokal
    const userPasswordKey = "password";
    const savedPassword = localStorage.getItem(userPasswordKey);

    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  // Fungsi untuk mendapatkan tanggal lahir dari penyimpanan lokal
  const [birthDate, setBirthDate] = useState(() => {
    const userEmailKey = "userEmail";
    const savedEmail = localStorage.getItem(userEmailKey);

    // Dapatkan tanggal lahir dari penyimpanan lokal menggunakan email pengguna
    const userBirthDateKey = `userBirthDate_${savedEmail}`;
    return localStorage.getItem(userBirthDateKey);
  });

  const handleUpdateBirthDate = () => {
    Swal.fire({
      title: "Update Tanggal Lahir",
      text: "Masukkan tanggal lahir Kamu!",
      input: "date",
      inputValue: birthDate,
      inputPlaceholder: "Masukkan tanggal lahir kamu!",
      confirmButtonColor: "#6bc84d",
      confirmButtonText: "Simpan",
      showCloseButton: true,
      preConfirm: (date) => {
        if (!date) {
          Swal.showValidationMessage("Mohon masukkan tanggal lahir!");
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Tanggal lahir berhasil diubah!",
          icon: "success",
          confirmButtonColor: "#6BC84D",
        });

        const users = JSON.parse(localStorage.getItem("users") || "[]");
        // Simpan tanggal lahir
        const newBirthDate = result.value;
        const userEmailKey = "userEmail";
        const savedEmail = localStorage.getItem(userEmailKey);

        // simpan tanggal lahir,berdasarkan user saat ini
        const userBirthDateKey = `userBirthDate_${savedEmail}`;
        localStorage.setItem(userBirthDateKey, newBirthDate);
        setBirthDate(newBirthDate);
      }
    });
  };

  const getBirthDate = () => {
    const userEmailKey = "userEmail";
    const savedEmail = localStorage.getItem(userEmailKey);
    // Dapatkan tanggal lahir dari penyimpanan lokal menggunakan email pengguna
    const userBirthDateKey = `userBirthDate_${savedEmail}`;
    return localStorage.getItem(userBirthDateKey);
  };

  useEffect(() => {
    const birthDate = getBirthDate();
    setBirthDate(birthDate);
  }, [localStorage.getItem("userEmail")]);

  const [gender, setGender] = useState(() => {
    const userEmailKey = "userEmail";
    const savedEmail = localStorage.getItem(userEmailKey);

    // Dapatkan tanggal lahir dari penyimpanan lokal menggunakan email pengguna
    const userBirthDateKey = `userBirthDate_${savedEmail}`;
    return localStorage.getItem(userBirthDateKey);
  });

  const handleUpdateGender = () => {
    Swal.fire({
      title: "Pilih jenis kelamin",
      text: "Anda hanya diperbolehkan untuk mengganti jenis kelamin satu kali lagi. Pastikan data sudah sesuai.",
      input: "select",
      inputOptions: {
        Pria: "Pria",
        Wanita: "Wanita",
      },
      inputValue: gender,
      inputPlaceholder: "Pilih jenis kelamin",
      confirmButtonColor: "#6BC84D",
      confirmButtonText: "Simpan",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Jenis Kelamin berhasil diperbarui!",
          icon: "success",
          confirmButtonColor: "#6BC84D",
        });
        const newGender = result.value;

        const userEmailKey = "userEmail";
        const savedEmail = localStorage.getItem(userEmailKey);

        // Simpan jenis kelamin untuk pengguna saat ini
        const userGenderKey = `userGender_${savedEmail}`;
        localStorage.setItem(userGenderKey, newGender);

        setGender(newGender);
      }
    });
  };

  const getGender = () => {
    const userEmailKey = "userEmail";
    const savedEmail = localStorage.getItem(userEmailKey);

    // Dapatkan jenis kelamin dari penyimpanan lokal menggunakan email pengguna
    const userGenderKey = `userGender_${savedEmail}`;
    return localStorage.getItem(userGenderKey);
  };
  useEffect(() => {
    const gender = getGender();
    setGender(gender);
  }, [localStorage.getItem("userEmail")]);

  useEffect(() => {
    const savedAddresses = localStorage.getItem("addresses");
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  // Hapus alamat dari negara bagian
  const handleDeleteAddress = (index: any) => {
    Swal.fire({
      title: "Apa kamu yakin ingin menghapus alamat ini?",
      imageUrl: "./assets/icon/ic_round-warning.svg",
      imageHeight: 100,
      showCancelButton: true,
      // confirmButtonColor: '#6bb84d',
      confirmButtonText: "Konfirmasi",
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
        Swal.fire({
          title: "Alamat berhasil dihapus!",
          icon: "success",
          confirmButtonColor: "#6BC84D",
        });

        const newAddresses = [...addresses];
        newAddresses.splice(index, 1);
        setAddresses(newAddresses);

        // Simpan array alamat yang diperbarui kembali ke penyimpanan lokal
        localStorage.setItem("addresses", JSON.stringify(newAddresses));
        localStorage.setItem("selectedAddress", JSON.stringify(address));
      }
    });
  };

 const handleDownload = () => {
    if (fileData) {
      const link = document.createElement('a');
      link.href = fileData;
      link.download = fileData.substring(fileData.lastIndexOf('/') + 1);
      link.click();
    }
  };

  // Jika terdapat session, maka akan menampilkan pesan selamat datang
  return (
    <div className="w-full flex-col flex justify-center relative">
      <div className="mt-4 w-full p-8 flex-col justify-start items-center xs:p-0 xs:justify-center xs:mx-auto xs:block lg:pl-10 lg:pr-10 xl:pl-20 xl:pr-20">
        <div className=" gap-2 flex flex-col justify-start lg:items-start xs:justify-center xs:items-start xs:flex md:items-center">
          <div className="flex justify-start items-start">
            <h1 className="pl-2 text-black text-3xl text-left font-bold font-['Helvetica'] xs:text-left xs:text-xl md:text-center md:text-3xl lg:text-3xl lg:text-left lg:mt-4">
              Pengaturan
            </h1>
          </div>

          <div className="w-full h-px border-1 border-primary-main " />
          <div className="flex flex-col justify-start items-start gap-6 mb-10 xs:gap-0 xs:mb-0 xs:flex xs:mt-4 xs:w-full md:w-full md:gap-0 lg:w-auto lg:gap-4 lg:flex lg:items-center lg:flex-row xl:gap-8 xl:flex xl:items-start">
            <div className="flex-col justify-center items-center gap-6 inline-flex xs:justify-center xs:items-center xs:w-full md:w-full lg:w-full xl:w-full xl:gap-4">
              <img
                src={imageSrc}
                className="w-72 h-80 bg-neutral-300 rounded-lg justify-center items-center gap-1 inline-flex relative xs:w-52 xs:h-56 lg:w-[16rem] lg:h-64 xl:w-[20rem] xl:h-80"
              ></img>
              <div className="h-40 flex-col justify-start items-center gap-4 flex">
                <label
                  htmlFor="uploadFile1"
                  className="button-secondary xs:w-2/3 lg:w-[16rem] xl:w-[20rem]"
                >
                  <p className="text-xl font-semibold text-primary-main xs:text-lg">
                    Ubah Foto
                  </p>
                  <input
                    type="file"
                    id="uploadFile1"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>

                <div className="w-80 text-justify text-neutral-600 text-lg font-normal mb-4 font-['Helvetica'] leading-6 xs:text-base xs:text-center xs:pl-4 xs:pr-4 md:text-lg lg:w-72 lg:pl-0 lg:pr-0 lg:text-justify xl:w-80">
                  *Maks ukuran file adalah 5Mb (JPG,JPEG & PNG) dengan resolusi
                  maksimal 3000 x 3000 PX
                </div>
              </div>
            </div>
            <hr className="w-full h-px border border-stone-400 xs:visible lg:invisible"></hr>
            <div className="w-full flex-col justify-center inline-flex">
              <div className="w-full justify-center xs:p-4 md:pl-4 md:pr-0 md:pt-0 md:pb-4 md:mt-8 lg:mt-0">
                <h1 className="text-black font-bold font-['Helvetica'] xs:text-left xs:text-lg min-[400px]:text-xl md:text-center md:text-2xl lg:text-left lg:text-3xl">
                  Data Diri
                </h1>
              </div>
              <div className="pl-4 flex-col justify-center gap-4 items-start flex xs:flex-col xs:items-start min-[400px]:gap-4 md:items-start md:gap-4 md:pl-16 lg:items-start lg:pl-4">
                <div className="w-full items-center inline-flex xs:gap-2 md:gap-8 lg:gap-6">
                  <p className="text-zinc-800 font-normal font-['Helvetica'] leading-10 xs:w-28 xs:text-sm min-[400px]:text-base md:w-48 md:text-2xl lg:text-xl xl:text-2xl">
                    Nama Lengkap
                  </p>
                  <p className="text-zinc-800 font-normal font-['Helvetica'] leading-10 xs:text-sm min-[400px]:text-base md:text-2xl lg:text-xl xl:text-2xl">
                    :
                  </p>
                  <p className="text-black text-2xl font-normal font-['Helvetica'] leading-10 xs:text-sm min-[400px]:text-base md:text-2xl lg:w-max lg:text-xl xl:text-2xl">
                    {name || "-"}
                  </p>
                  <div className="h-10 bg-orange-200 rounded-lg justify-center items-center flex xs:h-8 md:h-10">
                    <button
                      onClick={handleUpdateName}
                      className="w-20 text-center text-zinc-800 text-2xl font-normal font-['Helvetica'] leading-10 xs:w-16 xs:text-sm min-[400px]:text-base md:w-20 md:text-xl lg:w-20 lg:text-xl xl:text-2xl"
                    >
                      Ubah
                    </button>
                  </div>
                </div>
                <div className="items-center inline-flex xs:gap-2 md:gap-8 lg:gap-6">
                  <p className=" text-zinc-800 text-2xl font-normal font-['Helvetica'] leading-10 xs:w-28 xs:text-sm min-[400px]:text-base md:w-48 md:text-2xl lg:w-48 lg:text-xl xl:text-2xl">
                    Tanggal Lahir
                  </p>
                  <p className="text-zinc-800 text-2xl font-normal font-['Helvetica'] leading-10 xs:text-sm min-[400px]:text-base md:text-2xl lg:text-xl xl:text-2xl">
                    :
                  </p>

                  <p className="text-black text-2xl font-normal font-['Helvetica'] leading-10 xs:text-sm min-[400px]:text-base md:text-2xl lg:text-xl xl:text-2xl">
                    {birthDate || "-"}
                  </p>
                  <div className="h-10 bg-orange-200 rounded-lg justify-center items-center xs:h-8 md:h-10 flex">
                    <button
                      onClick={handleUpdateBirthDate}
                      className="w-20 text-center text-zinc-800 text-2xl font-normal font-['Helvetica'] leading-10 xs:w-16 xs:text-sm min-[400px]:text-base md:w-20 md:text-2xl lg:w-20 lg:text-xl xl:text-2xl"
                    >
                      Ubah
                    </button>
                  </div>
                </div>
                <div className="items-center inline-flex xs:gap-2 md:gap-8 lg:gap-6">
                  <p className=" text-zinc-800 text-2xl font-normal font-['Helvetica'] leading-10 xs:w-28 xs:text-sm min-[400px]:text-base md:w-48 md:text-2xl lg:w-48 lg:text-xl xl:text-2xl">
                    Jenis Kelamin
                  </p>
                  <p className="text-zinc-800 text-2xl font-normal font-['Helvetica'] leading-10 xs:text-base md:text-2xl lg:text-xl xl:text-2xl">
                    :
                  </p>
                  <p className="text-black text-2xl font-normal font-['Helvetica'] leading-10 xs:text-sm min-[400px]:text-base md:text-2xl lg:text-xl xl:text-2xl">
                    {gender || "-"}
                  </p>
                  <div className="h-10 bg-orange-200 rounded-lg justify-center items-center flex xs:h-8 md:h-10">
                    <button
                      onClick={handleUpdateGender}
                      className="w-20 text-center text-zinc-800 text-2xl font-normal font-['Helvetica'] leading-10 xs:w-16 xs:text-base md:w-20 md:text-2xl lg:w-20 lg:text-xl xl:text-2xl"
                    >
                      Ubah
                    </button>
                  </div>
                </div>
                <div className="items-center inline-flex xs:gap-2 md:gap-8 lg:gap-6">
                  <p className=" text-zinc-800 text-2xl font-normal font-['Helvetica'] leading-10 xs:w-28 xs:text-sm min-[400px]:text-base md:w-48 md:text-2xl lg:w-48 lg:text-xl xl:text-2xl">
                    No.Telepon
                  </p>
                  <p className="text-zinc-800 text-2xl font-normal font-['Helvetica'] leading-10 xs:text-sm min-[400px]:text-base md:text-2xl lg:text-xl xl:text-2xl">
                    :
                  </p>
                  <p className="text-black text-2xl font-normal font-['Helvetica'] leading-10 xs:text-sm min-[400px]:text-base md:text-2xl lg:text-xl xl:text-2xl">
                    {phoneNumber || "-"}
                  </p>
                  <div className="h-10 bg-orange-200 rounded-lg justify-center items-center flex xs:h-8 md:h-10">
                    <button
                      onClick={handleUpdatePhone}
                      className="w-20 text-center text-zinc-800 text-2xl font-normal font-['Helvetica'] leading-10 xs:w-16 xs:text-base md:w-20 md:text-2xl lg:w-20 lg:text-xl xl:text-2xl"
                    >
                      Ubah
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full xs:p-4 md:mt-6">
                <h1 className="text-black font-bold font-['Helvetica'] xs:text-left xs:text-lg min-[400px]:text-xl md:text-center md:text-2xl lg:text-left lg:text-3xl">
                  Akun
                </h1>
              </div>
              <div className="pl-4 flex-col justify-center items-start gap-4 flex xs:flex-col xs:items-start md:pl-16 md:items-start lg:p-4 lg:items-start">
                <div className="items-center inline-flex xs:gap-2 md:gap-8 lg:gap-6">
                  <p className=" text-zinc-800 text-2xl font-normal font-['Helvetica'] leading-10 xs:w-10 xs:text-sm min-[400px]:text-base md:w-48 md:text-2xl lg:w-24 lg:text-xl xl:text-2xl xl:w-48">
                    Email
                  </p>
                  <p className="text-zinc-800 text-2xl font-normal font-['Helvetica'] leading-10 xs:text-sm min-[400px]:text-base md:text-2xl lg:text-xl xl:text-2xl">
                    :
                  </p>
                  <p className="text-black text-2xl font-normal font-['Helvetica'] leading-10 xs:text-sm min-[400px]:text-base md:text-2xl lg:text-xl xl:text-2xl">
                    {email || "-"}
                  </p>
                  <div className="h-10 bg-orange-200 rounded-lg justify-center items-center flex xs:h-8 md:h-10">
                    <button
                      onClick={handleUpdateEmail}
                      className="w-20 text-center text-zinc-800 text-2xl font-normal font-['Helvetica'] leading-10 xs:w-16 xs:text-base md:w-20 md:text-2xl lg:w-20 lg:text-xl xl:text-2xl"
                    >
                      Ubah
                    </button>
                  </div>
                </div>
                <div className="items-center gap-4 inline-flex xs:gap-2 lg:gap-6">
                  <div className="justify-start items-center gap-6 inline-flex xs:gap-2 md:gap-8 lg:gap-6">
                    <p className="w-48 text-zinc-800 text-2xl font-normal font-['Helvetica'] leading-10 xs:w-20 xs:text-lg md:w-48 md:text-2xl lg:w-24 lg:text-xl xl:text-2xl xl:w-48">
                      Password
                    </p>
                    <p className="text-zinc-800 text-2xl font-normal font-['Helvetica'] leading-10 xs:text-lg lg:text-xl xl:text-2xl">
                      :
                    </p>
                    <div className="w-[37%] relative ">
                      <input
                        className="form-input"
                        id="password"
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="Password"
                        value={password}
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
                    <button className="h-10 bg-orange-200 rounded-lg justify-center items-center flex xs:h-8 md:h-10">
                      <div
                        onClick={handleUpdatePassword}
                        className="w-20 text-center text-zinc-800 text-2xl font-normal font-['Helvetica'] leading-10 xs:w-16 xs:text-base md:w-20 md:text-2xl lg:w-20 lg:text-xl xl:text-2xl"
                      >
                        Ubah
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-10 mt-10 w-full h-px border-1 border-stone-300 xs:border xs:mb-4"></div>
        <div className="w-full flex-col justify-center gap-2 inline-flex">
          <div className="w-full xs:p-4">
            <h1 className="text-black font-bold font-['Helvetica'] xs:text-left xs:text-lg min-[400px]:text-xl md:text-center md:text-2xl lg:text-left lg:text-3xl">
              Legal Document
            </h1>
            {fileName && (
              <div className="w-full justify-start flex flex-col items-start mt-4 xs:items-start md:items-center md:justify-center lg:justify-start lg:items-start">
                <img src="./assets/icon/mdi_file.svg" className="h-10 w-10 lg:w-12 lg:h-12"></img>
                <p
                  className=" cursor-pointer text-blue-500 underline"
                  onClick={openModalFile}
                >
                  {fileName}
                </p>
              </div>
            )}
            <Modal
              isOpen={isModalOpen}
              onRequestClose={closeModalFile}
              contentLabel="File Preview"
              style={{
                content: {
                  top: "50%",
                  left: "50%",
                  right: "auto",
                  bottom: "auto",
                  marginRight: "-50%",
                  transform: "translate(-50%, -50%)",
                  width: "80%",
                  height: "80%",
                },
              }}
            >
              <button onClick={closeModalFile} className="absolute top-2 right-2 text-white rounded px-2 py-1">
              <img src="./assets/icon/close-btn.svg" className="h-8 w-8 xs:w-4 xs:h-4 lg:h-6 lg:w-6" />
            </button>
              {fileData && (
                <div className="w-full h-full justify-center items-center flex flex-col">
                  {fileData.startsWith("data:image/") ? (
                    <img
                      src={fileData}
                      alt="Uploaded File"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  ) : fileData.startsWith("data:application/pdf") ? (
                    <FileViewer
                      file={fileData}
                      fileType="pdf"
                      onError={(e: any) => console.log("Error:", e)}
                    />
                  ) : (
                    <p className="p-2 mb-2 font-semibold italic">
                      Tipe file tidak mendukung.
                    </p>
                  )}
                  <button onClick={handleDownload} className="button-primary w-1/2">
                    Download File
                  </button>
                </div>
              )}
            </Modal>
          </div>
        </div>

        <div className="mb-10 mt-10 w-full h-px border-1 border-stone-300 xs:border xs:mb-4"></div>
        <div className="w-full flex-col justify-center mb-10 gap-2 inline-flex xs:gap-0 md:pl-12 md:pr-12 md:pt-2 md:pb-0 lg:p-0">
          <div className="w-full xs:p-4">
            <h1 className="text-black font-bold font-['Helvetica'] xs:text-left xs:text-lg min-[400px]:text-xl md:text-center md:text-2xl lg:text-left lg:text-3xl">
              Daftar Alamat
            </h1>
          </div>
          <div className=" xs:p-4 lg:p-0 ">
            <button
              onClick={openModal}
              className="button-secondary text-xl font-semibold text-primary-main xs:text-base xs:w-[80%] md:w-1/3 lg:flex lg:w-1/3"
            >
              + Tambah Alamat
            </button>
          </div>
          <ModalAlamat />

          {addresses.length === 0 ? (
            <div className="p-2 xs:p-4 lg:p-0 lg:pt-4">
              <div className="w-full p-10 bg-white rounded-2xl border border-stone-400 justify-center items-center gap-9 inline-flex xs:gap-6 ">
                <img
                  className="w-8 h-8"
                  src="./assets/icon/icon_location.svg"
                />
                <p className=" italic text-xl font-bold text-stone-700">
                  Kamu masih belum memiliki daftar alamat!
                </p>
              </div>
            </div>
          ) : (
            //Mengurutkan data index,berdasarkan yang terbaru
            addresses
              .slice()
              .reverse()
              .map((address: any, index) => {
                const originalIndex = addresses.length - 1 - index; // Sesuaikan indeks agar sesuai dengan array aslinya
                return (
                  <div key={index} className="p-2 xs:p-4 lg:p-0 lg:pt-4">
                    <div
                      key={originalIndex}
                      className={`w-full h-auto p-4 rounded-2xl border-1 border-primary-main flex-col justify-center items-start gap-9 inline-flex xs:gap-6 ${
                        selectedAddressIndex === originalIndex
                          ? "bg-primary-surface"
                          : ""
                      }`}
                    >
                      <div className="justify-start items-center gap-8 inline-flex xs:gap-4 xs:w-full xs:flex xs:justify-between lg:justify-start">
                        <div className="w-36 h-14 p-2.5 bg-neutral-100 rounded-2xl justify-center items-center gap-2.5 flex">
                          <h1 className=" text-zinc-800 text-lg font-bold font-['Helvetica'] leading-10 xs:text-sm md:text-lg lg:text-lg">
                            {address.labelAddress}
                          </h1>
                        </div>
                        <div className="flex gap-2.5 xs:flex xs:flex-col md:flex-row lg:flex-row ">
                          <div className="justify-start items-center gap-2.5 inline-flex">
                            <button
                              onClick={() => handleEditClick(originalIndex)}
                              className="text-center inline-flex items-center"
                            >
                              <img
                                className="xs:w-5 xs:h-5 md:w-8 md:h-8 lg:w-8 lg:h-8 "
                                src="./assets/icon/material-edit.svg"
                              />
                              <p className="text-secondary-main  font-semibold text-lg xs:text-base md:text-lg lg:text-lg">
                                Ubah
                              </p>
                            </button>
                          </div>
                          <div className="justify-start items-center gap-2.5 inline-flex">
                            <button
                              onClick={() => handleDeleteAddress(originalIndex)}
                              className="text-center inline-flex items-center"
                            >
                              <img
                                className="xs:w-5 xs:h-5 md:w-8 md:h-8 lg:w-8 lg:h-8"
                                src="./assets/icon/delete-fill.svg"
                              />
                              <p className="text-red-500  font-semibold text-lg xs:text-base md:text-lg lg:text-lg">
                                Hapus
                              </p>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex justify-start items-center gap-10 xs:gap-6 xs:flex-col lg:flex-row">
                        <div className="w-full flex-col justify-start items-start gap-2.5  ">
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
                                  ({address.businessType} {address.companyName})
                                </p>
                              </div>

                              <p className="text-black text-xl font-normal font-['Helvetica'] leading-10 xs:text-lg">
                                {address.phoneNumberAddress}
                              </p>

                              <p className="text-black text-xl font-normal font-['Helvetica'] xs:text-lg">
                                {address.address} - {address.postalZip}
                              </p>
                              <div className="flex">
                                <p className="text-black text-xl font-normal font-['Helvetica'] xs:text-lg">
                                  {address.province}
                                </p>
                                <span className="pl-2 pr-2">-</span>
                                <p className="text-black text-xl font-normal font-['Helvetica'] xs:text-lg">
                                  {address.city}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            handleSelectClick(address, originalIndex)
                          }
                          className={`button-primary xs:w-full xs:text-base md:w-1/2 lg:w-1/2 ${
                            selectedAddressIndex === originalIndex
                              ? "button-secondary xs:w-full xs:text-base md:w-1/2 lg:w-1/2 text-primary-main "
                              : ""
                          }`}
                        >
                          {selectedAddressIndex === originalIndex ? (
                            <>
                              <img
                                src="./assets/icon/check.svg"
                                className=" xs:w-5 xs:h-5 lg:w-8 lg:h-8"
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
  );
}
