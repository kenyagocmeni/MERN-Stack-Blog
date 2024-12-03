"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogList } from "../redux/features/blogSlice";
import Card from "../components/Card";

export default function HomePage() {
  const dispatch = useDispatch();
  const { blogList, loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchBlogList());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4">
      {loading && <p>Bloglar yükleniyor...</p>}
      {error && <p className="text-red-500">Hata: {error}</p>}
      {!loading &&
        blogList.map((blog) => {
          // İlk görseli al
          const firstImageBlock = blog.contentBlocks.find(
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
                  ? `${process.env.NEXT_PUBLIC_BASE_URL}${firstImageBlock.content}`
                  : null
              }
            />
          );
        })}
    </div>
  );
}