import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "./features/blogSlice";
import userReducer,{loadUser} from "./features/userSlice";
import commentReducer from "./features/commentSlice";
import likeReducer from "./features/likeSlice";

const store = configureStore({
  reducer: {
    blog: blogReducer, // Blog işlemleri
    user: userReducer, // Kullanıcı işlemleri
    comment: commentReducer, // Yorum işlemleri
    like: likeReducer, // Beğeni işlemleri
  },
});

store.dispatch(loadUser());

export default store;