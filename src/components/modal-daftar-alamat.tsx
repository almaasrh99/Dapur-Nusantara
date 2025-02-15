import { useAppContext } from '@/context';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

export default function ModalDaftarAlamat() {
  const {
    modalDaftarAlamatIsOpen,
    setModalDaftarAlamatIsOpen,
    setModalAddressIsOpen,
    setEditingAddress,
    selectedAddressIndex,
    setSelectedAddressIndex,
    addresses,
    setAddresses,
  } = useAppContext();

  useEffect(() => {
    const savedAddresses = localStorage.getItem('addresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  const handleTambahAlamat = () => {
    setModalAddressIsOpen(true);
    setModalDaftarAlamatIsOpen(false);
  };

  //Ubah alamat pengguna
  const handleEditClick = (index: any) => {
    const storedAddresses = JSON.parse(localStorage.getItem('addresses') || '[]');

    const addressToEdit = storedAddresses[index];
    setEditingAddress({ index: index, address: addressToEdit });
    setModalDaftarAlamatIsOpen(false);
    setModalAddressIsOpen(true);
  };

  const handleSelectClick = (index: any) => {
    // Menyimpan indeks alamat yang dipilih ke penyimpanan lokal
    localStorage.setItem('selectedAddressIndex', index);

    // Perbarui status AlamatIndeks yang dipilih
    setSelectedAddressIndex(index);
  };

  return (
    <div>
      <Modal
        isOpen={modalDaftarAlamatIsOpen}
        onRequestClose={() => setModalDaftarAlamatIsOpen(false)}
        contentLabel="Daftar Alamat"
        className={`w-full px-8 flex items-center justify-center outline-none xs:pl-0 xs:pr-0 lg:pl-20 lg:pr-20 ${
          modalDaftarAlamatIsOpen ? 'animate-slide-in' : 'animate-slide-out'
        }`}
        overlayClassName="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-end lg:items-center justify-center xs:bottom-0"
      >
        <div className="bg-white rounded-lg w-full lg:w-full pb-6">
          <div className="w-full flex justify-between items-center bg-white shadow-md p-2 rounded-tr-lg rounded-tl-lg">
            <h2 className="text-2xl font-bold p-2 xs:text-xl lg:text-2xl">Daftar Alamat</h2>
            <button onClick={() => setModalDaftarAlamatIsOpen(false)} className=" text-white rounded px-2 py-1">
              <img src="./assets/icon/close-btn.svg" className="h-8 w-8 xs:w-4 xs:h-4 lg:h-6 lg:w-6" />
            </button>
          </div>
          <div className="w-full flex justify-center">
            <div
              onClick={handleTambahAlamat}
              className="flex gap-3 text-primary-main font-semibold cursor-pointer hover:bg-primary-main hover:text-white border-2 border-primary-main px-5 py-2 my-4 rounded-xl"
            >
              <div className="text-xl mb-1">
                <span className="text-2xl">+</span> Tambah Alamat
              </div>
            </div>
          </div>
          <div className="max-h-[450px] lg:max-h-96 overflow-auto">
            {addresses
              .slice()
              .reverse()
              .map((address: any, index: number) => {
                const originalIndex = addresses.length - 1 - index;
                return (
                  <div
                    key={index}
                    className={`lg:mx-5 mx-2 p-3 border-2 mb-3 rounded-xl border-primary-main ${
                      selectedAddressIndex === originalIndex && 'bg-primary-surface'
                    }`}
                  >
                    <div className="flex justify-between lg:gap-4 lg:justify-normal">
                      <div className="bg-[#E0E0E0] px-4 py-2 rounded-lg font-bold text-[#414040]">
                        {address['labelAddress']}
                      </div>
                      <div className="flex gap-2 items-center cursor-pointer">
                        <img
                          className="xs:w-5 xs:h-5 md:w-8 md:h-8 lg:w-8 lg:h-8 "
                          src="./assets/icon/material-edit.svg"
                        />
                        <div onClick={() => handleEditClick(originalIndex)} className="text-secondary-main">
                          Ubah Alamat
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row justify-between items-center">
                      <div className="flex flex-col items-start w-full gap-2 mt-3">
                        <div className="font-bold">{address['nameAddress']}</div>
                        <div className="">{address['phoneNumberAddress']}</div>
                        <div className="">{address['address']}</div>
                        <div className="">
                          {address['province']} - {address['city']}
                        </div>
                      </div>
                      <div
                        onClick={() => handleSelectClick(originalIndex)}
                        className={`bg-primary-main py-3 px-5 h-1/2 mt-4 w-[40%] text-center rounded-xl cursor-pointer lg:w-1/4 lg:mt-0 ${
                          selectedAddressIndex === originalIndex
                            ? ' text-primary-main bg-white flex gap-3 border-2 border-primary-main justify-center'
                            : 'text-white'
                        }`}
                      >
                        {selectedAddressIndex === originalIndex ? (
                          <>
                            <img src="./assets/icon/check.svg" />
                            Terpilih
                          </>
                        ) : (
                          'Pilih'
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Modal>
    </div>
  );
}
