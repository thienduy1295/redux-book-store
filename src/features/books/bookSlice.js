import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../apiService";

const initialState = {
  books: [],
  favorites: [],
  status: "idle",
  errorMessage: "",
  loading: false,
  book: {},
};

export const getBooks = createAsyncThunk(
  "books/getBooks",
  async ({ pageNum, limit, query }, thunkApi) => {
    let url = `/books?_page=${pageNum}&_limit=${limit}`;
    if (query) url += `&q=${query}`;
    const res = await api.get(url);
    return res.data;
  }
);

export const getFavorite = createAsyncThunk("books/getFavorite", async () => {
  const res = await api.get(`/favorites`);
  return res.data;
});

export const getSingleBook = createAsyncThunk(
  "books/getSingleBook",
  async ({ bookId }) => {
    const res = await api.get(`/books/${bookId}`);
    return res.data;
  }
);

export const addFavorite = createAsyncThunk(
  "books/addFavorite",
  async ({ addingBook }) => {
    await api.post(`/favorites`, addingBook);
    toast.success("The book has been added to the reading list!");
  }
);

export const deleteFavorite = createAsyncThunk(
  "books/deleteFavorite",
  async ({ removedBookId }) => {
    await api.delete(`/favorites/${removedBookId}`);
    toast.success("The book has been removed");
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // -------------------GET BOOKS---------------------
    builder
      .addCase(getBooks.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.status = "idle";
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(getBooks.rejected, (state, action) => {
        state.status = "fail";
        state.loading = false;
        state.errorMessage = action.error.message;
      });
    // -------------------SINGLEBOOK---------------------
    builder
      .addCase(getSingleBook.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(getSingleBook.fulfilled, (state, action) => {
        state.status = "idle";
        state.loading = false;
        state.book = action.payload;
      })
      .addCase(getSingleBook.rejected, (state, action) => {
        state.status = "fail";
        state.loading = false;
        state.errorMessage = action.error.message;
      });
    // -------------------ADD_FAVORITE---------------------
    builder
      .addCase(addFavorite.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.status = "idle";
        state.loading = false;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.status = "fail";
        state.loading = false;
        state.errorMessage = action.error.message;
      });
    // -------------------GET_FAVORITE---------------------
    builder
      .addCase(getFavorite.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(getFavorite.fulfilled, (state, action) => {
        state.status = "idle";
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(getFavorite.rejected, (state, action) => {
        state.status = "fail";
        state.loading = false;
        state.errorMessage = action.error.message;
      });
    // -------------------DELETE_FAVORITE---------------------
    builder
      .addCase(deleteFavorite.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(deleteFavorite.fulfilled, (state, action) => {
        state.status = "idle";
        state.loading = false;
        // state.favorites = action.payload;
      })
      .addCase(deleteFavorite.rejected, (state, action) => {
        state.status = "fail";
        state.loading = false;
        state.errorMessage = action.error.message;
      });
  },
});

export default bookSlice.reducer;
