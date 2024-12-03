"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  addBlogPost,
  clearSuccessMessage,
} from "../../../redux/features/blogSlice";

export default function AddBlogPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, successMessage } = useSelector((state) => state.blog);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: "",
    contentBlocks: [], // Dinamik içerik blokları
  });

  const categories = [
    "Kültür",
    "Sanat",
    "Edebiyat",
    "Spor",
    "Film ve Dizi",
    "Gündem",
    "Teknoloji",
    "Girişimcilik",
    "Finans",
    "Kariyer",
    "Gezi ve Seyahat",
    "Sağlık",
    "Moda ve Stil",
    "Kişisel Gelişim",
    "Müzik",
    "Oyun",
    "Yemek",
    "El Sanatları",
    "Çevre ve Doğa",
    "Sosyal Sorumluluk",
    "Tarih",
    "Eğitim",
    "Bilim",
    "Teknik Bilgiler",
    "Mizah",
    "Günlük Yaşam",
  ];

  const addContentBlock = (type) => {
    setFormData((prev) => ({
      ...prev,
      contentBlocks: [
        ...prev.contentBlocks,
        { type, content: "", preview: "" }, // Görseller için "preview" ekleniyor
      ],
    }));
  };

  const handleContentChange = (index, content) => {
    const updatedBlocks = [...formData.contentBlocks];
    updatedBlocks[index].content = content;
    setFormData((prev) => ({ ...prev, contentBlocks: updatedBlocks }));
  };

  const handleImageChange = (index, file) => {
    const updatedBlocks = [...formData.contentBlocks];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updatedBlocks[index].content = file; // Dosya nesnesi
        updatedBlocks[index].preview = reader.result; // Görsel önizleme
        setFormData((prev) => ({ ...prev, contentBlocks: updatedBlocks }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeContentBlock = (index) => {
    const updatedBlocks = formData.contentBlocks.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, contentBlocks: updatedBlocks }));
  };

  const moveContentBlock = (index, direction) => {
    const updatedBlocks = [...formData.contentBlocks];
    const [removed] = updatedBlocks.splice(index, 1);
    updatedBlocks.splice(index + direction, 0, removed);
    setFormData((prev) => ({ ...prev, contentBlocks: updatedBlocks }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("tags", formData.tags);
  
    // Metin ve görsel bloklarını hazırlayıp JSON olarak ekle
    const serializedBlocks = formData.contentBlocks.map((block) => {
      if (block.type === "image" && block.content instanceof File) {
        return {
          type: block.type,
          content: block.content.name, // Görselin adı
        };
      }
      return block; // Metin blokları olduğu gibi gönderilir
    });
  
    formDataToSend.append("contentBlocks", JSON.stringify(serializedBlocks));
  
    // Görselleri ayrı bir "images" alanında gönder
    formData.contentBlocks.forEach((block) => {
      if (block.type === "image" && block.content instanceof File) {
        formDataToSend.append("images", block.content); // Görseller "images" olarak eklenir
      }
    });
  
    // Redux action'ını tetikle
    dispatch(addBlogPost(formDataToSend));
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Blog Ekle</h1>
      {successMessage && (
        <div className="p-2 bg-green-500 text-white rounded-md mb-4">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="p-2 bg-red-500 text-white rounded-md mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Başlık */}
        <input
          type="text"
          placeholder="Başlık"
          className="w-full border p-2 rounded-md"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
        />

        {/* Kategori */}
        <select
          className="w-full border p-2 rounded-md"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
        >
          <option value="">Kategori Seçin</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Etiketler */}
        <input
          type="text"
          placeholder="Etiketler (virgülle ayırın)"
          className="w-full border p-2 rounded-md"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />

        {/* İçerik Blokları */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">İçerik Blokları</h2>
          {formData.contentBlocks.map((block, index) => (
            <div
              key={index}
              className="p-4 border rounded-md flex flex-col space-y-2"
            >
              {block.type === "text" && (
                <textarea
                  placeholder="Metin Bloğu"
                  className="w-full border p-2 rounded-md"
                  value={block.content}
                  onChange={(e) =>
                    handleContentChange(index, e.target.value)
                  }
                ></textarea>
              )}
              {block.type === "image" && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(index, e.target.files[0])
                    }
                    className="w-full border p-2 rounded-md"
                  />
                  {block.preview && (
                    <img
                      src={block.preview}
                      alt="Görsel önizleme"
                      className="mt-2 w-32 h-32 object-cover rounded-md"
                    />
                  )}
                </div>
              )}
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="bg-red-500 text-white px-3 py-1 rounded-md"
                  onClick={() => removeContentBlock(index)}
                >
                  Sil
                </button>
                {index > 0 && (
                  <button
                    type="button"
                    className="bg-gray-300 text-black px-3 py-1 rounded-md"
                    onClick={() => moveContentBlock(index, -1)}
                  >
                    Yukarı Taşı
                  </button>
                )}
                {index < formData.contentBlocks.length - 1 && (
                  <button
                    type="button"
                    className="bg-gray-300 text-black px-3 py-1 rounded-md"
                    onClick={() => moveContentBlock(index, 1)}
                  >
                    Aşağı Taşı
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Blok Ekle Butonları */}
        <div className="flex space-x-4">
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => addContentBlock("text")}
          >
            Metin Bloğu Ekle
          </button>
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={() => addContentBlock("image")}
          >
            Görsel Bloğu Ekle
          </button>
        </div>

        {/* Gönder Butonu */}
        <button
          type="submit"
          className="w-full bg-[#506F64] text-white px-4 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Gönderiliyor..." : "Gönder"}
        </button>
      </form>
    </div>
  );
}