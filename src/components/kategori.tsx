'use client';
import Image from 'next/image';
import React from 'react';

const data = [
  {
    nama: 'Semua Kategori',
    img: '/assets/img/kategori/semua.png',
    alt: 'semua-kategori.png',
  },
  {
    nama: 'Sayuran',
    img: '/assets/img/kategori/sayuran.png',
    alt: 'sayuran.png',
  },

  {
    nama: 'Buah-buahan',
    img: '/assets/img/kategori/buah.png',
    alt: 'buah.png',
  },
  {
    nama: 'Daging Segar',
    img: '/assets/img/kategori/daging.png',
    alt: 'daging.png',
  },
  {
    nama: 'Seafood',
    img: '/assets/img/kategori/seafood.png',
    alt: 'seafood.png',
  },
  {
    nama: 'Telur & Susu',
    img: '/assets/img/kategori/telur-susu.png',
    alt: 'telur-susu.png',
  },
  {
    nama: 'Bumbu Dapur',
    img: '/assets/img/kategori/bumbu-dapur.png',
    alt: 'bumbu-dapur.png',
  },
  {
    nama: 'Minuman',
    img: '/assets/img/kategori/minuman.png',
    alt: 'minuman.png',
  },
  {
    nama: 'Bahan Masak & Kue',
    img: '/assets/img/kategori/bahan-masak.png',
    alt: 'bahan-masak.png',
  },
  {
    nama: 'Snacks',
    img: '/assets/img/kategori/snacks.png',
    alt: 'snacks.png',
  },
  {
    nama: 'Frozen Food',
    img: '/assets/img/kategori/frozen-food.png',
    alt: 'frozen-food.png',
  },
  {
    nama: 'Makanan Nabati',
    img: '/assets/img/kategori/nabati.png',
    alt: 'makanan-nabati.png',
  },
];

export default function DaftarKategori() {
  const firstRow = data.slice(0, 6);
  const secondRow = data.slice(6);
  return (
    <>
      {/* <div className='flex h-fit overflow-x-auto md:grid md:grid-cols-4 lg:grid-cols-6 md:gap-3'>
      {data.map((kategori, index) => (
            // <div key={index} className='flex flex-col items-center '>
            <div key={index} className='h-[106px] min-w-[106px] leading-3'>
              <Image src={kategori.img} width={200} height={200} alt={kategori.alt} className="mb-2" />
              <div className=" text-black">{kategori.nama}</div>
            </div>
          ))}
    </div> */}
      <div className="flex overflow-x-auto flex-col pb-4">
        <div className="flex lg:grid lg:grid-cols-6 gap-3">
          {firstRow.map((kategori, index) => (
            <div key={index} className="h-fit min-w-[140px] max-w-[240px]">
              <Image src={kategori.img} width={200} height={200} alt={kategori.alt} className="mb-2" />
              <div className=" text-center text-black">{kategori.nama}</div>
            </div>
          ))}
        </div>
        <div className="flex mt-4 lg:grid lg:grid-cols-6 gap-3">
          {secondRow.map((kategori, index) => (
            <div key={index} className="h-fit min-w-[140px] max-w-[240px]">
              <Image src={kategori.img} width={200} height={200} alt={kategori.alt} className="mb-2" />
              <div className="text-center text-black">{kategori.nama}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
