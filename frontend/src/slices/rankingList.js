import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import authService from "../services/auth.service";

const initialState = [];

export const getRankingList = createAsyncThunk(
    "rankingListing/getRankingList",
    async (thunkAPI) => {
        try {
            const data = await authService.getRankingListing();
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

const rankingListingSlice = createSlice({
    name: "rankingListing",
    initialState,
    extraReducers: {
        [getRankingList.fulfilled]: (state, action) => state.map(userRanking => {
            return ({
                userId: userRanking.userId,
                displayName: userRanking.displayName,
                userName: userRanking.userName,
                email: userRanking.email,
                password: userRanking.password,
                role: userRanking.role,
                mmr: userRanking.mmr,
                ratMMR: userRanking.ratMMR,
                dragonMMR: userRanking.dragonMMR,
                crowMMR: userRanking.crowMMR,
                createdDate: userRanking.createdDate
            })
        }),
        [getRankingList.rejected]: (state, action) => state.map(userRanking => {
            return ({
                userId: userRanking.userId,
                displayName: userRanking.displayName,
                userName: userRanking.userName,
                email: userRanking.email,
                password: userRanking.password,
                role: userRanking.role,
                mmr: userRanking.mmr,
                ratMMR: userRanking.ratMMR,
                dragonMMR: userRanking.dragonMMR,
                crowMMR: userRanking.crowMMR,
                createdDate: userRanking.createdDate
            })
        }),
    },
});

const { reducer } = rankingListingSlice;
export default reducer;