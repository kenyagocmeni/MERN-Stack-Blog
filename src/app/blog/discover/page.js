"use client";

import React, { useState } from "react";
import Card from "../../../components/Card";

export default function DiscoverPage() {
  const [nickname, setNickname] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    try {
      const query = new URLSearchParams({
        nickname,
        category,
        tags,
      }).toString();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogposts/discover?${query}`
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Filtreleme başarısız.");
      }

      // Gelen sonuçları güncelle
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Discover Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Nickname */}
        <div>
          <label className="block font-semibold mb-2">Nickname</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Kullanıcı adı"
          />
        </div>
        {/* Category */}
        <div>
          <label className="block font-semibold mb-2">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Kategori"
          />
        </div>
        {/* Tags */}
        <div>
          <label className="block font-semibold mb-2">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Etiketler (virgülle ayrılmış)"
          />
        </div>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={handleSearch}
      >
        Ara
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.map((blog) => {
          // İlk görseli al
          const firstImageBlock = blog.contentBlocks?.find(
            (block) => block.type === "image"
          );

          return (
            <Card
              key={blog._id}
              id={blog._id}
              title={blog.title}
              category={blog.category}
              image={
                firstImageBlock
                  ? `${process.env.NEXT_PUBLIC_BASE_URL}${firstImageBlock.content}` // Tam URL oluşturuluyor
                  : null
              }
            />
          );
        })}
      </div>
    </div>
  );
}