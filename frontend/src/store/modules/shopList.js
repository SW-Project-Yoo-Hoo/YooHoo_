import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const shopListThunk = createAsyncThunk("GET_LIST", async () => {
  const res = await axios.get("/posts");
  return res.data.data;
});

export const shopListSlice = createSlice({
  name: "shopList",
  initialState: [],
  reducers: {},
  extraReducers: {
    [shopListThunk.fulfilled]: (state, { payload }) => [...payload].reverse(),
  },
});
