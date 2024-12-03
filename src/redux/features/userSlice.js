import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Kullanıcı kaydı
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Kullanıcı kaydı başarısız.");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Kullanıcı girişi
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Kullanıcı girişi başarısız.");
      }

      // Token ve kullanıcı bilgilerini kaydet
      Cookies.set("token", data.token, { expires: 7 });
      Cookies.set("user", JSON.stringify(data.user), { expires: 7 });

      // Redux state'i güncellemek için loadUser'ı çağır
      dispatch(loadUser());

      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Kullanıcı profilini getirme
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Kullanıcı bilgileri alınamadı.");
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Kullanıcı blog yazılarını getirme
export const fetchUserBlogPosts = createAsyncThunk(
  "user/fetchUserBlogPosts",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/blogposts`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Kullanıcı blog yazıları alınamadı.");
      }

      return data.blogPosts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Kullanıcı profilini güncelleme
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profil güncellenemedi.");
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Redux Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    userBlogPosts: [],
    loading: false,
    error: null,
  },
  reducers: {
    loadUser(state) {
      const userData = Cookies.get("user")
        ? JSON.parse(Cookies.get("user"))
        : null;
      const token = Cookies.get("token");

      if (userData && token) {
        state.userInfo = userData;
      }
    },
    logout(state) {
      state.userInfo = null;
      Cookies.remove("token");
      Cookies.remove("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchUserBlogPosts
      .addCase(fetchUserBlogPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBlogPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.userBlogPosts = action.payload;
      })
      .addCase(fetchUserBlogPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;

        // Cookie güncelle
        Cookies.set("user", JSON.stringify(action.payload));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { loadUser, logout } = userSlice.actions;
export default userSlice.reducer;