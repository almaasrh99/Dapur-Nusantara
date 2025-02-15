'use client';

import Image from 'next/image';

function KontakKami() {
  return (
    <div>
      <div className="text-center font-bold mb-3">Kontak Kami</div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2.5 items-start">
          <Image src={'/assets/icons/location.svg'} width={20} height={20} alt="location_icons" className="mt-1" />
          <div className="text-justify">
            Jl. Kaliurang No.36, Kocoran, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281
          </div>
        </div>
        <div className="flex gap-2.5 ">
          <Image src={'/assets/icons/phone.svg'} width={20} height={20} alt="phone_icons" className="mt-1" />
          <div>(+62) 812121217263</div>
        </div>
        <div className="flex gap-2.5">
          <Image src={'/assets/icons/mail.svg'} width={20} height={20} alt="mail_icons" className="mt-1" />
          <div>dapur_nusantara@gmail.com</div>
        </div>
      </div>
    </div>
  );
}

function TemukanKami() {
  return (
    <div>
      <div className="text-center font-bold mb-3">Temukan Kami</div>
      <div className="flex gap-3 justify-center">
        <Image src={'/assets/img/fb.png'} width={48} height={48} alt="facebook" />
        <Image src={'/assets/img/ig.png'} width={48} height={48} alt="instagram" />
        <Image src={'/assets/img/x.png'} width={48} height={48} alt="x" />
      </div>
    </div>
  );
}

function TentangKami() {
  return (
    <div>
      <div className="font-bold text-center mb-3">Tentang Kami</div>

      <div className="text-justify">
        Kami adalah destinasi utama bagi para penggiat F&B yang mencari solusi terbaik untuk memenuhi kebutuhan bahan
        baku bisnis mereka. Di <span className="font-bold">Dapur Nusantara</span>, kami menyediakan produk berkualitas
        tinggi dari merek-merek terkemuka, dengan layanan personal dan fleksibel untuk mendukung pertumbuhan bisnis
        kuliner Anda. Bersama-sama, mari ciptakan pengalaman kuliner yang tak terlupakan bagi pelanggan Anda. Terima
        kasih telah memilih <span className="font-bold">Dapur Nusantara</span> sebagai mitra bisnis Anda.
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-primary-surface text-black pt-4">
      <div className="px-4 flex flex-col gap-5 lg:gap-10 lg:flex-row ">
        <div className="lg:w-3/5 lg:order-3">
          <TentangKami />
        </div>
        <div className="lg:w-2/5 lg:order-1">
          <KontakKami />
        </div>
        <div className="lg:w-1/5 lg:order-2">
          <TemukanKami />
        </div>
      </div>
      <div className="bg-primary-main text-white items-center text-lg gap-2 justify-center mt-16 lg:mt-10 p-3 flex font-bold ">
        <Image src={'/assets/icons/copyright.svg'} width={20} height={20} alt="facebook" />
        Dapur Nusantara 2024
      </div>
    </footer>
  );
}
