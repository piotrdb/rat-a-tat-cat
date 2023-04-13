import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/auth";
import messageReducer from "./slices/message";
import boardsReducer from "./slices/boards";
import gameReducer from "./slices/game";
import userCredentialsReducer from "./slices/userCredentials";
import rankingListingReducer from './slices/rankingList';
import userImagesReducer from './slices/userImage';

const reducer = {
  auth: authReducer,
  message: messageReducer,
  boards: boardsReducer,
  game: gameReducer,
  userCredentials: userCredentialsReducer,
  rankingList: rankingListingReducer,
  userImages: userImagesReducer
}

const store = configureStore({
  reducer: reducer,
  devTools: true,
})

export default store;