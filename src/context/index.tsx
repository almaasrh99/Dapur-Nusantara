'use client';
import { getCarts, getOrders, saveCarts, saveOrders } from '@/lib/helpers';
import { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext<any>(undefined);

interface CartItems {}

export function AppWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [myCarts, setMyCarts] = useState<any>([]);
  const [myOrders, setMyOrders] = useState<any>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [modalAddressIsOpen, setModalAddressIsOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState({
    index: null,
    address: null,
  });
  const [selectPembayaran, setSelectPembayaran] = useState();

  const [modalDaftarAlamatIsOpen, setModalDaftarAlamatIsOpen] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const carts = getCarts();
    const orders = getOrders();
    setMyCarts(!carts ? [] : carts);
    setMyOrders(!orders ? [] : orders);

    // Menjalankan handleResize pada saat komponen dimuat dan ketika ukuran jendela berubah
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fungsi untuk memeriksa ukuran layar
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };
  const saveMyCarts = (data: any) => {
    let newCartItems;
    const isItemExist = myCarts && myCarts.find((item: any) => item.product_id === data.product_id);
    if (isItemExist) {
      newCartItems = myCarts.map((item: any) => (item.product_id === data.product_id ? data : item));
    } else {
      newCartItems = [...myCarts, data];
    }
    saveCarts(newCartItems);
    setMyCarts(newCartItems);
  };

  const saveMyOrders = (data: any) => {
    let newOrdersItem;
    newOrdersItem = [...myOrders, data];
    saveOrders(newOrdersItem);
    setMyOrders(newOrdersItem);
  };

  const deletAllCart = () => {
    setSelectedItems([]);
    setMyCarts([]);
    saveCarts([]);
  };

  const deleteItemCart = (id: any) => {
    setSelectedItems(selectedItems.filter((i: any) => i.product_id !== id));
    const deleteLocalStorage = getCarts().filter((item: any) => item.product_id != id);
    const deleteGlobalState = myCarts.filter((item: any) => item.product_id != id);
    setMyCarts(deleteGlobalState);
    saveCarts(deleteLocalStorage);
  };


  //Callback items cart dari halaman save carts
  const addToCart = (items:any) => {

    saveCarts(items);
    setMyCarts(items);
  };

  //Fungsi menghapus semua produk dalam cart
  const clearCart = () => {
    setMyCarts([]);
    saveCarts([]);
  };

  return (
    <AppContext.Provider
      value={{
        saveMyCarts,
        myCarts,
        deleteItemCart,
        isMobile,
        selectedItems,
        setSelectedItems,
        deletAllCart,
        addToCart,
        modalAddressIsOpen,
        setModalAddressIsOpen,
        editingAddress,
        setEditingAddress,
        modalDaftarAlamatIsOpen,
        setModalDaftarAlamatIsOpen,
        selectPembayaran,
        setSelectPembayaran,
        selectedAddressIndex,
        setSelectedAddressIndex,
        addresses,
        setAddresses,
        saveMyOrders,
        myOrders,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
