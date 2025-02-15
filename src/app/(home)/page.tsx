'use client';
import CardProduct from '@/components/card-product';

import DaftarKategori from '@/components/kategori';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel } from 'react-bootstrap';

const dataProdukRekomendasi = [
  {
    id: 1,
    nama: 'Jeruk Mandarin',
    harga: 25000,
    review: 4.5,
    terjual: 130,
    img: '/assets/img/produk-rekomendasi/jeruk-mandarin.png',
    alt: 'jeruk-mandarin.png',
  },
  {
    id: 2,
    nama: 'Melon Madu',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-rekomendasi/melon-madu.png',
    alt: 'melon-madu.png',
  },
  {
    id: 3,
    nama: 'Anggur Merah',
    harga: 55000,
    review: 4.5,
    terjual: 170,
    img: '/assets/img/produk-rekomendasi/anggur-merah.png',
    alt: 'anggur-merah.png',
  },
  {
    id: 4,
    nama: 'Brokoli',
    harga: 25000,
    review: 4.5,
    terjual: 130,
    img: '/assets/img/produk-rekomendasi/brokoli.png',
    alt: 'brokoli.png',
  },
  {
    id: 5,
    nama: 'Wortel',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-rekomendasi/wortel.png',
    alt: 'wortel.png',
  },
  {
    id: 6,
    nama: 'Sawi Putih',
    harga: 55000,
    review: 4.5,
    terjual: 170,
    img: '/assets/img/produk-rekomendasi/sawi-putih.png',
    alt: 'sawi-putih.png',
  },
  {
    id: 7,
    nama: 'Ayam Broiler Utuh',
    harga: 55000,
    review: 4.5,
    terjual: 170,
    img: '/assets/img/produk-rekomendasi/ayam-broiler-utuh.png',
    alt: 'ayam-broiler-utuh.png',
  },
  {
    id: 8,
    nama: 'Paha Ayam',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-rekomendasi/paha-ayam.png',
    alt: 'paha-ayam.png',
  },
  {
    id: 9,
    nama: 'Kulit Ayam',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-rekomendasi/kulit-ayam.png',
    alt: 'kulit-ayam.png',
  },
  {
    id: 10,
    nama: 'Ikan Gurame',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-rekomendasi/ikan-gurame.png',
    alt: 'ikan-gurame.png',
  },
  {
    id: 11,
    nama: 'Ikan Kerapu',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-rekomendasi/ikan-kerapu.png',
    alt: 'ikan-kerapu.png',
  },
  {
    id: 12,
    nama: 'Daging Sapi',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-rekomendasi/daging-sapi.png',
    alt: 'daging-sapi.png',
  },
];
const dataProdukPromo = [
  {
    id: 13,
    nama: 'Alpukat Mentega',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-promo/alpukat-mentega.png',
    alt: 'alpukat-menetega.png',
  },
  {
    id: 14,
    nama: 'Semangka Kuning',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-promo/semangka-kuning.png',
    alt: 'semangka-kuning.png',
  },
  {
    id: 15,
    nama: 'Kentang',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-promo/kentang.png',
    alt: 'kentang.png',
  },
  {
    id: 16,
    nama: 'Tomat Merah',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-promo/tomat-merah.png',
    alt: 'tomat-merah.png',
  },
  {
    id: 17,
    nama: 'Udang Windu',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-promo/udang-windu.png',
    alt: 'udang-windu.png',
  },
  {
    id: 18,
    nama: 'Cumi Sotong',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-promo/cumi-sotong.png',
    alt: 'cumi-sotong.png',
  },
  {
    id: 19,
    nama: 'Kanzler Sosis Sapi 250g',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-promo/kanzler-sosis-sapi.png',
    alt: 'kanzler-sosis-sapi.png',
  },
  {
    id: 20,
    nama: 'Belfoods Naget Ayam',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-promo/belfoods-naget-ayam.png',
    alt: 'belfoods-naget-ayam.png',
  },
  {
    id: 21,
    nama: 'Tepung Segitiga Biru',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-promo/tepung-segitiga-biru.png',
    alt: 'tepung-segitiga-biru.png',
  },
  {
    id: 22,
    nama: 'Bango Kecap Manis 135mL',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-promo/bango-kecap-manis.png',
    alt: 'bango-kecap-manis.png',
  },
  {
    id: 23,
    nama: 'Greenfields Full Cream',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-promo/greenfields-full-cream.png',
    alt: 'greenfields-full-cream.png',
  },
  {
    id: 24,
    nama: 'Bimoli Minyak Goreng 2L',
    harga: 40000,
    review: 45.0,
    terjual: 75,
    img: '/assets/img/produk-promo/bimoli-minyak-goreng.png',
    alt: 'bimoli-minyak-goreng.png',
  },
];

export default function Home() {
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ProdukRekomendasi = () => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 justify-items-center mb-5">
        {dataProdukRekomendasi &&
          dataProdukRekomendasi.map((data, i) =>
            loading ? (
              <div key={i} className="px-10 py-2 flex flex-col space-y-3">
                <Skeleton className="w-[185px] h-[186px] md:w-[229px] md:h-[201px] lg:w-[179px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="w-[185px] h-[24px] md:w-[229px] lg:w-[179px]" />
                  <Skeleton className="w-[185px] h-[24px] md:w-[229px] lg:w-[179px]" />
                  <Skeleton className="w-[185px] h-[54px] md:w-[229px] lg:w-[179px]" />
                </div>
              </div>
            ) : (
              <CardProduct key={i} data={data} />
            )
          )}
      </div>
    );
  };

  const ProdukPromo = () => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 justify-items-center mb-5">
        {dataProdukPromo &&
          dataProdukPromo.map((data, i) =>
            loading ? (
              <div key={i} className="flex flex-col space-y-2">
                <Skeleton className="w-[185px] h-[186px] md:w-[229px] md:h-[201px] lg:w-[179px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="w-[185px] h-[24px] md:w-[229px] lg:w-[179px]" />
                  <Skeleton className="w-[185px] h-[24px] md:w-[229px] lg:w-[179px]" />
                  <Skeleton className="w-[185px] h-[54px] md:w-[229px] lg:w-[179px]" />
                </div>
              </div>
            ) : (
              <CardProduct key={i} data={data} />
            )
          )}
      </div>
    );
  };

  return (
    <div className="px-3 lg:px-5">
      <section id="carousel h-full">
        <ControlledCarousel />
      </section>
      <section className="flex flex-col lg:flex-row gap-4 mb-10 px-3">
        <div className="h-[382px] w-full lg:h-[620px] lg:w-1/3 relative">
          <Image
            src="/assets/img/bg-information.png"
            alt="Gambar"
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
          />
          <div className="absolute inset-0 text-center flex px-2 flex-col items-center rounded-xl justify-center text-white bg-black bg-opacity-50">
            <h1 className="text-2xl font-bold">“Bahan Fresh setiap harinya”</h1>
            <p className="mt-2 text-lg ">
              Kepuasan Terjamin, Aneka Produk Pilihan. Belanja Aman dan Kualitas Unggulan di Dapur Nusantara!
            </p>
          </div>
        </div>
        <div className="h-2/3 lg:w-2/3 mb-2 px-2">
          <div className="font-bold text-[22px] lg:text-3xl lg:tracking-wide text-center mb-4 lg:mb-5">
            Kenapa Harus Berbelanja Disini ?
          </div>
          <div className="flex flex-col gap-10">
            <div className="flex gap-3 items-start">
              <Image
                src={'/assets/img/kualitas.png'}
                width={90}
                height={90}
                className="w-14 md:w-20"
                alt="kualitas-terjamin.png"
              />
              <div>
                <div className="font-bold lg:tracking-wide lg:text-lg">Kualitas Terjamin</div>
                <p className="text-justify lg:tracking-wide lg:text-lg">
                  Kami menyediakan produk bahan baku berkualitas tinggi yang telah teruji untuk memastikan kepuasan
                  pelanggan dan kualitas produk akhir yang luar biasa.
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Image
                src={'/assets/img/kemudahan.png'}
                width={90}
                height={90}
                className="w-14 md:w-20"
                alt="kemudahan-pemesanan.png"
              />
              <div>
                <div className="font-bold lg:tracking-wide lg:text-lg">Kemudahan Pemesanan</div>
                <p className="text-justify lg:tracking-wide lg:text-lg">
                  Dengan antarmuka yang intuitif dan proses pemesanan yang mudah, pelanggan dapat dengan cepat dan mudah
                  memilih dan memesan bahan-bahan yang mereka butuhkan.
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Image
                src={'/assets/img/beragam.png'}
                width={90}
                height={90}
                className="w-14 md:w-20"
                alt="pilihan-beragam.png"
              />
              <div>
                <div className="font-bold lg:tracking-wide lg:text-lg">Pilihan Beragam</div>
                <p className="text-justify lg:tracking-wide lg:text-lg">
                  Kami menawarkan berbagai macam bahan baku dari berbagai merek terkemuka dalam satu tempat, memudahkan
                  pelanggan untuk menemukan semua yang mereka butuhkan tanpa harus melalui beberapa toko.
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Image
                src={'/assets/img/harga.png'}
                width={90}
                height={90}
                className="w-16 md:w-20"
                alt="harga-bersaing.png"
              />
              <div>
                <div className="font-bold lg:tracking-wide lg:text-lg">Harga Bersaing</div>
                <p className="text-justify lg:tracking-wide lg:text-lg">
                  Kami menawarkan harga yang kompetitif dan terjangkau serta diskon yang berlimpah untuk membantu Bisnis
                  F&B Anda tanpa mengorbankan kualitas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mb-4">
        <div className="font-bold text-2xl my-3">Kategori Produk</div>
        <DaftarKategori />
      </section>
      <section>
        <div className="font-bold text-2xl my-3">Produk Rekomendasi</div>
        <ProdukRekomendasi />
      </section>
      <section>
        <div className="font-bold text-2xl my-3">Produk Sedang Promo</div>
        <ProdukPromo />
      </section>
    </div>
  );
}

function ControlledCarousel() {
  return (
    <Carousel className="my-4">
      <Carousel.Item interval={6000}>
        <Image
          className="block w-full rounded-lg"
          width={1500}
          height={500}
          src="/assets/img/banner-1.png"
          alt="Kamumau Info"
        />
        <Carousel.Caption>
          <h3></h3>
          <p></p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Image
          className="block w-full rounded-lg"
          width={1500}
          height={500}
          src="/assets/img/banner-2.png"
          alt="Kamumau Info"
        />
        <Carousel.Caption>
          <h3></h3>
          <p></p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Image
          className="block w-full rounded-lg"
          width={1500}
          height={500}
          src="/assets/img/banner-3.png"
          alt="Kamumau Info"
        />
        <Carousel.Caption>
          <h3></h3>
          <p></p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}
