import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// 비동기 Thunk 생성, 비동기 요청
export const shopItemThunk = createAsyncThunk("GET_ITEM", async (id) => {
  const res = await axios.get(`/posts/${id}`);
  return res.data.data;
});

// Slice 생성
export const shopItemSlice = createSlice({
  name: "shopItem",
  initialState: { data: [] },
  reducers: {},
  extraReducers: {
    [shopItemThunk.fulfilled]: (state, { payload }) => {
      state.data = payload;
    },
  },
});
