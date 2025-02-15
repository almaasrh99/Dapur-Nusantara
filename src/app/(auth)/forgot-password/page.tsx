"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [password, setPassword] = useState("");
  const router = useRouter();

 

  const handleSubmit = (e:any) => {
    e.preventDefault();
  
    // Mengambil pengguna dari penyimpanan lokal
    const users = JSON.parse(localStorage.getItem("users") || "[]");
  
      // Temukan pengguna dengan email yang cocok
    const user = users.find((user: any) => user.email === email);
  
    if (user) {
      // Mengatur status kata sandi dengan kata sandi pengguna
      setPassword(user.password);
    } else {
      alert("Tidak ada akun yang terkait dengan email ini");
    }
  };

return (
    <form onSubmit={handleSubmit} className='w-1/2 flex flex-col justify-center items-center mx-auto'>
        <div className='p-10 '>
            <h1 className='text-4xl font-bold '>Halaman Pemulihan Password</h1>
        </div>
        <div className="w-full p-4 flex flex-col items-start justify-center">
            <label htmlFor="email" className="text-lg font-semibold mb-2">Email</label>
            <input id="email" className="form-input mb-4" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
            <button className="button-primary mb-4" type="submit">Submit</button>
        </div>
       

        {password && <p className="text-lg">Password Kamu adalah : {password}</p>}
    </form>
);
}