"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../redux/features/userSlice"; // Thunk kullanımı

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.user); // Redux state erişimi
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // Redux Thunk ile login işlemi
    const result = await dispatch(
      loginUser({
        email,
        password,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      router.push("/"); // Giriş başarılıysa ana sayfaya yönlendir
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-[#6C8F6C] rounded-md h-96">
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-white block">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label className="text-white block">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="block rounded-md p-2 w-full"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-white my-4 rounded-md w-20 h-10"
            disabled={loading}
          >
            {loading ? "Yükleniyor..." : "Giriş Yap"}
          </button>
          <Link href="/auth/register">
            <button className="bg-white my-4 rounded-md w-20 h-10">
              Üye Ol
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;