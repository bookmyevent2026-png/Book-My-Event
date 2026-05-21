import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    id: sessionStorage.getItem("id") || "",
    name: sessionStorage.getItem("name") || "",
    role: sessionStorage.getItem("role") || "",
    profile_image: sessionStorage.getItem("profile_image") || "",
  },
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.profile_image = action.payload.profile_image;

      // ✅ sync to sessionStorage
      sessionStorage.setItem("id", action.payload.id);
      sessionStorage.setItem("name", action.payload.name);
      sessionStorage.setItem("role", action.payload.role);
      sessionStorage.setItem("profile_image", action.payload.profile_image || "");
    },
    clearUser: (state) => {
      state.id = "";
      state.name = "";
      state.role = "";
      state.profile_image = "";
       // ✅ clear sessionStorage
      sessionStorage.removeItem("id");
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("profile_image");
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;