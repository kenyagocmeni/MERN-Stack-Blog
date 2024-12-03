import React from "react";
import Link from "next/link";

export default function Card({ id, title = "Başlık Yok", category = "Kategori Yok", image }) {
  // Blog ID'si eksikse placeholder kart göster
  if (!id) {
    return (
      <div className="border border-red-300 rounded-lg p-4 bg-red-50 flex flex-col items-center">
        <p className="text-red-500 font-bold mb-2">
          Geçersiz Blog Verisi
        </p>
        <span className="text-red-400 text-sm">
          Blog ID eksik veya hatalı.
        </span>
      </div>
    );
  }

  return (
    <Link href={`/blog/${id}`} passHref>
      <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow-lg transition">
        {/* Görsel */}
        {image ? (
          <img
            src={image} // Görsel URL'si
            alt={title} // Alternatif metin
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-500">Görsel Yok</span>
          </div>
        )}

        {/* Başlık */}
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>

        {/* Kategori */}
        <p className="text-sm text-gray-600 mt-2">{category}</p>
      </div>
    </Link>
  );
}