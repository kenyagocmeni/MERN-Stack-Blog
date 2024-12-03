import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Blog Listesi
export const fetchBlogList = createAsyncThunk(
  "blog/fetchBlogList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogposts`
      );
      const data = await response.json();
      return data.blogPosts || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Blog detayı
export const fetchBlogDetail = createAsyncThunk(
  "blog/fetchBlogDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogposts/${id}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Blog detayı alınamadı.");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Blog gönderisi ekleme
export const addBlogPost = createAsyncThunk(
  "blog/addBlogPost",
  async (blogData, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogposts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: blogData,
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Blog ekleme başarısız.");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Blog gönderisi güncelleme
export const updateBlogPost = createAsyncThunk(
  "blog/updateBlogPost",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogposts/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: updatedData, // FormData gönderiyoruz
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Blog gönderisi güncellenemedi.");
      }

      return data.blogPost; // Güncellenen blogpost'u döndür
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Blog gönderisi silme
export const deleteBlogPost = createAsyncThunk(
  "blog/deleteBlogPost",
  async (postId, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogposts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Blog gönderisi silinemedi.");
      }

      return postId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Yorum ekleme
export const addComment = createAsyncThunk(
  "blog/addComment",
  async ({ postId, content, parentCommentId }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogposts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content, parentComment: parentCommentId }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Yorum eklenemedi.");
      }

      return data.comment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const replyToComment = createAsyncThunk(
  "blog/replyToComment",
  async ({ postId, commentId, content }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogposts/${postId}/comments/${commentId}/reply`, // Doğru rota
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Yanıt eklenemedi.");
      }

      return data.reply;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Yorum silme
export const deleteComment = createAsyncThunk(
  "blog/deleteComment",
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogposts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Yorum silinemedi.");
      }

      return commentId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Blog gönderisi beğenme/toggle
export const toggleBlogPostLike = createAsyncThunk(
  "blog/toggleBlogPostLike",
  async (id, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogposts/${id}/like`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Blogpost like işlemi başarısız.");
      }

      return { id, likes: data.likes };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Yorum beğenme/toggle
export const toggleCommentLike = createAsyncThunk(
  "blog/toggleCommentLike",
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogposts/${postId}/comments/${commentId}/like`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Yorum like işlemi başarısız.");
      }

      return { commentId, likes: data.likes };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editComment = createAsyncThunk(
  "blog/editComment",
  async ({ postId, commentId, content }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogposts/${postId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Yorum düzenlenemedi.");
      }

      return data.comment; // Güncellenmiş yorumu döndür
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogList: [],
    blogDetail: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogList.fulfilled, (state, action) => {
        state.loading = false;
        state.blogList = action.payload;
      })
      .addCase(fetchBlogList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBlogDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.blogDetail = action.payload;
      })
      .addCase(fetchBlogDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addBlogPost.fulfilled, (state, action) => {
        state.blogList.push(action.payload);
        state.successMessage = "Blogpost başarıyla paylaşıldı!";
      })
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        state.blogList = state.blogList.filter(
          (blog) => blog._id !== action.payload
        );
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.blogDetail.comments.push(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.blogDetail.comments = state.blogDetail.comments.filter(
          (comment) => comment._id !== action.payload
        );
      })
      .addCase(replyToComment.fulfilled, (state, action) => {
        state.blogDetail.comments.push(action.payload);
      })
      .addCase(toggleBlogPostLike.fulfilled, (state, action) => {
        const { id, likes } = action.payload;
        const blog = state.blogList.find((blog) => blog._id === id);
        if (blog) blog.likes = likes;
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const { commentId, likes } = action.payload;
        const comment = state.blogDetail.comments.find(
          (comment) => comment._id === commentId
        );
        if (comment) comment.likes = likes;
      })
      .addCase(editComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const commentIndex = state.blogDetail.comments.findIndex(
          (comment) => comment._id === updatedComment._id
        );
        if (commentIndex !== -1) {
          state.blogDetail.comments[commentIndex] = updatedComment;
        }
      });
  },
});

export const { clearSuccessMessage } = blogSlice.actions;
export default blogSlice.reducer;