'use client';
import ModalAlamat from '@/components/modal-alamat';
import ModalDaftarAlamat from '@/components/modal-daftar-alamat';
import Modal from 'react-modal';
import { useAppContext } from '@/context';
import { formatMoney } from '@/lib/helpers';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const dataVirtualAccount = [
  {
    nama: 'BCA Virtual Account',
    img: '/assets/img/pembayaran/bca.png',
    slug: 'bca',
  },
  {
    nama: 'Mandiri Virtual Account',
    img: '/assets/img/pembayaran/mandiri.png',
    slug: 'mandiri',
  },
  {
    nama: 'BNI Virtual Account',
    img: '/assets/img/pembayaran/bni.png',
    slug: 'bni',
  },
];

const dataEwallet = [
  {
    nama: 'Gopay',
    img: '/assets/img/pembayaran/gopay.png',
    slug: 'gopay',
  },
  {
    nama: 'Shopeepay',
    img: '/assets/img/pembayaran/shopeepay.png',
    slug: 'shopeepay',
  },
];
export default function Checkout() {
  const {
    setModalDaftarAlamatIsOpen,
    selectedItems,
    selectPembayaran,
    setSelectPembayaran,
    selectedAddressIndex,
    addresses,
    isMobile,
    saveMyOrders,
  } = useAppContext();

  const [modalPembayaran, setModalPembayaran] = useState(false);
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState({
    index: '',
    data: null,
  });

  useEffect(() => {
    if (selectedItems.length <= 0) {
      router.push('/cart');
    }
  }, []);

  const handleCloseModalPembayaran = () => {
    setModalPembayaran(false);
    setPaymentMethod({ index: '', data: null });
  };

  const getTotalSelectedItems = () => {
    var biayaPengiriman = 24000;
    var subtotal = 0;
    var total = 0;
    selectedItems.map((i: any) => {
      let jumlah = i.product_harga * i.product_qty;
      subtotal += jumlah;
    });

    var ppn = subtotal * (11 / 100);
    const totalPembayaran = {
      subtotal: subtotal,
      biayaPengiriman: biayaPengiriman,
      ppn: ppn,
      total: subtotal + biayaPengiriman + ppn,
    };
    return totalPembayaran;
  };

  const handleSavePaymentMethod = () => {
    if (paymentMethod) {
      setSelectPembayaran(paymentMethod);
      setModalPembayaran(false);
    } else {
      setPaymentMethod({ index: '', data: null });
      setModalPembayaran(false);
    }
  };

  const ModalPembayaran = () => {
    return (
      <Modal
        isOpen={modalPembayaran}
        onRequestClose={handleCloseModalPembayaran}
        contentLabel="Modal Pembayaran"
        className={`w-full lg:p-8 flex items-center justify-center outline-none xs:pl-0 xs:pr-0 lg:pl-20 lg:pr-20 ${
          modalPembayaran ? 'animate-slide-in' : 'animate-slide-out'
        }`}
        overlayClassName="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-end lg:items-center justify-center xs:bottom-0"
      >
        <div className="bg-white rounded-lg w-full  md:w-full lg:w-full pb-6">
          <div className="w-full flex justify-between items-center bg-white shadow-md p-2 rounded-tr-lg rounded-tl-lg">
            <h2 className="text-2xl font-bold p-2 xs:text-xl lg:text-2xl">Pilih Metode Pembayaran</h2>
            <button onClick={handleCloseModalPembayaran} className=" text-white rounded px-2 py-1">
              <img src="./assets/icon/close-btn.svg" className="h-8 w-8 xs:w-4 xs:h-4 lg:h-6 lg:w-6" />
            </button>
          </div>
          <div className="p-4">
            <div className="font-bold">Virtual Account</div>
            {dataVirtualAccount.map((item: any, i: number) => {
              return (
                <div
                  onClick={() => setPaymentMethod({ index: item.nama, data: item })}
                  key={i}
                  className={`flex gap-2.5 mb-4 py-3 px-4 items-center rounded-md border-2  ${
                    paymentMethod.index == item.nama ? 'border-primary-main' : 'border-gray-400'
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full inline-block ${
                      paymentMethod.index == item.nama ? ' bg-primary-main' : 'border-2 border-gray-600 '
                    }`}
                  ></div>
                  <label className="flex gap-3" htmlFor={`label-${item.slug}`}>
                    <img src={item.img} className="w-16 h-6 " />
                    <div>{item.nama}</div>
                  </label>
                </div>
              );
            })}
            <div className="font-bold">E-Wallet</div>
            {dataEwallet.map((item: any, i: number) => {
              return (
                <div
                  onClick={() => setPaymentMethod({ index: item.nama, data: item })}
                  key={i}
                  className={`flex gap-2.5 mb-4 py-3 px-4 items-center rounded-md border-2  ${
                    paymentMethod.index == item.nama ? 'border-primary-main' : 'border-gray-400'
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full inline-block ${
                      paymentMethod.index == item.nama ? ' bg-primary-main' : 'border-2 border-gray-600 '
                    }`}
                  ></div>
                  <img src={item.img} className="w-16 h-6" />
                  <div>{item.nama}</div>
                </div>
              );
            })}
          </div>
          {/* <div className="w-full flex justify-center mt-3"> */}
          <div className="absolute bottom-0 w-full lg:flex lg:justify-center lg:static">
            <div
              onClick={handleSavePaymentMethod}
              className={`text-center text-white px-3 lg:w-1/3 py-3 lg:mb-3 rounded-t-lg lg:rounded-lg font-semibold cursor-pointer  ${
                paymentMethod.index ? 'bg-primary-main' : 'bg-gray-500'
              }`}
            >
              Pilih Metode Pembayaran
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  const BuildAddress = () => {
    const dataAddressWithIndex = addresses.map((data: any, index: number) => {
      if (index === selectedAddressIndex) {
        return (
          <div key={index} className="flex flex-col gap-1">
            <div className="flex gap-3 items-center">
              <Image src={'/assets/icons/location-green.svg'} width={15} height={25} alt="warning.svg" />
              <div className="font-bold text-lg">
                {data.labelAddress} - {data.nameAddress}
              </div>
            </div>
            <div className="font-semibold text-lg">{data.phoneNumberAddress}</div>
            <div className="font-semibold text-lg">
              {data.address} - {data.city}, {data.province}
            </div>
          </div>
        );
      }
    });
    return dataAddressWithIndex;
  };

  const handleBayar = () => {
    if (!selectedAddressIndex) {
      Swal.fire({
        title: 'Alamat pengiriman belum dipilih!',
        text: 'Silahkan pilih alamat terlebih dahulu sebelum melakukan pembayaran pesanan !',
        imageUrl: '/assets/icon/warning.svg',
        confirmButtonColor: '#6bc84d',
        width: '80%',
      });
    } else if (!selectPembayaran) {
      Swal.fire({
        title: 'Silahkan Pilih Metode Pembayaran ',
        imageUrl: '/assets/icon/warning.svg',
        confirmButtonColor: '#6bc84d',
        width: '80%',
      });
    } else {
      const data = {
        order_id: `#P-000${Math.floor(Math.random() * 100)}`,
        pesanan: selectedItems,
        bank: paymentMethod.data,
        kode_bayar: 100912345678910,
        total: getTotalSelectedItems().total,
        ppn: getTotalSelectedItems().ppn,
        ongkir: getTotalSelectedItems().biayaPengiriman,
        sub_total: getTotalSelectedItems().subtotal,
      };
      saveMyOrders(data);
      // console.log(data);
      // router.push('/checkout-success');
    }
  };

  const RincianPesanan = () => {
    return (
      <div className=" lg:my-10 lg:p-4 rounded-lg bg-white h-fit lg:w-1/3">
        <div className="font-bold text-xl px-3 lg:text-center">Pembayaran</div>
        <hr className="my-3" />
        {selectPembayaran && (
          <div className="flex gap-3 justify-center mb-3 items-center">
            <Image src={selectPembayaran.data.img} width={90} height={90} alt={`${selectPembayaran.index}.jpg`} />
            <div>{selectPembayaran.data.nama}</div>
          </div>
        )}
        <div className="px-4">
          <div
            onClick={() => setModalPembayaran(true)}
            className="text-center text-white  bg-secondary-main w-full py-2 mb-3 rounded-lg font-semibold cursor-pointer"
          >
            Pilih Metode Pembayaran
          </div>
        </div>

        <div className="font-bold text-xl px-3 lg:text-center">Rincian Pesanan</div>
        <hr className="my-3" />
        <div className="px-3 flex flex-col gap-2">
          <div className="flex justify-between">
            <div>Jumlah</div>
            <div>{selectedItems.length} Items</div>
          </div>
          <div className="flex justify-between">
            <div>Subtotal</div>
            <div>{formatMoney(getTotalSelectedItems().subtotal)}</div>
          </div>
          <div className="flex justify-between">
            <div>Biaya Pengiriman</div>
            <div>{formatMoney(getTotalSelectedItems().biayaPengiriman)}</div>
          </div>
          <div className="flex justify-between">
            <div>PPN (11%)</div>
            <div>{formatMoney(getTotalSelectedItems().ppn)}</div>
          </div>
        </div>
        <hr className="my-3 hidden lg:block" />
        <div className="hidden lg:block">
          <div className="flex justify-between font-bold px-3">
            <div>Total Pesanan</div>
            <div className="text-lg">{formatMoney(getTotalSelectedItems().total)}</div>
          </div>
          <div className="w-full flex justify-center mt-3">
            <div
              onClick={handleBayar}
              className="text-center text-white bg-primary-main w-1/2 py-3 mb-3 rounded-lg font-semibold cursor-pointer"
            >
              Bayar Sekarang
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="lg:bg-slate-50">
      <ModalAlamat />
      <ModalDaftarAlamat />
      <ModalPembayaran />
      <div className="flex gap-3 lg:mx-5 ">
        <div className="lg:my-10 flex flex-col w-full lg:w-2/3 gap-3">
          <section className="rounded-lg bg-white">
            <div className="px-3 font-bold py-3 text-xl">Alamat Pengiriman</div>
            <hr />
            <div className="p-3">
              {selectedAddressIndex === null ? (
                <div className="p-3 bg-[#FFD1D1] border-2 border-[#EB5757] rounded-xl flex gap-3 italic">
                  <Image src={'/assets/icons/warning.svg'} width={25} height={25} alt="warning.svg" />
                  <div>Silahkan masukkan alamat pengiriman Anda agar transaksi dapat dilanjutkan!</div>
                </div>
              ) : (
                <BuildAddress />
              )}

              <div className="flex justify-center mt-4">
                <div
                  onClick={() => setModalDaftarAlamatIsOpen(true)}
                  className="py-3 border-2 hover:bg-primary-surface hover:text-black border-primary-main flex gap-3 items-center font-bold text-primary-main cursor-pointer px-4 rounded-xl"
                >
                  <Image src={'/assets/icons/location-green.svg'} width={15} height={25} alt="warning.svg" />
                  <div className="text-center">Pilih Alamat</div>
                </div>
              </div>
            </div>
          </section>
          <section className="rounded-lg bg-white">
            <div className="px-3 font-bold py-3 text-xl mb-4">Nomor PO (Opsional)</div>
            <hr />
            <div className="p-3">
              <input
                type="number"
                className="border-2 border-primary-main p-3 w-full rounded-xl outline-primary-main"
                placeholder="Masukan Nomor PO"
              />
              <div className="mt-3 text-center">
                Kami akan menerbitkan invoice berdasarkan nomor PO yang telah anda ajukan
              </div>
            </div>
          </section>
          <section className="rounded-lg bg-white">
            <div className="px-3 py-3 text-xl flex items-center justify-between">
              <div className="font-bold">Review Pesanan</div>
              <Link href={'/cart'} className="no-underline">
                <div className="py-2 border-2 border-primary-main flex gap-3 hover:bg-primary-main hover:text-white items-center fon text-primary-main cursor-pointer px-3 rounded-xl">
                  <div>Ubah Pesanan</div>
                </div>
              </Link>
            </div>
            <hr />
            <div className="max-h-[500px] overflow-auto">
              {selectedItems.map((item: any, index: any) => {
                return (
                  <>
                    <div key={index} className="flex gap-3 px-3 pb-4">
                      <Image src={item.product_img} width={110} height={100} alt="" />
                      <div className="flex flex-col justify-between my-3 w-full ">
                        <div>
                          <div className="font-bold">{item.product_name}</div>
                          <div className="text-sm text-secondary-main">{formatMoney(item.product_harga)}/Kg</div>
                        </div>
                        <div className="flex justify-between">
                          <div>Jumlah: {item.product_qty}</div>
                          <div className="text-lg font-bold">{formatMoney(item.product_harga * item.product_qty)}</div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </section>

          {isMobile && <RincianPesanan />}

          <section className="lg:hidden shadow-bottom-shadow sticky bottom-0 bg-white">
            <div className="grid grid-cols-2 ">
              <div className="flex flex-col items-center rounded-tl-2xl border-r-0 border border-primary-main px-3 justify-center  text-lg font-bold ">
                <div className="text-base">Total Pesanan</div>
                <div className="text-2xl">{formatMoney(getTotalSelectedItems().total)}</div>
              </div>
              <div
                onClick={handleBayar}
                className="cursor-pointer flex gap-2 px-3 justify-center py-7 text-lg font-bold text-white bg-primary-main"
              >
                Bayar Sekarang
              </div>
            </div>
          </section>
        </div>

        {!isMobile && <RincianPesanan />}
      </div>
    </div>
  );
}
