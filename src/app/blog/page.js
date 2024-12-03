"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogList } from "../../redux/features/blogSlice"; // Doğru thunk import edildi
import Link from "next/link";

export default function BlogPage() {
  const dispatch = useDispatch();
  const { blogList, loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchBlogList());
  }, [dispatch]);

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  if (error) {
    return <p>Bir hata oluştu: {error}</p>;
  }

  if (!Array.isArray(blogList)) {
    console.error("blogList bir dizi değil:", blogList);
    return <p>Blog listesi yüklenemedi.</p>;
  }

  return (
    <div>
      <h1>Bloglar</h1>
      <ul>
        {blogList.map((blog) => (
          <li key={blog._id}>
            <Link href={`/blog/${blog._id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
