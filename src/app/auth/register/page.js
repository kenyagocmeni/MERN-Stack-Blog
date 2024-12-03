"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState(""); // Nickname state eklendi
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, nickname }), // Nickname eklendi
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Kayıt işlemi başarısız.");
      }

      // Kayıt başarılıysa login sayfasına yönlendir
      router.push("/auth/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-[#6C8F6C] rounded-md h-auto p-6">
      <form onSubmit={handleRegister} className="space-y-4 w-80">
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
        <div>
          <label className="text-white block">Kullanıcı Adı (Nickname)</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            className="block rounded-md p-2 w-full"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-white my-4 rounded-md w-20 h-10">
          Üye Ol
        </button>
      </form>
      {/* Login sayfasına yönlendirme butonu */}
      <button
        onClick={() => router.push("/auth/login")}
        className="text-white underline mt-4"
      >
        Zaten hesabınız var mı? Giriş Yap
      </button>
    </div>
  );
};

export default RegisterPage;