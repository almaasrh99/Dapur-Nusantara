import Image from 'next/image';

export default function CheckoutSuccess() {
  return (
    <div className="flex flex-col items-center p-3 lg:p-8 text-center gap-2.5">
      <div className="font-bold text-2xl">TERIMAKASIH</div>
      <div>
        Pesanan Anda telah berhasil dilakukan pada hari ini <span className="font-bold italic">27 Maret 2024</span>{' '}
        dengan nomor pesanan <span className="text-secondary-main">#P-000101</span>
      </div>
      <div>
        Nominal yang harus dibayar : <span className="font-bold text-primary-main">Rp. 157.200</span>
      </div>
      <div className="my-5 flex flex-col items-center justify-center gap-2.5">
        <Image src={'/assets/img/pembayaran/bca.png'} width={200} height={200} className="w-28" alt="bank-bca.png" />
        <div>BCA Virtual Account</div>
        <div className="text-2xl font-bold">1009123456789010</div>
        <div className="p-2.5 rounded-lg border">Salin Nomor</div>
      </div>
      <div className="mb-5">
        Batas waktu pembayaran pesanan sampai <span className="font-bold italic">28 Maret 2024</span> pukul{' '}
        <span className="font-bold italic">23:59 WIB</span>
      </div>
    </div>
  );
}
