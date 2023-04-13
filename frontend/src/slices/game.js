import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clear } from "@testing-library/user-event/dist/clear";
import { add, create } from "lodash";
import { setMessage } from "./message";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  inGame: false,
  currentBoardId: 0,
  mainPlayerGameId: 0,
  mainPlayerName: "",
  mainPlayerRanking: "",
  mainPlayerUserId: "",
  mainPlayerPoints: "",
  mainPlayerCards: [],
  leftPlayerGameId: 0,
  leftPlayerName: "",
  leftPlayerRanking: "",
  leftPlayerUserId: "",
  leftPlayerPoints: "",
  leftPlayerCards: [],
  topPlayerGameId: 0,
  topPlayerName: "",
  topPlayerRanking: "",
  topPlayerUserId: "",
  topPlayerPoints: "",
  topPlayerCards: [],
  rightPlayerGameId: 0,
  rightPlayerName: "",
  rightPlayerRanking: "",
  rightPlayerUserId: "",
  rightPlayerPoints: "",
  rightPlayerCards: [],
  stackCard: "",
  activeCard: "",
  blockEndGame: true,
  blockGetFromDealer: true,
  blockGetFromStack: true,
  blockPlayCard: true,
  turnPlayerId: -1,
  gameEnding: false,
  roundResults: [],
  gameResults: [],
  showRoundResults: false,
  showGameResults: false,
  jackAction: false,
  jackCardArray: ["", ""],
  jackIdArray: ["", ""],
  jack: "",
  timeoutId: 0,
  penaltyCard: { suit: "", text: "" },
  cheatArray: ["", ""],
  startAction: false,
  startArray: ["", ""],
  startFlag: false,
  queenAction: false,
  queenCardArray: ["", ""],
  queenIdArray: ["", ""],
  queen: "",
};

export const setLeftPlayer = createAsyncThunk(
  "game/setLeftPlayer",
  async ([id, name, mmr, userId]) => {
    const data = { id: id, name: name, mmr: mmr, userId: userId };
    return { data };
  }
);

export const setRightPlayer = createAsyncThunk(
  "game/setRightPlayer",
  async ([id, name, mmr, userId]) => {
    const data = { id: id, name: name, mmr: mmr, userId: userId };
    return { data };
  }
);

export const setTopPlayer = createAsyncThunk(
  "game/setTopPlayer",
  async ([id, name, mmr, userId]) => {
    const data = { id: id, name: name, mmr: mmr, userId: userId };
    return { data };
  }
);

export const setMainPlayer = createAsyncThunk(
  "game/setMainPlayer",
  async ([id, name, mmr, userId]) => {
    const data = { id: id, name: name, mmr: mmr, userId: userId };
    return { data };
  }
);

export const setTopPlayerPoints = createAsyncThunk(
  "game/setTopPlayerPoints",
  async ([points]) => {
    const data = { points: points };
    return { data };
  }
);

export const setLeftPlayerPoints = createAsyncThunk(
  "game/setLeftPlayerPoints",
  async ([points]) => {
    const data = { points: points };
    return { data };
  }
);

export const setRightPlayerPoints = createAsyncThunk(
  "game/setRightPlayerPoints",
  async ([points]) => {
    const data = { points: points };
    return { data };
  }
);

export const setMainPlayerPoints = createAsyncThunk(
  "game/setMainPlayerPoints",
  async ([points]) => {
    const data = { points: points };
    return { data };
  }
);

export const setLeftPlayerCards = createAsyncThunk(
  "game/setLeftPlayerCards",
  async ([cards]) => {
    const data = { cards: cards };
    return { data };
  }
);

export const setTopPlayerCards = createAsyncThunk(
  "game/setTopPlayerCards",
  async ([cards]) => {
    const data = { cards: cards };
    return { data };
  }
);

export const setRightPlayerCards = createAsyncThunk(
  "game/setRightPlayerCards",
  async ([cards]) => {
    const data = { cards: cards };
    return { data };
  }
);

export const setMainPlayerCards = createAsyncThunk(
  "game/setMainPlayerCards",
  async ([cards]) => {
    const data = { cards: cards };
    return { data };
  }
);

export const setStackCard = createAsyncThunk(
  "game/setStackCard",
  async ([card]) => {
    const data = { card: card };
    return { data };
  }
);

export const clearLeftPlayer = createAsyncThunk(
  "game/clearLeftPlayer",
  async () => {
    return true;
  }
);

export const clearTopPlayer = createAsyncThunk(
  "game/clearTopPlayer",
  async () => {
    return true;
  }
);

export const clearRightPlayer = createAsyncThunk(
  "game/clearRightPlayer",
  async () => {
    return true;
  }
);

export const clearMainPlayer = createAsyncThunk(
  "game/clearMainPlayer",
  async () => {
    return true;
  }
);

export const clearPoints = createAsyncThunk("game/clearPoints", async () => {
  return true;
});

export const clearPlayers = createAsyncThunk("game/clearPlayers", async () => {
  return true;
});

export const setActiveCard = createAsyncThunk(
  "game/setActiveCard",
  async ([card]) => {
    const data = { card: card };
    return { data };
  }
);

export const clearActiveCard = createAsyncThunk(
  "game/clearActiveCard",
  async () => {
    return true;
  }
);

export const setInGame = createAsyncThunk("game/setInGame", async () => {
  return true;
});

export const setNotInGame = createAsyncThunk("game/setNotInGame", async () => {
  return true;
});

export const blockGetFromStack = createAsyncThunk(
  "game/blockGetFromStack",
  async () => {
    return true;
  }
);

export const unblockGetFromStack = createAsyncThunk(
  "game/unblockGetFromStack",
  async () => {
    return true;
  }
);

export const blockGetFromDealer = createAsyncThunk(
  "game/blockGetFromDealer",
  async () => {
    return true;
  }
);

export const unblockGetFromDealer = createAsyncThunk(
  "game/unblockGetFromDealer",
  async () => {
    return true;
  }
);

export const blockPlayCard = createAsyncThunk(
  "game/blockPlayCard",
  async () => {
    return true;
  }
);

export const unblockPlayCard = createAsyncThunk(
  "game/unblockPlayCard",
  async () => {
    return true;
  }
);

export const blockEndGame = createAsyncThunk("game/blockEndGame", async () => {
  return true;
});

export const unblockEndGame = createAsyncThunk(
  "game/unblockEndGame",
  async () => {
    return true;
  }
);

export const setTurnPlayerId = createAsyncThunk(
  "game/setTurnPlayerId",
  async ([id]) => {
    const data = { id: id };
    return { data };
  }
);

export const setGameEnding = createAsyncThunk(
  "game/setGameEnding",
  async () => {
    return true;
  }
);

export const unsetGameEnding = createAsyncThunk(
  "game/unsetGameEnding",
  async () => {
    return true;
  }
);

export const setRoundResults = createAsyncThunk(
  "game/setRoundResults",
  async ([roundResults, gameResults, cards]) => {
    const data = { roundResults: [roundResults, gameResults, cards] };
    return { data };
  }
);

export const setGameResults = createAsyncThunk(
  "game/setGameResults",
  async ([roundResults, gameResults, cards]) => {
    const data = { gameResults: [roundResults, gameResults, cards] };
    return { data };
  }
);

export const clearRoundResults = createAsyncThunk(
  "game/clearRoundResults",
  async () => {
    return true;
  }
);

export const clearGameResults = createAsyncThunk(
  "game/clearGameResults",
  async () => {
    return true;
  }
);

export const setShowRoundResults = createAsyncThunk(
  "game/setShowRoundResults",
  async (bool) => {
    const data = { bool: bool };
    return { data };
  }
);

export const setShowGameResults = createAsyncThunk(
  "game/setShowGameResults",
  async (bool) => {
    const data = { bool: bool };
    return { data };
  }
);

export const setJackAction = createAsyncThunk(
  "game/setJackAction",
  async (bool) => {
    const data = { bool: bool };
    return { data };
  }
);

export const addToJackArray = createAsyncThunk(
  "game/addToJackArray",
  async ([id, card]) => {
    const data = { id: id, card: card };
    return { data };
  }
);

export const clearJackArray = createAsyncThunk(
  "game/clearJackArray",
  async () => {
    return true;
  }
);

export const setJackFlag = createAsyncThunk(
  "game/setJackFlag",
  async (bool) => {
    const data = { bool: bool };
    return { data };
  }
);

export const setJack = createAsyncThunk("game/setJack", async (card) => {
  const data = { card: card };
  return { data };
});

export const setTimeoutId = createAsyncThunk(
  "game/setTimeoutId",
  async (id) => {
    const data = { id: id };
    return { data };
  }
);

export const setPenaltyCard = createAsyncThunk(
  "game/setPenaltyCard",
  async ([card]) => {
    const data = { card: card };
    return { data };
  }
);

export const clearPenaltyCard = createAsyncThunk(
  "game/clearPenaltyCard",
  async () => {
    return true;
  }
);

export const addToCheatArray = createAsyncThunk(
  "game/addToCheatArray",
  async (card) => {
    const data = { card: card };
    return { data };
  }
);

export const clearCheatArray = createAsyncThunk(
  "game/clearCheatArray",
  async () => {
    return true;
  }
);

export const setStartAction = createAsyncThunk(
  "game/setStartAction",
  async (bool) => {
    const data = { bool: bool };
    return { data };
  }
);

export const addToStartArray = createAsyncThunk(
  "game/addToStartArray",
  async (card) => {
    const data = { card: card };
    return { data };
  }
);

export const clearStartArray = createAsyncThunk(
  "game/clearStartArray",
  async () => {
    return true;
  }
);

export const setStartFlag = createAsyncThunk(
  "game/setStartFlag",
  async (bool) => {
    const data = { bool: bool };
    return { data };
  }
);

export const setQueenAction = createAsyncThunk(
  "game/setQueenAction",
  async (bool) => {
    const data = { bool: bool };
    return { data };
  }
);

export const addToQueenArray = createAsyncThunk(
  "game/addToQueenArray",
  async ([id, card]) => {
    const data = { id: id, card: card };
    return { data };
  }
);

export const clearQueenArray = createAsyncThunk(
  "game/clearQueenArray",
  async () => {
    return true;
  }
);

export const setQueenFlag = createAsyncThunk(
  "game/setQueenFlag",
  async (bool) => {
    const data = { bool: bool };
    return { data };
  }
);

export const setQueen = createAsyncThunk("game/setQueen", async (card) => {
  const data = { card: card };
  return { data };
});

const gameSlice = createSlice({
  name: "game",
  initialState,
  extraReducers: {
    [setLeftPlayer.fulfilled]: (state, action) => {
      state.leftPlayerGameId = action.payload.data.id;
      state.leftPlayerName = action.payload.data.name;
      state.leftPlayerRanking = action.payload.data.mmr;
      state.leftPlayerUserId = action.payload.data.userId;
    },
    [setRightPlayer.fulfilled]: (state, action) => {
      state.rightPlayerGameId = action.payload.data.id;
      state.rightPlayerName = action.payload.data.name;
      state.rightPlayerRanking = action.payload.data.mmr;
      state.rightPlayerUserId = action.payload.data.userId;
    },
    [setTopPlayer.fulfilled]: (state, action) => {
      state.topPlayerGameId = action.payload.data.id;
      state.topPlayerName = action.payload.data.name;
      state.topPlayerRanking = action.payload.data.mmr;
      state.topPlayerUserId = action.payload.data.userId;
    },
    [setMainPlayer.fulfilled]: (state, action) => {
      state.mainPlayerGameId = action.payload.data.id;
      state.mainPlayerName = action.payload.data.name;
      state.mainPlayerRanking = action.payload.data.mmr;
      state.mainPlayerUserId = action.payload.data.userId;
    },
    [setLeftPlayerPoints.fulfilled]: (state, action) => {
      state.leftPlayerPoints = action.payload.data.points;
    },
    [setTopPlayerPoints.fulfilled]: (state, action) => {
      state.topPlayerPoints = action.payload.data.points;
    },
    [setRightPlayerPoints.fulfilled]: (state, action) => {
      state.rightPlayerPoints = action.payload.data.points;
    },
    [setMainPlayerPoints.fulfilled]: (state, action) => {
      state.mainPlayerPoints = action.payload.data.points;
    },
    [setLeftPlayerCards.fulfilled]: (state, action) => {
      state.leftPlayerCards = action.payload.data.cards;
    },
    [setTopPlayerCards.fulfilled]: (state, action) => {
      state.topPlayerCards = action.payload.data.cards;
    },
    [setRightPlayerCards.fulfilled]: (state, action) => {
      state.rightPlayerCards = action.payload.data.cards;
    },
    [setMainPlayerCards.fulfilled]: (state, action) => {
      state.mainPlayerCards = action.payload.data.cards;
    },
    [setStackCard.fulfilled]: (state, action) => {
      state.stackCard = action.payload.data.card;
    },
    [clearLeftPlayer.fulfilled]: (state, action) => {
      state.leftPlayerId = "";
      state.leftPlayerName = "";
      state.leftPlayerRanking = "";
      state.leftPlayerUserId = "";
      state.leftPlayerCards = [];
      state.leftPlayerPoints = "";
    },
    [clearTopPlayer.fulfilled]: (state, action) => {
      state.topPlayerId = "";
      state.topPlayerName = "";
      state.topPlayerRanking = "";
      state.topPlayerUserId = "";
      state.topPlayerCards = [];
      state.topPlayerPoints = "";
    },
    [clearRightPlayer.fulfilled]: (state, aciton) => {
      state.rightPlayerId = "";
      state.rightPlayerName = "";
      state.rightPlayerRanking = "";
      state.rightPlayerUserId = "";
      state.rightPlayerCards = [];
      state.rightPlayerPoints = "";
    },
    [clearMainPlayer.fulfilled]: (state, aciton) => {
      state.mainPlayerId = "";
      state.mainPlayerName = "";
      state.mainPlayerRanking = "";
      state.mainPlayerUserId = "";
      state.mainPlayerCards = [];
      state.mainPlayerPoints = "";
    },
    [clearPoints.fulfilled]: (state, action) => {
      state.topPlayerPoints = "";
      state.leftPlayerPoints = "";
      state.rightPlayerPoints = "";
      state.mainPlayerPoints = "";
    },
    [clearPlayers.fulfilled]: (state, action) => {
      state.leftPlayerId = "";
      state.leftPlayerName = "";
      state.leftPlayerRanking = "";
      state.leftPlayerUserId = "";
      state.leftPlayerCards = [];
      state.leftPlayerPoints = "";
      state.rightPlayerId = "";
      state.rightPlayerName = "";
      state.rightPlayerRanking = "";
      state.rightPlayerUserId = "";
      state.rightPlayerCards = [];
      state.rightPlayerPoints = "";
      state.topPlayerId = "";
      state.topPlayerName = "";
      state.topPlayerRanking = "";
      state.topPlayerUserId = "";
      state.topPlayerCards = [];
      state.topPlayerPoints = "";
      state.mainPlayerId = "";
      state.mainPlayerName = "";
      state.mainPlayerRanking = "";
      state.mainPlayerUserId = "";
      state.mainPlayerCards = [];
      state.mainPlayerPoints = "";
      state.stackCard = "";
      state.activeCard = "";
    },
    [setActiveCard.fulfilled]: (state, action) => {
      state.activeCard = action.payload.data.card;
    },
    [clearActiveCard.fulfilled]: (state, action) => {
      state.activeCard = "";
    },
    [setInGame.fulfilled]: (state, action) => {
      state.inGame = true;
    },
    [setNotInGame.fulfilled]: (state, action) => {
      state.inGame = false;
    },
    [blockEndGame.fulfilled]: (state, action) => {
      state.blockEndGame = true;
    },
    [unblockEndGame.fulfilled]: (state, action) => {
      state.blockEndGame = false;
    },
    [blockGetFromDealer.fulfilled]: (state, action) => {
      state.blockGetFromDealer = true;
    },
    [unblockGetFromDealer.fulfilled]: (state, action) => {
      state.blockGetFromDealer = false;
    },
    [blockGetFromStack.fulfilled]: (state, action) => {
      state.blockGetFromStack = true;
    },
    [unblockGetFromStack.fulfilled]: (state, action) => {
      state.blockGetFromStack = false;
    },
    [blockPlayCard.fulfilled]: (state, action) => {
      state.blockPlayCard = true;
    },
    [unblockPlayCard.fulfilled]: (state, action) => {
      state.blockPlayCard = false;
    },
    [setTurnPlayerId.fulfilled]: (state, action) => {
      state.turnPlayerId = action.payload.data.id;
    },
    [setGameEnding.fulfilled]: (state, action) => {
      state.gameEnding = true;
    },
    [unsetGameEnding.fulfilled]: (state, action) => {
      state.gameEnding = false;
    },
    [setRoundResults.fulfilled]: (state, action) => {
      state.roundResults = action.payload.data.roundResults;
    },
    [clearRoundResults.fulfilled]: (state, action) => {
      state.roundResults = [];
    },
    [setGameResults.fulfilled]: (state, action) => {
      state.gameResults = action.payload.data.gameResults;
      state.showGameResults = true;
    },
    [clearGameResults.fulfilled]: (state, action) => {
      state.gameResults = [];
    },
    [setShowRoundResults.fulfilled]: (state, action) => {
      state.showRoundResults = action.payload.data.bool;
    },
    [setShowGameResults.fulfilled]: (state, action) => {
      state.showGameResults = action.payload.data.bool;
    },
    [setJackAction.fulfilled]: (state, action) => {
      state.jackAction = action.payload.data.bool;
    },
    [addToJackArray.fulfilled]: (state, action) => {
      state.jackIdArray.push(action.payload.data.id);
      state.jackCardArray.push(action.payload.data.card);
    },
    [clearJackArray.fulfilled]: (state, action) => {
      state.jackIdArray = ["", ""];
      state.jackCardArray = ["", ""];
    },
    [setJackFlag.fulfilled]: (state, action) => {
      state.jackFlag = action.payload.data.bool;
    },
    [setJack.fulfilled]: (state, action) => {
      state.jack = action.payload.data.card;
    },
    [setTimeoutId.fulfilled]: (state, action) => {
      state.timeoutId = action.payload.data.id;
    },
    [setPenaltyCard.fulfilled]: (state, action) => {
      state.penaltyCard = action.payload.data.card;
    },
    [clearPenaltyCard.fulfilled]: (state, action) => {
      state.penaltyCard = { suit: "", text: "" };
    },
    [addToCheatArray.fulfilled]: (state, action) => {
      state.cheatArray.push(action.payload.data.card);
    },
    [clearCheatArray.fulfilled]: (state, aciont) => {
      state.cheatArray = ["", ""];
    },
    [setStartAction.fulfilled]: (state, action) => {
      state.startAction = action.payload.data.bool;
    },
    [addToStartArray.fulfilled]: (state, action) => {
      state.startArray.push(action.payload.data.card);
    },
    [clearStartArray.fulfilled]: (state, aciont) => {
      state.startArray = ["", ""];
    },
    [setStartFlag.fulfilled]: (state, action) => {
      state.startFlag = action.payload.data.bool;
    },
    [setQueenAction.fulfilled]: (state, action) => {
      state.queenAction = action.payload.data.bool;
    },
    [addToQueenArray.fulfilled]: (state, action) => {
      state.queenIdArray.push(action.payload.data.id);
      state.queenCardArray.push(action.payload.data.card);
    },
    [clearQueenArray.fulfilled]: (state, action) => {
      state.queenIdArray = ["", ""];
      state.queenCardArray = ["", ""];
    },
    [setQueenFlag.fulfilled]: (state, action) => {
      state.queenFlag = action.payload.data.bool;
    },
    [setQueen.fulfilled]: (state, action) => {
      state.queen = action.payload.data.card;
    },
  },
});

const { reducer } = gameSlice;
export default reducer;
