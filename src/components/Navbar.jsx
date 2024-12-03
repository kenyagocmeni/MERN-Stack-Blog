"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout, loadUser } from "../redux/features/userSlice";
import { useEffect } from "react";

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Kullanıcı bilgilerini yükle
    dispatch(loadUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <nav className="flex justify-between bg-gradient-to-r from-[#699C64] to-[#243623] p-4 text-white">
      <Link href="/">BLOGSÖZLÜK.com</Link>
      <div className="flex space-x-4">
        {/* Blog Ekle */}
        {userInfo && (
          <button
            onClick={() => router.push("/blog/add")}
            className="hover:underline"
          >
            Blog Ekle
          </button>
        )}

        {/* Keşfet */}
        <Link href="/blog/discover" className="hover:underline">
          Keşfet
        </Link>

        {/* Admin Butonu */}
        {userInfo && userInfo.role === "admin" && (
          <button
            onClick={() => router.push("/admin")}
            className="hover:underline"
          >
            Admin
          </button>
        )}

        {/* Profil */}
        {userInfo && (
          <button
            onClick={() => router.push(`/profile/${userInfo._id}`)}
            className="hover:underline"
          >
            Profil
          </button>
        )}

        {/* Çıkış Yap veya Giriş Yap */}
        {userInfo ? (
          <button onClick={handleLogout} className="hover:underline">
            Çıkış Yap
          </button>
        ) : (
          <Link href="/auth/login" className="hover:underline">
            Giriş Yap
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;