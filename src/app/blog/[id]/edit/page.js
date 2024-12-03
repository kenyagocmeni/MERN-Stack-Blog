"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  fetchBlogDetail,
  updateBlogPost,
  clearSuccessMessage,
} from "../../../../redux/features/blogSlice";

export default function EditBlogPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const { blogDetail, loading, error, successMessage } = useSelector(
    (state) => state.blog
  );

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: "",
    contentBlocks: [],
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

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogDetail(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (blogDetail) {
      setFormData({
        title: blogDetail.title,
        category: blogDetail.category,
        tags: blogDetail.tags.join(", "),
        contentBlocks: blogDetail.contentBlocks.map((block) =>
          block.type === "image"
            ? { ...block, preview: block.content } // Görsel önizleme
            : block
        ),
      });
    }
  }, [blogDetail]);

  const addContentBlock = (type) => {
    setFormData((prev) => ({
      ...prev,
      contentBlocks: [
        ...prev.contentBlocks,
        { type, content: "", preview: "" },
      ],
    }));
  };

  const handleContentChange = (index, content) => {
    console.log(`Index: ${index}, Content: ${content}`); // Değişiklikleri izle
    setFormData((prev) => {
      // ContentBlocks'un bir kopyasını oluştur
      const updatedBlocks = [...prev.contentBlocks];
      // İlgili bloğun kopyasını değiştir
      updatedBlocks[index] = { ...updatedBlocks[index], content };
      // Yeni state'i ayarla
      return { ...prev, contentBlocks: updatedBlocks };
    });
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
    } else {
      // Eğer dosya seçilmediyse mevcut URL'yi koru
      updatedBlocks[index].content =
        typeof updatedBlocks[index].content === "string"
          ? updatedBlocks[index].content
          : "";
      setFormData((prev) => ({ ...prev, contentBlocks: updatedBlocks }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("tags", formData.tags);
  
    const serializedBlocks = formData.contentBlocks.map((block) => {
        if (block.type === "image") {
          if (block.content instanceof File) {
            return {
              type: "image",
              content: block.content.name, // Yeni görsel dosyasının adı
            };
          } else if (typeof block.content === "string") {
            return {
              type: "image",
              content: block.content, // Mevcut görsel URL'si
            };
          } else {
            throw new Error("Görsel bloğu eksik içerik içeriyor."); // Hata yakalama
          }
        }
        return block; // Diğer blokları aynen döndür
      });
  
    formDataToSend.append("contentBlocks", JSON.stringify(serializedBlocks));
  
    // Görselleri ayrı bir "images" alanında gönder
    formData.contentBlocks.forEach((block) => {
      if (block.type === "image" && block.content instanceof File) {
        formDataToSend.append("images", block.content);
      }
    });
  
    // Redux action'ını tetikle
    dispatch(updateBlogPost({ id, updatedData: formDataToSend }));
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
        router.push(`/blog/${id}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch, id, router]);

  const handleCancel = () => {
    router.push(`/blog/${id}`);
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Blog Güncelle</h1>
      {successMessage && (
        <div className="p-2 bg-green-500 text-white rounded-md mb-4">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="p-2 bg-red-500 text-white rounded-md mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Başlık"
          className="w-full border p-2 rounded-md"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
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
        <input
          type="text"
          placeholder="Etiketler (virgülle ayırın)"
          className="w-full border p-2 rounded-md"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">İçerik Blokları</h2>
          {formData.contentBlocks.map((block, index) => (
            <div key={index} className="p-4 border rounded-md flex flex-col">
              {block.type === "text" && (
                <textarea
                  placeholder="Metin Bloğu"
                  className="w-full border p-2 rounded-md"
                  value={block.content} // Blok içeriğini göstermek için
                  onChange={(e) => handleContentChange(index, e.target.value)} // İçeriği değiştirmek için
                  disabled={block.type !== "text"} // Sadece metin blokları için düzenlenebilir
                ></textarea>
              )}
{block.type === "image" && (
  <div>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleImageChange(index, e.target.files[0])}
      className="w-full border p-2 rounded-md"
    />
    {block.preview ? (
      <img
        src={block.preview}
        alt="Görsel önizleme"
        className="mt-2 w-32 h-32 object-cover rounded-md"
      />
    ) : (
      <img
        src={
          typeof block.content === "string" ? block.content : "/placeholder.jpg"
        }
        alt="Mevcut Görsel"
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
        <div className="flex space-x-4">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={handleCancel}
          >
            Vazgeç
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}
