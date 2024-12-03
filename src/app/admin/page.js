"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link"; // Link bileşenini ekledik

export default function AdminPage() {
  const { userInfo } = useSelector((state) => state.user);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [userResult, setUserResult] = useState(null);

  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [blogResults, setBlogResults] = useState([]);

  useEffect(() => {
    if (!userInfo || userInfo.role !== "admin") {
      router.push("/");
    }
  }, [userInfo, router]);

  if (!userInfo || !userInfo.role) {
    return null;
  }

  const handleUserSearch = async () => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        alert("Lütfen giriş yapın.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/users?username=${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Kullanıcı bulunamadı.");
      }
      setUserResult(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleBlogSearch = async () => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        alert("Lütfen giriş yapın.");
        return;
      }

      const query = new URLSearchParams({
        author,
        category,
        title,
      }).toString();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/blogposts?${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Blog gönderileri bulunamadı.");
      }
      setBlogResults(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Admin Paneli</h1>

      {/* Kullanıcı Bul */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Kullanıcı Bul</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Kullanıcı Adı"
            className="border border-gray-300 rounded-md p-2 mr-2"
          />
          <button
            onClick={handleUserSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Ara
          </button>
        </div>
        {userResult && (
          <div className="mt-4">
            <h3 className="font-bold">Kullanıcı Bilgileri:</h3>
            <p>ID: {userResult._id}</p>
            <p>
              Nickname:{" "}
              <Link href={`/profile/${userResult._id}`} className="text-blue-500 underline">
                {userResult.nickname}
              </Link>
            </p>
            <p>Email: {userResult.email}</p>
            <p>Role: {userResult.role}</p>
            {/* Diğer gerekli bilgiler */}
          </div>
        )}
      </div>

      {/* Blogpost Bul */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Blogpost Bul</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Yazar */}
          <div>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Yazar Nickname"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          {/* Kategori */}
          <div>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Kategori"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          {/* Başlık */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Başlık"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
        </div>
        <button
          onClick={handleBlogSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Ara
        </button>

        {blogResults.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold">Bulunan Blog Gönderileri:</h3>
            {blogResults.map((blog) => (
              <div key={blog._id} className="border p-2 mb-2">
                <p>
                  ID:{" "}
                  <Link href={`/blog/${blog._id}`} className="text-blue-500 underline">
                    {blog._id}
                  </Link>
                </p>
                <p>
                  Başlık:{" "}
                  <Link href={`/blog/${blog._id}`} className="text-blue-500 underline">
                    {blog.title}
                  </Link>
                </p>
                <p>Kategori: {blog.category}</p>
                <p>
                  Yazar:{" "}
                  <Link href={`/profile/${blog.author._id}`} className="text-blue-500 underline">
                    {blog.author.nickname}
                  </Link>
                </p>
                {/* Diğer gerekli bilgiler */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}