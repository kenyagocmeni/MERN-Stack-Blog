"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile, updateUserProfile } from "../../../../redux/features/userSlice";
import { useParams } from "next/navigation";

export default function EditProfilePage() {
  const dispatch = useDispatch();
  const { id: userId } = useParams();

  const { userInfo, loading, error } = useSelector((state) => state.user);

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userInfo) {
      setNickname(userInfo.nickname || "");
      setEmail(userInfo.email || "");
      setPreviewImage(
        userInfo.profileImage
          ? `${process.env.NEXT_PUBLIC_BASE_URL}${userInfo.profileImage}`
          : null
      );
    }
  }, [userInfo]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("nickname", nickname);
    formData.append("email", email);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    dispatch(
      updateUserProfile({
        userId,
        formData,
      })
    );
  };

  const handleDeleteProfileImage = () => {
    const formData = new FormData();
    formData.append("nickname", nickname);
    formData.append("email", email);
    formData.append("profileImage", null); // Profil resmini silmek için null gönder

    dispatch(
      updateUserProfile({
        userId,
        formData,
      })
    );

    setProfileImage(null);
    setPreviewImage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-bold">Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-bold text-red-500">Hata: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h1 className="text-xl font-bold mb-4">Profilini Düzenle</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Kullanıcı Adı
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Profil Resmi
          </label>
          {previewImage ? (
            <div className="mb-4">
              <img
                src={previewImage}
                alt="Profil Resmi Önizlemesi"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Henüz resim seçilmedi.</p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Kaydet
          </button>
          <button
            type="button"
            onClick={handleDeleteProfileImage}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Profil Resmini Sil
          </button>
        </div>
      </div>
    </div>
  );
}