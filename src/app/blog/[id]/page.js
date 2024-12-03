"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlogDetail,
  deleteBlogPost,
  addComment,
  deleteComment,
  toggleBlogPostLike,
  toggleCommentLike,
  editComment,
  replyToComment
} from "../../../redux/features/blogSlice";
import { useParams, useRouter } from "next/navigation";

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { blogDetail, loading, error } = useSelector((state) => state.blog);
  const { userInfo } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogDetail(id));
    }
  }, [dispatch, id]);

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      if (replyCommentId) {
        dispatch(replyToComment({ commentId: replyCommentId, content: comment })).then(() => {
          setComment("");
          setReplyCommentId(null);
          dispatch(fetchBlogDetail(id));
        });
      } else {
        dispatch(addComment({ postId: id, content: comment })).then(() => {
          setComment("");
          dispatch(fetchBlogDetail(id));
        });
      }
    }
  };

  const handleReplyClick = (parentId) => {
    setReplyCommentId(parentId);
  };

  const handleCommentDelete = (commentId) => {
    if (confirm("Bu yorumu silmek istediğinize emin misiniz?")) {
      dispatch(deleteComment({ postId: id, commentId })).then(() => {
        dispatch(fetchBlogDetail(id));
      });
    }
  };

  const handleBlogLikeToggle = () => {
    dispatch(toggleBlogPostLike(id)).then(() => {
      dispatch(fetchBlogDetail(id));
    });
  };

  const handleCommentLikeToggle = (commentId) => {
    dispatch(toggleCommentLike({ postId: id, commentId })).then(() => {
      dispatch(fetchBlogDetail(id));
    });
  };

  const handleEditClick = (comment) => {
    setEditCommentId(comment._id);
    setEditContent(comment.content);
  };

  const handleEditSubmit = () => {
    if (editContent.trim()) {
      dispatch(editComment({ postId: id, commentId: editCommentId, content: editContent })).then(() => {
        setEditCommentId(null);
        setEditContent("");
        dispatch(fetchBlogDetail(id));
      });
    }
  };

  const handleBlogEdit = () => {
    router.push(`/blog/${id}/edit`);
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;

  const renderComments = (comments, parentId = null) => {
    return comments
      .filter((comment) => comment.parentComment === parentId)
      .map((comment) => (
        <div key={comment._id} className="border-b border-gray-300 mb-4 pb-2">
          <p className="font-semibold">{comment.author?.nickname || "Bilinmeyen Kullanıcı"}</p>
          {editCommentId === comment._id ? (
            <div>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 mb-2"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleEditSubmit}
              >
                Kaydet
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md ml-4"
                onClick={() => setEditCommentId(null)}
              >
                İptal
              </button>
            </div>
          ) : (
            <>
              <p>{comment.content}</p>
              <div className="flex space-x-4 mt-2">
                <button
                  className="text-blue-500 text-sm"
                  onClick={() => handleCommentLikeToggle(comment._id)}
                >
                  {comment.likes?.includes(userInfo?._id) ? "Beğenmekten Vazgeç" : "Beğen"}
                </button>
                <span className="text-gray-500 text-sm">{comment.likes?.length || 0} Beğeni</span>
                {userInfo?._id === comment.author?._id && (
                  <>
                    <button
                      className="text-blue-500 text-sm"
                      onClick={() => handleEditClick(comment)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="text-red-500 text-sm"
                      onClick={() => handleCommentDelete(comment._id)}
                    >
                      Sil
                    </button>
                  </>
                )}
                {userInfo && (
                  <button
                    className="text-blue-500 text-sm"
                    onClick={() => handleReplyClick(comment._id)}
                  >
                    Yanıtla
                  </button>
                )}
              </div>
            </>
          )}
          <div className="ml-6">
            {renderComments(comments, comment._id)}
          </div>
        </div>
      ));
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-4">
        {blogDetail?.title || "Başlık Yok"}
      </h1>
      <p className="text-gray-600 mb-6">
        Kategori: {blogDetail?.category || "Kategori Yok"}
      </p>

      {blogDetail?.tags?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold">Etiketler:</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {blogDetail.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {blogDetail?.contentBlocks?.map((block, index) => (
        <div key={index} className="mb-4">
          {block.type === "text" && <p>{block.content}</p>}
          {block.type === "image" && (
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${block.content}`}
              alt={`Blog görseli ${index}`}
              className="rounded-md shadow-md"
            />
          )}
        </div>
      ))}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
        onClick={handleBlogLikeToggle}
      >
        {blogDetail?.likes?.includes(userInfo?._id) ? "Beğenmekten Vazgeç" : "Beğen"}
      </button>
      <span className="text-gray-500 text-sm">{blogDetail?.likes?.length || 0} Beğeni</span>

      {(userInfo?._id === blogDetail?.author || userInfo?.role === "admin") && (
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded-md ml-4"
          onClick={handleBlogEdit}
        >
          Güncelle
        </button>
      )}

      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Yorumlar</h2>
        {blogDetail?.comments?.length > 0 ? (
          renderComments(blogDetail.comments)
        ) : (
          <p>Henüz yorum yok.</p>
        )}
      </div>
      {userInfo && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">
            {replyCommentId ? "Yanıt Yaz" : "Yorum Yaz"}
          </h3>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={handleCommentSubmit}
          >
            Gönder
          </button>
          {replyCommentId && (
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md ml-4"
              onClick={() => setReplyCommentId(null)}
            >
              İptal
            </button>
          )}
        </div>
      )}
    </div>
  );
}