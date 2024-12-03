"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile, fetchUserBlogPosts } from "../../../redux/features/userSlice";
import Card from "../../../components/Card";
import { useParams, useRouter } from "next/navigation";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id: userId } = useParams();

  const { userInfo, userBlogPosts, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId)); // Kullanıcı bilgilerini getir
      dispatch(fetchUserBlogPosts(userId)); // Kullanıcının blog yazılarını getir
    }
  }, [dispatch, userId]);

  // Profil resmi URL'sini konsolda kontrol et
  useEffect(() => {
    if (userInfo?.profileImage) {
      const profileImageURL = `${process.env.NEXT_PUBLIC_BASE_URL}${userInfo.profileImage}`;
      console.log("Tam Profil Resmi URL'si:", profileImageURL);
    }
  }, [userInfo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-bold">Profil yükleniyor...</p>
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

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-bold text-red-500">Kullanıcı profili bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full h-screen">
      {/* Profil Bilgileri */}
      <div className="bg-[#6C8F6C] h-full w-1/2 rounded-l-md border-r-2 p-4">
        <div className="w-full h-96 bg-slate-500 rounded-md mb-4 relative">
          {userInfo.profileImage ? (
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${userInfo.profileImage}`} // Tam URL oluşturma
              alt="Profil Resmi"
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              Profil Resmi Yok
            </div>
          )}
        </div>
        <div>
          <p className="my-2 text-white">
            <strong>Kullanıcı Adı:</strong> {userInfo?.nickname || "Bilinmiyor"}
          </p>
          <p className="my-2 text-white">
            <strong>E-posta:</strong> {userInfo?.email || "Bilinmiyor"}
          </p>
          <p className="my-2 text-white">
            <strong>Üyelik Tarihi:</strong>{" "}
            {userInfo?.createdAt
              ? new Date(userInfo.createdAt).toLocaleDateString()
              : "Bilinmiyor"}
          </p>
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="bg-white text-black px-4 py-2 rounded-md"
            onClick={() => router.push(`/profile/${userId}/edit`)}
          >
            Bilgilerimi Güncelle
          </button>
        </div>
      </div>

      {/* Blog Yazıları */}
      <div className="bg-[#6C8F6C] h-full w-1/2 rounded-r-md p-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">Blog Yazıları</h2>
        {userBlogPosts && userBlogPosts.length > 0 ? (
          userBlogPosts.map((post) => {
            const firstImageBlock = post.contentBlocks?.find(
              (block) => block.type === "image"
            );

            return (
              <Card
                key={post._id}
                id={post._id}
                title={post.title}
                category={post.category}
                image={
                  firstImageBlock
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}${firstImageBlock.content}`
                    : null
                }
              />
            );
          })
        ) : (
          <p className="text-white">Bu kullanıcının henüz blog yazısı yok.</p>
        )}
      </div>
    </div>
  );
}