import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import userImageService from "../services/user-image.service";

const initialState = [];

export const getImagesIds = createAsyncThunk(
    "userImage/getImagesIds",
    async (thunkAPI) => {
        try {
            const data = await userImageService.getImagesIds();
            return { data: data.data };
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue();
        }
    }
);

export const setProfileImage = createAsyncThunk(
    "userImage/getImagesIds",
    async (body, thunkAPI) => {
        try {
            const data = await userImageService.postProfileImage(body);
            return { data: data.data };
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue();
        }
    }
);


const userImagesSlice = createSlice({
    name: "userImage",
    initialState,
    extraReducers: {
        [getImagesIds.fulfilled]: (state, action) => state,
        [getImagesIds.rejected]: (state, action) => state,
        [setProfileImage.fulfilled]: (state, action) => state,
        [setProfileImage.rejected]: (state, action) => state
    },
});

const { reducer } = userImagesSlice;
export default reducer;