import { useAppContext } from '@/context';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2';

export default function ModalAlamat() {
  const { modalAddressIsOpen, setModalAddressIsOpen, editingAddress, setEditingAddress } = useAppContext();
  const [phoneNumberAddress, setPhoneNumberAddress] = useState('');
  const [nameAddress, setNameAddress] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalZip, setPostalZip] = useState('');
  const [labelAddress, setLabelAddress] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const savedAddresses = localStorage.getItem('addresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  useEffect(() => {
    if (editingAddress.address) {
      setNameAddress(editingAddress.address.nameAddress || '');
      setPhoneNumberAddress(editingAddress.address.phoneNumberAddress || '');
      setAddress(editingAddress.address.address || '');
      setCompanyName(editingAddress.address.companyName || '');
      setProvince(editingAddress.address.province || '');
      setBusinessType(editingAddress.address.businessType || '');
      setLabelAddress(editingAddress.address.labelAddress || '');
      setPostalZip(editingAddress.address.postalZip || '');
      setCity(editingAddress.address.city || '');
    }
  }, [editingAddress]);

  //Tambah atau ubah alamat pengguna
  const handleSubmit = (e: any) => {
    e.preventDefault();

    const newAddress = {
      nameAddress,
      phoneNumberAddress,
      address,
      companyName,
      province,
      businessType,
      labelAddress,
      postalZip,
      city,
    };

    let newAddresses;
    if (editingAddress.index !== null) {
      // Perbarui alamat yang ada
      newAddresses = addresses.map((address, i) => (i === editingAddress.index ? newAddress : address));
      //Mereset editingAdress.index
      setEditingAddress({ index: null, address: {} });
    } else {
      //Tambah alamat baru
      newAddresses = [...addresses, newAddress];
    }

    // Perbarui status dan penyimpanan lokal
    setAddresses(newAddresses);
    localStorage.setItem('addresses', JSON.stringify(newAddresses));

    setNameAddress('');
    setPhoneNumberAddress('');
    setAddress('');
    setPostalZip('');
    setProvince('');
    setCity('');
    setLabelAddress('');
    setBusinessType('');
    setCompanyName('');
    setEditingAddress({ index: null, address: {} });

    closeModal();

    Swal.fire({
      title: 'Alamat berhasil diperbarui!',
      icon: 'success',
      confirmButtonColor: '#6BC84D',
    });
  };

  const closeModal = () => {
    setModalAddressIsOpen(false);
    setNameAddress('');
    setPhoneNumberAddress('');
    setAddress('');
    setPostalZip('');
    setProvince('');
    setCity('');
    setLabelAddress('');
    setBusinessType('');
    setCompanyName('');

    window.location.reload();
  };

  return (
    <Modal
      isOpen={modalAddressIsOpen}
      onRequestClose={closeModal}
      contentLabel="Tambah Alamat"
      className={`w-full flex items-center justify-center outline-none xs:p-0 lg:p-10 xl:p-24  ${
        modalAddressIsOpen ? 'animate-slide-in' : 'animate-slide-out'
      }`}
      overlayClassName="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center xs:justify-end xs:items-end lg:items-center lg:justify-center"
    >
      <div className="bg-white rounded-lg w-full sm:w-3/4 md:w-full lg:w-full">
        <div className="gap-4">
          <div className="w-full flex justify-between items-center bg-white shadow-md p-2 rounded-tr-lg rounded-tl-lg">
            <h2 className="text-2xl font-bold p-2 xs:text-xl lg:text-2xl">
              {editingAddress.index !== null ? 'Ubah Alamat' : 'Tambah Alamat'}
            </h2>
            <button onClick={closeModal} className=" text-white rounded px-2 py-1">
              <img src="./assets/icon/close-btn.svg" className="h-8 w-8 xs:w-4 xs:h-4 lg:h-6 lg:w-6" />
            </button>
          </div>
          <div className="w-full flex flex-col justify-stretch items-center gap-6 xs:gap-4 xs:pl-0 xs:pr-0 xs:pt-4 xs:pb-0 ">
            <form
              onSubmit={handleSubmit}
              className="w-full"
            >
              <div className='w-full overflow-auto xs:gap-2 xs:p-2 xs:mb-4 xs:h-[600px] min-[400px]:p-4 md:mt-0 md:p-4 md:gap-3 lg:h-[26rem] xl:h-[20rem] xl:mt-0 xl:gap-4 xl:p-6 2xl:h-[30rem]'>
              <div className="lg:pl-8 lg:pr-8 grid grid-cols-1 gap-6 xs:gap-2 xs:pl-4 xs:pr-4 md:grid-cols-1 md:gap-4 lg:grid-cols-2 lg:gap-6">
                <div className="w-full flex flex-col gap-2 ">
                  <label className="label-form ">Nama Penerima</label>
                  <input
                    className="form-input"
                    id="name"
                    type="text"
                    value={nameAddress}
                    onChange={(e) => setNameAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                  <label className="label-form">Telepon</label>
                  <input
                    className="form-input"
                    id="phone"
                    type="tel"
                    value={phoneNumberAddress}
                    onChange={(e) => setPhoneNumberAddress(e.target.value)}
                    placeholder="081-234-567-789"
                    required
                    onInput={(e) => {
                      const phoneNumber = (e.target as HTMLInputElement).value;
                      const phoneNumberRegex = /^08\d{8,11}$/;
                      const errorMessage = document.getElementById('phone-error');

                      if (!phoneNumberRegex.test(phoneNumber)) {
                        if (errorMessage) errorMessage.style.display = 'block';
                      } else {
                        if (errorMessage) errorMessage.style.display = 'none';
                      }
                    }}
                  />
                  <p id="phone-error" className="font-helvetica text-sm text-red-500" style={{ display: 'none' }}>
                    Format nomor telepon tidak valid. Nomor telepon Indonesia harus dimulai dengan angka 08 dan terdiri
                    dari 10-13 digit.
                  </p>
                </div>
                <div className="w-full flex flex-col gap-2 ">
                  <label className="label-form ">Provinsi</label>
                  <select
                    className="form-input"
                    id="provinsi"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    required
                  >
                    <option value="">--Pilih Provinsi--</option>
                    <option value="Aceh">Aceh</option>
                    <option value="Sumatera Utara">Sumatera Utara</option>
                    <option value="Sumatera Barat">Sumatera Barat</option>
                    <option value="Riau">Riau</option>
                    <option value="Jambi">Jambi</option>
                    <option value="Sumatera Selatan">Sumatera Selatan</option>
                    <option value="Bengkulu">Bengkulu</option>
                    <option value="Lampung">Lampung</option>
                    <option value="Bangka Belitung">Bangka Belitung</option>
                    <option value="Banten">Banten</option>
                    <option value="Jakarta">Jakarta</option>
                    <option value="Jawa Barat">Jawa Barat</option>
                    <option value="Jawa Tengah">Jawa Tengah</option>
                    <option value="Jawa Timur">Jawa Timur</option>
                    <option value="Yogyakarta">Yogyakarta</option>
                    <option value="Bali">Bali</option>
                    <option value="Nusa Tenggara Barat">Nusa Tenggara Barat</option>
                  </select>
                </div>
                <div className="w-full flex flex-col gap-2 ">
                  <label className="label-form ">Kota/Kabupaten</label>
                  <select
                    className="form-input"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  >
                    <option value="">--Pilih Kota/Kabupaten--</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="Sleman">Sleman</option>
                    <option value="Malang">Malang</option>
                    <option value="Jakarta">Jakarta</option>
                  </select>
                </div>
                <div className="w-full flex flex-col gap-2 ">
                  <label className="label-form ">Detail Alamat (Gedung, Kawasan, Nama Jalan dan Blok)</label>
                  <textarea
                    className="form-input h-48 2xl:h-[13.5rem]"
                    id="alamat"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="w-full flex flex-col gap-4 justify-start">
                  <label className="label-form ">Label Alamat</label>
                  <input
                    className="form-input"
                    id="label-address"
                    type="text"
                    value={labelAddress}
                    onChange={(e) => setLabelAddress(e.target.value)}
                    required
                  />

                  <label className="label-form ">Kode Pos</label>
                  <input
                    className="form-input"
                    id="postal_code"
                    type="number"
                    value={postalZip}
                    onChange={(e) => setPostalZip(e.target.value)}
                    required
                  />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                  <label className="label-form ">Badan Usaha</label>
                  <select
                    className="form-input"
                    id="business_type"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    required
                  >
                    <option value="">--Pilih Badan Usaha--</option>
                    <option value="PT">PT (Perseroan Terbatas)</option>
                    <option value="CV">CV</option>
                    <option value="Frima">Firma</option>
                    <option value="Koperasi">Koperasi</option>
                    <option value="Yayasan">Yayasan</option>
                    <option value="UD">UD (Usaha Dagang)</option>
                  </select>
                </div>
                <div className="w-full flex flex-col gap-2 ">
                  <label className="label-form ">Nama Perusahaan</label>
                  <input
                    className="form-input"
                    id="company_name"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
              </div>
              </div>
              
              <div className="w-full shadow-bottom-shadow flex items-center justify-center rounded-tr-lg rounded-tl-lg">
                <div className="w-full flex justify-center bg-white items-center xs:p-0 lg:p-4 lg:bg-transparent lg:rounded-br-lg lg:rounded-bl-lg">
                  <button
                    type="submit"
                    className="button-primary xs:h-20 xs:rounded-none xs:rounded-tl-xl xs:rounded-tr-xl lg:w-1/2 lg:h-16 lg:rounded-2xl xs:shadow-bottom-shadow lg:shadow-none "
                  >
                    Simpan Alamat
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}
