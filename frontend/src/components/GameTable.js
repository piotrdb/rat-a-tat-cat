import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";
import { Button } from "react-bootstrap";
import Chat from "./Chat";
import Card from "./Card";
import Results from "./Results";
import GameResults from "./GameResults";

import {
  setInGame,
  setNotInGame,
  setLeftPlayer,
  setTopPlayer,
  setRightPlayer,
  setMainPlayer,
  setLeftPlayerPoints,
  setTopPlayerPoints,
  setRightPlayerPoints,
  setMainPlayerPoints,
  setLeftPlayerCards,
  setTopPlayerCards,
  setRightPlayerCards,
  setMainPlayerCards,
  setStackCard,
  clearLeftPlayer,
  clearTopPlayer,
  clearRightPlayer,
  clearMainPlayer,
  clearPlayers,
  setActiveCard,
  clearActiveCard,
  blockEndGame,
  unblockEndGame,
  blockGetFromDealer,
  unblockGetFromDealer,
  blockGetFromStack,
  unblockGetFromStack,
  blockPlayCard,
  unblockPlayCard,
  setTurnPlayerId,
  setGameEnding,
  unsetGameEnding,
  setRoundResults,
  setGameResults,
  clearRoundResults,
  clearGameResults,
  setShowRoundResults,
  setShowGameResults,
  setJackAction,
  addToJackArray,
  clearJackArray,
  setJackFlag,
  setJack,
  setTimeoutId,
  setPenaltyCard,
  clearPenaltyCard,
  addToCheatArray,
  clearCheatArray,
  setStartAction,
  addToStartArray,
  clearStartArray,
  setStartFlag,
  setQueenAction,
  addToQueenArray,
  clearQueenArray,
  setQueenFlag,
  setQueen,
} from "../slices/game";

const GameTable = (props) => {
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [sit, setSit] = useState(false);
  const [started, setStarted] = useState(false);
  const [cheat, setCheat] = useState(false);
  const [jackAnimation, setJackAnimation] = useState(["", "", "", "", ""]);
  const [playAnimation, setPlayAnimation] = useState(["", "", ""]);
  const [dealerAnimation, setDealerAnimation] = useState(false);
  const [stackAnimation, setStackAnimation] = useState(false);
  const userId = useSelector((state) => state.userCredentials.userId);

  const leftPlayerName = useSelector((state) => state.game.leftPlayerName);
  const topPlayerName = useSelector((state) => state.game.topPlayerName);
  const rightPlayerName = useSelector((state) => state.game.rightPlayerName);
  const mainPlayerName = useSelector((state) => state.game.mainPlayerName);

  const leftPlayerUserId = useSelector((state) => state.game.leftPlayerUserId);
  const topPlayerUserId = useSelector((state) => state.game.topPlayerUserId);
  const rightPlayerUserId = useSelector(
    (state) => state.game.rightPlayerUserId
  );
  const mainPlayerUserId = useSelector((state) => state.game.mainPlayerUserId);

  const leftPlayerGameId = useSelector((state) => state.game.leftPlayerGameId);
  const topPlayerGameId = useSelector((state) => state.game.topPlayerGameId);
  const rightPlayerGameId = useSelector(
    (state) => state.game.rightPlayerGameId
  );
  const mainPlayerGameId = useSelector((state) => state.game.mainPlayerGameId);

  const leftPlayerRanking = useSelector(
    (state) => state.game.leftPlayerRanking
  );
  const topPlayerRanking = useSelector((state) => state.game.topPlayerRanking);
  const rightPlayerRanking = useSelector(
    (state) => state.game.rightPlayerRanking
  );
  const mainPlayerRanking = useSelector(
    (state) => state.game.mainPlayerRanking
  );

  const leftPlayerPoints = useSelector((state) => state.game.leftPlayerPoints);
  const topPlayerPoints = useSelector((state) => state.game.topPlayerPoints);
  const rightPlayerPoints = useSelector(
    (state) => state.game.rightPlayerPoints
  );
  const mainPlayerPoints = useSelector((state) => state.game.mainPlayerPoints);

  const leftPlayerCards = useSelector((state) => state.game.leftPlayerCards);
  const topPlayerCards = useSelector((state) => state.game.topPlayerCards);
  const rightPlayerCards = useSelector((state) => state.game.rightPlayerCards);
  const mainPlayerCards = useSelector((state) => state.game.mainPlayerCards);

  const lockEndGame = useSelector((state) => state.game.blockEndGame);
  const lockGetFromDealer = useSelector(
    (state) => state.game.blockGetFromDealer
  );
  const lockGetFromStack = useSelector((state) => state.game.blockGetFromStack);
  const lockPlayCard = useSelector((state) => state.game.blockPlayCard);

  const [topBackgroundUrl, setTopBackgroundUrl] = useState("");
  const [leftBackgroundUrl, setLeftBackgroundUrl] = useState("");
  const [rightBackgroundUrl, setRightBackgroundUrl] = useState("");
  const [mainBackgroundUrl, setMainBackgroundUrl] = useState("");

  const stackCard = useSelector((state) => state.game.stackCard);
  const activeCard = useSelector((state) => state.game.activeCard);
  const turnPlayerId = useSelector((state) => state.game.turnPlayerId);
  const gameEnding = useSelector((state) => state.game.gameEnding);

  const roundResults = useSelector((state) => state.game.roundResults);
  const gameResults = useSelector((state) => state.game.gameResults);
  const showRoundResults = useSelector((state) => state.game.showRoundResults);
  const showGameResults = useSelector((state) => state.game.showGameResults);

  const jackAction = useSelector((state) => state.game.jackAction);
  const jackCardArray = useSelector((state) => state.game.jackCardArray);
  const jackIdArray = useSelector((state) => state.game.jackIdArray);
  const jackFlag = useSelector((state) => state.game.jackFlag);
  const jack = useSelector((state) => state.game.jack);

  const queenAction = useSelector((state) => state.game.queenAction);
  const queenCardArray = useSelector((state) => state.game.queenCardArray);
  const queenIdArray = useSelector((state) => state.game.queenIdArray);
  const queenFlag = useSelector((state) => state.game.queenFlag);
  const queen = useSelector((state) => state.game.queen);

  const penaltyCard = useSelector((state) => state.game.penaltyCard);
  const timeoutId = useSelector((state) => state.game.timeoutId);

  const cheatArray = useSelector((state) => state.game.cheatArray);
  const startAction = useSelector((state) => state.game.startAction);
  const startArray = useSelector((state) => state.game.startArray);
  const startFlag = useSelector((state) => state.game.startFlag);

  const dispatch = useDispatch();

  const handleCheatCode = () => {
    setCheat(!cheat);
  };

  const joinRoom = async () => {
    dispatch(clearPlayers());
    dispatch(setShowGameResults(false));
    dispatch(setShowRoundResults(false));
    dispatch(clearGameResults());
    dispatch(clearRoundResults());
    dispatch(setTurnPlayerId(0));
    dispatch(setInGame());
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("https://ratsapi.online/GameHub", {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("receiveMessage", (user, message) => {
        setMessages((messages) => [...messages, { user, message }]);
      });

      connection.on("gameStatus", (game) => {
        setTable(game);
      });

      connection.on("playerTookPlace", () => {
        setSit(true);
      });

      connection.on("playerLeftPlace", (game) => {
        setSit(false);
        dispatch(clearMainPlayer());
      });

      connection.on("roundEnding", () => {
        dispatch(setGameEnding());
      });

      connection.onclose((e) => {
        setConnection();
        setMessages([]);
        dispatch(clearPlayers());
        dispatch(setNotInGame());
      });

      await connection.start();
      await connection.invoke(
        "JoinRoom",
        `${props.boardId}`,
        `${props.boardMode}`,
        `${props.boardType}`,
        `${props.username}`
      );
      setConnection(connection);
      await connection.invoke("SendMessage", "dołączył do czatu");
    } catch (e) {
      console.log(e);
    }
  };

  const closeConnection = async () => {
    try {
      dispatch(clearGameResults());
      dispatch(clearRoundResults());
      dispatch(setTurnPlayerId(0));
      await connection.stop();
      console.log("connection stop");
    } catch (e) {
      console.log(e);
    }
  };

  const sendMessage = async (message) => {
    try {
      await connection.invoke("SendMessage", message);
    } catch (e) {
      console.log(e);
    }
  };

  const takePlace = async () => {
    try {
      await connection.invoke(
        "TakePlace",
        `${props.boardId}`,
        `${props.username}`
      );
    } catch (e) {
      console.log(e);
    }
  };

  const leavePlace = async () => {
    try {
      await connection.invoke("LeavePlace");
    } catch (e) {
      console.log(e);
    }
  };

  const setTable = async (game) => {
    // 1 PLAYER
    if (game.players.length === 1) {
      if (game.players[0].userId === userId) {
        let u = game.players[0];
        dispatch(setMainPlayer([u.id, u.displayName, u.mmr, u.userId]));
        dispatch(clearRightPlayer());
      } else {
        let u = game.players[0];
        dispatch(setRightPlayer([u.id, u.displayName, u.mmr, u.userId]));
        dispatch(clearMainPlayer());
      }
      dispatch(clearLeftPlayer());
      dispatch(clearTopPlayer());
    }
    // 2 PLAYERS
    else if (game.players.length === 2) {
      if (game.players[0].userId === userId) {
        let u = game.players[0];
        dispatch(setMainPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[1];
        dispatch(setLeftPlayer([u.id, u.displayName, u.mmr, u.userId]));
        dispatch(clearRightPlayer());
        dispatch(clearTopPlayer());
      } else if (game.players[1].userId === userId) {
        let u = game.players[0];
        dispatch(setRightPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[1];
        dispatch(setMainPlayer([u.id, u.displayName, u.mmr, u.userId]));
        dispatch(clearLeftPlayer());
        dispatch(clearTopPlayer());
      } else {
        let u = game.players[0];
        dispatch(setTopPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[1];
        dispatch(setRightPlayer([u.id, u.displayName, u.mmr, u.userId]));
        dispatch(clearLeftPlayer());
        dispatch(clearMainPlayer());
      }
    }
    // 3 PLAYERS
    else if (game.players.length === 3) {
      if (game.players[0].userId === userId) {
        let u = game.players[0];
        dispatch(setMainPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[1];
        dispatch(setLeftPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[2];
        dispatch(setTopPlayer([u.id, u.displayName, u.mmr, u.userId]));
        dispatch(clearRightPlayer());
      } else if (game.players[1].userId === userId) {
        let u = game.players[0];
        dispatch(setRightPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[1];
        dispatch(setMainPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[2];
        dispatch(setLeftPlayer([u.id, u.displayName, u.mmr, u.userId]));
        dispatch(clearTopPlayer());
      } else if (game.players[2].userId === userId) {
        let u = game.players[0];
        dispatch(setTopPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[1];
        dispatch(setRightPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[2];
        dispatch(setMainPlayer([u.id, u.displayName, u.mmr, u.userId]));
        dispatch(clearLeftPlayer());
      } else {
        let u = game.players[0];
        dispatch(setLeftPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[1];
        dispatch(setTopPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[2];
        dispatch(setRightPlayer([u.id, u.displayName, u.mmr, u.userId]));
        dispatch(clearMainPlayer());
      }
    }
    // 4 PLAYERS
    else if (game.players.length === 4) {
      if (game.players[0].userId === userId) {
        let u = game.players[0];
        dispatch(setMainPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[1];
        dispatch(setLeftPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[2];
        dispatch(setTopPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[3];
        dispatch(setRightPlayer([u.id, u.displayName, u.mmr, u.userId]));
      } else if (game.players[1].userId === userId) {
        let u = game.players[0];
        dispatch(setRightPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[1];
        dispatch(setMainPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[2];
        dispatch(setLeftPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[3];
        dispatch(setTopPlayer([u.id, u.displayName, u.mmr, u.userId]));
      } else if (game.players[2].userId === userId) {
        let u = game.players[0];
        dispatch(setTopPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[1];
        dispatch(setRightPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[2];
        dispatch(setMainPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[3];
        dispatch(setLeftPlayer([u.id, u.displayName, u.mmr, u.userId]));
      } else if (game.players[3].userId === userId) {
        let u = game.players[0];
        dispatch(setLeftPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[1];
        dispatch(setTopPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[2];
        dispatch(setRightPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[3];
        dispatch(setMainPlayer([u.id, u.displayName, u.mmr, u.userId]));
      } else {
        let u = game.players[0];
        dispatch(setLeftPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[1];
        dispatch(setTopPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[2];
        dispatch(setRightPlayer([u.id, u.displayName, u.mmr, u.userId]));
        u = game.players[3];
        dispatch(setMainPlayer([u.id, u.displayName, u.mmr, u.userId]));
      }
    }
  };

  const setCards = async (game) => {
    let p0 = game.players[0];
    let p1 = game.players[1];
    let p2 = game.players[2];
    let p3 = game.players[3];
    if (p0.userId === userId) {
      if (p0) dispatch(setMainPlayerCards([p0.cards]));
      if (p1) dispatch(setLeftPlayerCards([p1.cards]));
      if (p2) dispatch(setTopPlayerCards([p2.cards]));
      if (p3) dispatch(setRightPlayerCards([p3.cards]));
    } else if (p1.userId === userId) {
      if (p1) dispatch(setMainPlayerCards([p1.cards]));
      if (p2) dispatch(setLeftPlayerCards([p2.cards]));
      if (p3) dispatch(setTopPlayerCards([p3.cards]));
      if (p0) dispatch(setRightPlayerCards([p0.cards]));
    } else if (p2.userId === userId) {
      if (p2) dispatch(setMainPlayerCards([p2.cards]));
      if (p3) dispatch(setLeftPlayerCards([p3.cards]));
      if (p0) dispatch(setTopPlayerCards([p0.cards]));
      if (p1) dispatch(setRightPlayerCards([p1.cards]));
    } else {
      if (p3) dispatch(setMainPlayerCards([p3.cards]));
      if (p0) dispatch(setLeftPlayerCards([p0.cards]));
      if (p1) dispatch(setTopPlayerCards([p1.cards]));
      if (p2) dispatch(setRightPlayerCards([p2.cards]));
    }
    dispatch(setStackCard([game.stack.cards.at(0)]));
    dispatch(clearActiveCard());
  };

  const handlePlayCard = async () => {
    console.log("playing", activeCard);
    try {
      await connection.invoke("PlayCard", activeCard);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetCardDealer = async () => {
    try {
      await connection.invoke("GetCard", "dealer");
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetCardStack = async () => {
    try {
      await connection.invoke("GetCard", "stack");
    } catch (err) {
      console.log(err);
    }
  };

  const handleEndGame = async () => {
    try {
      await connection.invoke("RatATatCatEnding");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSetActiveCard = async (card) => {
    dispatch(setActiveCard([card]));
  };

  const blockAll = async () => {
    dispatch(blockEndGame());
    dispatch(blockGetFromDealer());
    dispatch(blockGetFromStack());
    dispatch(blockPlayCard());
  };

  const unblockAll = async () => {
    dispatch(unblockEndGame());
    dispatch(unblockGetFromDealer());
    dispatch(unblockGetFromStack());
    dispatch(unblockPlayCard());
  };

  useEffect(() => {
    joinRoom();
  }, []);

  const handleJackClick = (id, card) => {
    dispatch(addToJackArray([id, card]));
  };

  const handleQueenClick = (id, card) => {
    dispatch(addToQueenArray([id, card]));
  };

  const handleJackEffect = () => {
    dispatch(setJackFlag(true));
  };

  const handleQueenEffect = () => {
    dispatch(setQueenFlag(true));
  };

  const handleStartClick = (card) => {
    dispatch(addToStartArray(card));
  };

  useEffect(() => {
    if (leftPlayerUserId > 0) {
      setLeftBackgroundUrl(
        "https://ratsapi.online/api/users/user/image/" + leftPlayerUserId
      );
    }
  }, [leftPlayerUserId]);

  useEffect(() => {
    if (topPlayerUserId > 0) {
      setTopBackgroundUrl(
        "https://ratsapi.online/api/users/user/image/" + topPlayerUserId
      );
    }
  }, [topPlayerUserId]);

  useEffect(() => {
    if (rightPlayerUserId > 0) {
      setRightBackgroundUrl(
        "https://ratsapi.online/api/users/user/image/" + rightPlayerUserId
      );
    }
  }, [rightPlayerUserId]);

  useEffect(() => {
    if (mainPlayerUserId > 0) {
      setMainBackgroundUrl(
        "https://ratsapi.online/api/users/user/image/" + mainPlayerUserId
      );
    }
  }, [mainPlayerUserId]);

  useEffect(() => {
    if (connection) {
      connection.on("roundResults", (roundResults, gameResults, cards) => {
        console.log("ROUND RESULTS: ", roundResults, gameResults, cards);
        dispatch(setRoundResults([roundResults, gameResults, cards]));
        dispatch(setShowRoundResults(true));
        setTimeout(() => {
          dispatch(setShowRoundResults(false));
          dispatch(clearRoundResults());
        }, 10000);

        return () => {
          connection.off("roundResults");
        };
      });
    }
  }, [connection]);

  useEffect(() => {
    if (connection) {
      connection.on("gameResults", (roundResults, gameResults, cards) => {
        console.log("GAME RESULTS", roundResults, gameResults, cards);

        setTimeout(() => {
          dispatch(setGameResults([roundResults, gameResults, cards]));
        }, 10000);

        return () => {
          connection.off("gameResults");
        };
      });
    }
  }, [connection]);

  useEffect(() => {
    if (connection) {
      connection.on("newRound", (game) => {
        dispatch(clearCheatArray());
        console.log("newRound", game);
        dispatch(clearPenaltyCard());
        clearTimeout(timeoutId);
        console.log("newRound clears timeout id: ", timeoutId);
        setCards(game);
        dispatch(setStartAction(true));
        if (game.gameResult) {
          dispatch(setLeftPlayerPoints([game.gameResult[leftPlayerName]]));
          dispatch(setTopPlayerPoints([game.gameResult[topPlayerName]]));
          dispatch(setRightPlayerPoints([game.gameResult[rightPlayerName]]));
          dispatch(setMainPlayerPoints([game.gameResult[mainPlayerName]]));
        }
        dispatch(unsetGameEnding());
        let playerTurnUserId = game.playerTurn.userId;
        dispatch(setTurnPlayerId([playerTurnUserId]));
        setTimeout(() => {
          dispatch(setStartAction(false));
          dispatch(setStartFlag(true));
          setTimeout(() => {
            dispatch(clearCheatArray());
            if (playerTurnUserId === mainPlayerUserId) {
              unblockAll();
            } else {
              blockAll();
              dispatch(unblockPlayCard());
            }
          }, 5000);
        }, 18000);
      });

      return () => {
        connection.off("newRound");
      };
    }
  }, [
    connection,
    leftPlayerName,
    topPlayerName,
    rightPlayerName,
    mainPlayerName,
    timeoutId,
  ]);

  useEffect(() => {
    if (connection) {
      connection.on("playerLeftGame", (game) => {
        dispatch(clearPenaltyCard());
        clearTimeout(timeoutId);
        console.log("playerLeftGame clears timeout id: ", timeoutId);
        console.log("playerLeftGame", game);
        setTable(game);

        blockAll();

        let playerTurnUserId = game.playerTurn.userId;
        dispatch(setTurnPlayerId([playerTurnUserId]));
        let timeout = setTimeout(() => {
          if (playerTurnUserId === mainPlayerUserId) {
            unblockAll();
          } else {
            dispatch(unblockPlayCard());
          }
        }, 4000);

        dispatch(setTimeoutId(timeout));
        console.log("playerLeftGame timeout id: ", timeout);
      });

      return () => {
        connection.off("playerLeftGame");
      };
    }
  }, [connection, mainPlayerUserId, turnPlayerId, timeoutId]);

  useEffect(() => {
    if (connection) {
      connection.on("start", (game) => {
        dispatch(clearCheatArray());
        console.log(game);
        setStarted(true);
        setCards(game);
        dispatch(unsetGameEnding());
        dispatch(clearPenaltyCard());
        dispatch(setStartAction(true));
        console.log(game.gameResult);
        if (game.gameResult) {
          dispatch(setLeftPlayerPoints([game.gameResult[leftPlayerName]]));
          dispatch(setTopPlayerPoints([game.gameResult[topPlayerName]]));
          dispatch(setRightPlayerPoints([game.gameResult[rightPlayerName]]));
          dispatch(setMainPlayerPoints([game.gameResult[mainPlayerName]]));
        }
        let playerTurnUserId = game.playerTurn.userId;
        dispatch(setTurnPlayerId([playerTurnUserId]));
        setTimeout(() => {
          dispatch(setStartAction(false));
          dispatch(setStartFlag(true));
          setTimeout(() => {
            dispatch(clearCheatArray());
            if (playerTurnUserId === mainPlayerUserId) {
              unblockAll();
            } else {
              blockAll();
              dispatch(unblockPlayCard());
            }
          }, 5000);
        }, 8000);
      });

      return () => {
        connection.off("start");
      };
    }
  }, [
    connection,
    leftPlayerName,
    topPlayerName,
    rightPlayerName,
    mainPlayerName,
    mainPlayerUserId,
  ]);

  useEffect(() => {
    if (startFlag) {
      if (
        startArray.at(-2).text &&
        startArray.at(-2).suit &&
        startArray.at(-1).text &&
        startArray.at(-1).suit
      ) {
        dispatch(addToCheatArray(startArray.at(-2)));
        dispatch(addToCheatArray(startArray.at(-1)));
      } else {
        dispatch(addToCheatArray(mainPlayerCards[0]));
        dispatch(addToCheatArray(mainPlayerCards[1]));
      }
      dispatch(clearStartArray());
      dispatch(setStartFlag(false));
    }
  }, [startFlag]);

  useEffect(() => {
    if (connection) {
      connection.on("playerPlayedCard", (player, card, game) => {
        dispatch(clearCheatArray());
        clearTimeout(timeoutId);
        dispatch(clearPenaltyCard());
        blockAll();
        console.log("playerPlayedCard CLEARS timeout id: ", timeoutId);
        console.log("playerPlayedCard", player, card, game);

        if (player.userId === mainPlayerUserId) {
          setPlayAnimation([1, card.text, card.suit]);
        } else if (player.userId === leftPlayerUserId) {
          setPlayAnimation([2, card.text, card.suit]);
        } else if (player.userId === topPlayerUserId) {
          setPlayAnimation([3, card.text, card.suit]);
        } else if (player.userId === rightPlayerUserId) {
          setPlayAnimation([4, card.text, card.suit]);
        }

        setTimeout(() => {
          setPlayAnimation(["", "", ""]);
          setCards(game);
          let playerTurnUserId = game.playerTurn.userId;
          dispatch(setTurnPlayerId([playerTurnUserId]));
          let timeout = setTimeout(() => {
            if (playerTurnUserId === mainPlayerUserId) {
              unblockAll();
            } else {
              dispatch(unblockPlayCard());
            }
          }, 3000);
          console.log("playerPlayedCard timeout id: ", timeout);
          dispatch(setTimeoutId(timeout));
        }, 1000);
      });

      return () => {
        connection.off("playerPlayedCard");
      };
    }
  }, [connection, mainPlayerUserId, timeoutId]);

  useEffect(() => {
    if (connection) {
      connection.on(
        "playerTookCard",
        (player, card, game, from) => {
          dispatch(clearCheatArray());
          console.log("playerTookCard", player, card, game);
          clearTimeout(timeoutId);
          dispatch(clearPenaltyCard());

          if(from === "stack"){
            if (player.userId === mainPlayerUserId) {
              setStackAnimation(1);
            } else if (player.userId === leftPlayerUserId) {
              setStackAnimation(2);
            } else if (player.userId === topPlayerUserId) {
              setStackAnimation(3);
            } else if (player.userId === rightPlayerUserId) {
              setStackAnimation(4);
            }
          }
          else if(from === "dealer"){
            if (player.userId === mainPlayerUserId) {
              setDealerAnimation(1);
            } else if (player.userId === leftPlayerUserId) {
              setDealerAnimation(2);
            } else if (player.userId === topPlayerUserId) {
              setDealerAnimation(3);
            } else if (player.userId === rightPlayerUserId) {
              setDealerAnimation(4);
            }
          }

          setTimeout(() => {
            if (player.id === mainPlayerGameId) {
              dispatch(addToCheatArray(card));
              if (from === "stack") {
                dispatch(setPenaltyCard([card]));
              }
            }
            console.log("playerTookCard CLEARS timeout id: ", timeoutId);
            setCards(game);
            blockAll();
            if (turnPlayerId === mainPlayerUserId) {
              dispatch(unblockPlayCard());
            }
            let playerTurnUserId = game.playerTurn.userId;
            dispatch(setTurnPlayerId([playerTurnUserId]));
            let timeout = setTimeout(() => {
              if (playerTurnUserId === mainPlayerUserId) {
                unblockAll();
              } else {
                dispatch(unblockPlayCard());
              }
              dispatch(clearCheatArray());
            }, 3000);

            dispatch(setTimeoutId(timeout));
            console.log("playerTookCard timeout id: ", timeout);
          }, 1000);
        }
      );

      return () => {
        connection.off("playerTookCard");
      };
    }
  }, [connection, mainPlayerGameId, turnPlayerId, timeoutId]);

  useEffect(() => {
    if (connection) {
      connection.on("playerPenalty", (player, card, pCard, game) => {
        dispatch(clearCheatArray());
        console.log("playerPenalty", player, card, pCard, game);
        clearTimeout(timeoutId);
        console.log("playerPenalty CLEARS timeout id: ", timeoutId);
        blockAll();
        setStackAnimation(5);
        setTimeout(() => {
          setStackAnimation(0);
          setCards(game);
          let playerTurnUserId = game.playerTurn.userId;
          if (player.id === mainPlayerGameId) {
            dispatch(setPenaltyCard([pCard]));
            dispatch(addToCheatArray(card));
            dispatch(addToCheatArray(pCard));
            if (playerTurnUserId === mainPlayerUserId) {
              let timeout = setTimeout(() => {
                unblockAll();
                dispatch(clearCheatArray());
              }, 5000);
              dispatch(setTimeoutId(timeout));
              console.log("playerPenalty timeout id: ", timeout);
            } else {
              let timeout = setTimeout(() => {
                dispatch(unblockPlayCard());
                dispatch(clearCheatArray());
              }, 5000);
              dispatch(setTimeoutId(timeout));
              console.log("playerPenalty timeout id: ", timeout);
            }
          } else {
            if (playerTurnUserId === mainPlayerUserId) {
              let timeout = setTimeout(() => {
                unblockAll();
                dispatch(clearCheatArray());
              }, 2000);
              dispatch(setTimeoutId(timeout));
              console.log("playerPenalty timeout id: ", timeout);
            } else {
              let timeout = setTimeout(() => {
                dispatch(unblockPlayCard());
                dispatch(clearCheatArray());
              }, 2000);
              dispatch(setTimeoutId(timeout));
              console.log("playerPenalty timeout id: ", timeout);
            }
          }
        }, 1000);
      });

      return () => {
        connection.off("playerPenalty");
      };
    }
  }, [connection, mainPlayerGameId, turnPlayerId, timeoutId]);

  useEffect(() => {
    if (connection) {
      connection.on("playerPlayedSpecialCard", (player, card, game) => {
        dispatch(clearCheatArray());
        console.log("playerPlayedSpecialCard", player, card, game);
        clearTimeout(timeoutId);
        dispatch(clearPenaltyCard());
        console.log("playerPlayedSpecialCard clears timeout id: ", timeoutId);

        let playerTurnUserId = game.playerTurn.userId;
        blockAll();

        if (player.userId === mainPlayerUserId) {
          setPlayAnimation([1, card.text, card.suit]);
        } else if (player.userId === leftPlayerUserId) {
          setPlayAnimation([2, card.text, card.suit]);
        } else if (player.userId === topPlayerUserId) {
          setPlayAnimation([3, card.text, card.suit]);
        } else if (player.userId === rightPlayerUserId) {
          setPlayAnimation([4, card.text, card.suit]);
        }
        setTimeout(() => {
          setCards(game);
          if (player.id === mainPlayerGameId) {
            if (card.text === "Jack") {
              dispatch(setJackAction(true));
              dispatch(setJack(card));
              let timeout = setTimeout(() => {
                dispatch(setJackAction(false));
                dispatch(setJackFlag(false));
                dispatch(clearJackArray());
                dispatch(setJack(""));
                if (playerTurnUserId === mainPlayerUserId) {
                  unblockAll();
                } else {
                  blockAll();
                  dispatch(unblockPlayCard());
                }
              }, 10000);

              dispatch(setTimeoutId(timeout));
              console.log("playerPlayedSpecialCard timeout id: ", timeout);
            } else if (card.text === "Queen") {
              dispatch(setQueenAction(true));
              dispatch(setQueen(card));
              let timeout = setTimeout(() => {
                dispatch(setQueenAction(false));
                dispatch(setQueenFlag(false));
                dispatch(clearQueenArray());
                dispatch(setQueen(""));
                if (playerTurnUserId === mainPlayerUserId) {
                  unblockAll();
                } else {
                  blockAll();
                  dispatch(unblockPlayCard());
                }
              }, 10000);

              dispatch(setTimeoutId(timeout));
              console.log("playerPlayedSpecialCard timeout id: ", timeout);
            } else {
              let timeout = setTimeout(() => {
                if (playerTurnUserId === mainPlayerUserId) {
                  unblockAll();
                } else {
                  dispatch(unblockPlayCard());
                }
              }, 2000);

              dispatch(setTimeoutId(timeout));

              console.log("playerPlayedSpecialCard timeout id: ", timeout);
            }
          } else {
            if (card.text === "Jack") {
              let timeout = setTimeout(() => {
                if (playerTurnUserId === mainPlayerUserId) {
                  unblockAll();
                } else {
                  dispatch(unblockPlayCard());
                }
              }, 10000);

              dispatch(setTimeoutId(timeout));
              console.log("playerPlayedSpecialCard timeout id: ", timeout);
            } else if (card.text === "Queen") {
              let timeout = setTimeout(() => {
                if (playerTurnUserId === mainPlayerUserId) {
                  unblockAll();
                } else {
                  dispatch(unblockPlayCard());
                }
              }, 10000);
              dispatch(setTimeoutId(timeout));
              console.log("playerPlayedSpecialCard timeout id: ", timeout);
            } else {
              let timeout = setTimeout(() => {
                if (playerTurnUserId === mainPlayerUserId) {
                  unblockAll();
                } else {
                  dispatch(unblockPlayCard());
                }
              }, 2000);

              dispatch(setTimeoutId(timeout));

              console.log("playerPlayedSpecialCard timeout id: ", timeout);
            }
          }
        }, 1000);
      });

      return () => {
        connection.off("playerPlayedSpecialCard");
      };
    }
  }, [connection, mainPlayerUserId, mainPlayerGameId, timeoutId]);

  useEffect(() => {
    if (connection && jackFlag) {
      console.log(
        "invoke playedSpecialCard ",
        jack,
        jackIdArray.slice(-2),
        jackCardArray.slice(-2)
      );
      connection.invoke(
        "PlayedSpecialCard",
        jack,
        jackIdArray.slice(-2),
        jackCardArray.slice(-2)
      );
      console.log("clear jack timeout id:", timeoutId);
      clearTimeout(timeoutId);
      dispatch(setJackFlag(false));
      dispatch(setJackAction(false));
      dispatch(clearJackArray());
      dispatch(setJack(""));
      dispatch(setTimeoutId(0));
    }
  }, [connection, jackFlag]);

  useEffect(() => {
    if (connection && queenFlag) {
      console.log(
        "invoke playedSpecialCard ",
        queen,
        queenIdArray.slice(-1),
        queenCardArray.slice(-1)
      );
      connection.invoke(
        "PlayedSpecialCard",
        queen,
        queenIdArray.slice(-1),
        queenCardArray.slice(-1)
      );
      console.log("clear queen timeout id:", timeoutId);
      clearTimeout(timeoutId);
      dispatch(setQueenFlag(false));
      dispatch(setQueenAction(false));
      dispatch(clearQueenArray());
      dispatch(setQueen(""));
      dispatch(setTimeoutId(0));
    }
  }, [connection, queenFlag]);

  useEffect(() => {
    if (connection) {
      connection.on(
        "applySpecialCardEffect",
        (card, player, game, playerList, cards) => {
          dispatch(clearCheatArray());
          clearTimeout(timeoutId);
          dispatch(clearPenaltyCard());
          console.log("applySpecialCardEffect clears timeout id: ", timeoutId);
          blockAll();
          let playerTurnUserId = game.playerTurn.userId;
          if (card.text === "Jack") {
            console.log("applySpecialCardEffect", card, player, game);
            setJackAnimation([
              true,
              cards[0].text,
              cards[0].suit,
              cards[1].text,
              cards[1].suit,
            ]);
            console.log("no to cyk: ", [
              true,
              cards[0].text,
              cards[0].suit,
              cards[1].text,
              cards[1].suit,
            ]);
            setTimeout(() => {
              setJackAnimation(["", "", "", "", ""]);
              setCards(game);
              if (playerTurnUserId === mainPlayerUserId) {
                let timeout = setTimeout(() => {
                  unblockAll();
                }, 3000);
                dispatch(setTimeoutId(timeout));
                console.log("applySpecialCardEffect timeout id: ", timeout);
              } else {
                let timeout = setTimeout(() => {
                  dispatch(unblockPlayCard());
                }, 3000);
                dispatch(setTimeoutId(timeout));
                console.log("applySpecialCardEffect timeout id: ", timeout);
              }
            }, 1000);
          } else if (card.text === "Queen") {
            console.log("applySpecialCardEffect", card, player, game);
            setCards(game);
            dispatch(addToCheatArray(cards[0]));
            if (playerTurnUserId === mainPlayerUserId) {
              let timeout = setTimeout(() => {
                unblockAll();
                dispatch(clearCheatArray());
              }, 5000);
              dispatch(setTimeoutId(timeout));
              console.log("applySpecialCardEffect timeout id: ", timeout);
            } else {
              let timeout = setTimeout(() => {
                dispatch(unblockPlayCard());
                dispatch(clearCheatArray());
              }, 5000);
              dispatch(setTimeoutId(timeout));
              console.log("applySpecialCardEffect timeout id: ", timeout);
            }
          } else {
            if (playerTurnUserId === mainPlayerUserId) {
              let timeout = setTimeout(() => {
                unblockAll();
              }, 3000);
              dispatch(setTimeoutId(timeout));
              console.log("applySpecialCardEffect timeout id: ", timeout);
            } else {
              let timeout = setTimeout(() => {
                dispatch(unblockPlayCard());
              }, 3000);
              dispatch(setTimeoutId(timeout));
              console.log("applySpecialCardEffect timeout id: ", timeout);
            }
          }
        }
      );

      return () => {
        connection.off("applySpecialCardEffect");
      };
    }
  }, [connection, mainPlayerUserId, timeoutId]);

  return (
    <div className="game-table-container">
      {showRoundResults && (
        <div className="dim-screen">
          <div className="results-wrapper">
            <Results roundResults={roundResults} />
          </div>
        </div>
      )}
      {showGameResults && (
        <div className="dim-screen">
          <div className="results-wrapper">
            <GameResults
              gameResults={gameResults}
              setGo={props.setGo}
              handleExitGame={closeConnection}
            />
          </div>
        </div>
      )}
      <div className="game-table">
        <div className="game-table-grid">
          <div className="left-player">
            <div className="left-player-info-box">
              <div className="game-ranking-box">
                <div
                  className={`gdnb-ranking ${
                    leftPlayerRanking > 4000
                      ? "high"
                      : leftPlayerRanking > 3000
                      ? "medium-high"
                      : leftPlayerRanking > 2000
                      ? "medium"
                      : leftPlayerRanking > 1000
                      ? "medium-low"
                      : "low"
                  }`}
                >
                  {leftPlayerRanking}
                </div>
              </div>
              <div
                className={`left-player-avatar-box ${
                  leftPlayerRanking > 4000
                    ? "high-border"
                    : leftPlayerRanking > 3000
                    ? "medium-high-border"
                    : leftPlayerRanking > 2000
                    ? "medium-border"
                    : leftPlayerRanking > 1000
                    ? "medium-low-border"
                    : leftPlayerRanking > 1
                    ? "low-border"
                    : ""
                }${turnPlayerId == leftPlayerUserId ? " active-bg" : ""}`}
              >
                {leftPlayerUserId ? (
                  <div
                    className="image-source"
                    style={{
                      backgroundImage: "url(" + leftBackgroundUrl + ")",
                    }}
                  ></div>
                ) : (
                  <div className="image-source"></div>
                )}
              </div>
              <div
                className={`game-player-name ${
                  turnPlayerId == leftPlayerUserId ? "active-turn" : ""
                }`}
              >
                {leftPlayerName}
              </div>
              <div
                className={`game-player-points ${
                  turnPlayerId == leftPlayerUserId ? "active-turn" : ""
                }`}
              >
                {leftPlayerPoints}
              </div>
            </div>
            <div className="left-player-cards-box">
              <div className="left-cards">
                {leftPlayerCards &&
                  leftPlayerCards.map((card, i) => (
                    <div
                      onClick={
                        jackAction
                          ? () =>
                              handleJackClick(leftPlayerGameId, {
                                text: card.text,
                                suit: card.suit,
                                isSpecial: card.isSpecial,
                              })
                          : queenAction
                          ? () =>
                              handleQueenClick(leftPlayerGameId, {
                                text: card.text,
                                suit: card.suit,
                                isSpecial: card.isSpecial,
                              })
                          : () => {}
                      }
                      className={`${
                        jackCardArray.at(-1).text === card.text &&
                        jackCardArray.at(-1).suit === card.suit
                          ? "active-special-card"
                          : jackCardArray.at(-2).text === card.text &&
                            jackCardArray.at(-2).suit === card.suit
                          ? "active-special-card"
                          : queenCardArray.at(-1).text === card.text &&
                            queenCardArray.at(-1).suit === card.suit
                          ? "active-special-card"
                          : ""
                      } ${jackAction || queenAction ? "clickable" : ""}`}
                    >
                      <Card
                        cheat={
                          cheat
                            ? true
                            : cheatArray.at(-1).text === card.text &&
                              cheatArray.at(-1).suit === card.suit
                            ? true
                            : cheatArray.at(-2).text === card.text &&
                              cheatArray.at(-2).suit === card.suit
                            ? true
                            : false
                        }
                        value={card.text}
                        suit={card.suit}
                        key={i + card.text + card.suit}
                        onAnimationEnd={() =>
                          setJackAnimation(["", "", "", "", ""])
                        }
                        jackAnimation={
                          jackAnimation[0] &&
                          ((card.text === jackAnimation[1] &&
                            card.suit === jackAnimation[2]) ||
                            (card.text === jackAnimation[3] &&
                              card.suit === jackAnimation[4]))
                            ? 1
                            : 0
                        }
                        playAnimation={
                          playAnimation[0] === 2 &&
                          card.text === playAnimation[1] &&
                          card.suit === playAnimation[2]
                            ? 2
                            : 0
                        }
                      ></Card>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="top-player">
            <div className="top-player-info-box">
              <div className="game-ranking-box">
                <div
                  className={`gdnb-ranking ${
                    topPlayerRanking > 4000
                      ? "high"
                      : topPlayerRanking > 3000
                      ? "medium-high"
                      : topPlayerRanking > 2000
                      ? "medium"
                      : topPlayerRanking > 1000
                      ? "medium-low"
                      : "low"
                  }`}
                >
                  {topPlayerRanking}
                </div>
              </div>
              <div
                className={`top-player-avatar-box ${
                  topPlayerRanking > 4000
                    ? "high-border"
                    : topPlayerRanking > 3000
                    ? "medium-high-border"
                    : topPlayerRanking > 2000
                    ? "medium-border"
                    : topPlayerRanking > 1000
                    ? "medium-low-border"
                    : topPlayerRanking > 1
                    ? "low-border"
                    : ""
                }${turnPlayerId == topPlayerUserId ? " active-bg" : ""}`}
              >
                {topPlayerUserId ? (
                  <div
                    className="image-source"
                    style={{
                      backgroundImage: "url(" + topBackgroundUrl + ")",
                    }}
                  ></div>
                ) : (
                  <div className="image-source"></div>
                )}
              </div>
              <div
                className={`game-player-name ${
                  turnPlayerId == topPlayerUserId ? "active-turn" : ""
                }`}
              >
                {topPlayerName}
              </div>
              <div
                className={`game-player-points ${
                  turnPlayerId == topPlayerUserId ? "active-turn" : ""
                }`}
              >
                {topPlayerPoints}
              </div>
            </div>
            <div className="top-player-cards-box">
              <div className="top-cards">
                {topPlayerCards &&
                  topPlayerCards.map((card, i) => (
                    <div
                      onClick={
                        jackAction
                          ? () =>
                              handleJackClick(topPlayerGameId, {
                                text: card.text,
                                suit: card.suit,
                                isSpecial: card.isSpecial,
                              })
                          : queenAction
                          ? () =>
                              handleQueenClick(topPlayerGameId, {
                                text: card.text,
                                suit: card.suit,
                                isSpecial: card.isSpecial,
                              })
                          : () => {}
                      }
                      className={`${
                        jackCardArray.at(-1).text === card.text &&
                        jackCardArray.at(-1).suit === card.suit
                          ? "active-special-card"
                          : jackCardArray.at(-2).text === card.text &&
                            jackCardArray.at(-2).suit === card.suit
                          ? "active-special-card"
                          : queenCardArray.at(-1).text === card.text &&
                            queenCardArray.at(-1).suit === card.suit
                          ? "active-special-card"
                          : ""
                      } ${jackAction || queenAction ? "clickable" : ""}`}
                    >
                      <Card
                        cheat={
                          cheat
                            ? true
                            : cheatArray.at(-1).text === card.text &&
                              cheatArray.at(-1).suit === card.suit
                            ? true
                            : cheatArray.at(-2).text === card.text &&
                              cheatArray.at(-2).suit === card.suit
                            ? true
                            : false
                        }
                        value={card.text}
                        suit={card.suit}
                        key={i + card.text + card.suit}
                        jackAnimation={
                          jackAnimation[0] &&
                          ((card.text === jackAnimation[1] &&
                            card.suit === jackAnimation[2]) ||
                            (card.text === jackAnimation[3] &&
                              card.suit === jackAnimation[4]))
                            ? 1
                            : 0
                        }
                        playAnimation={
                          playAnimation[0] === 3 &&
                          card.text === playAnimation[1] &&
                          card.suit === playAnimation[2]
                            ? 3
                            : 0
                        }
                      ></Card>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="right-player">
            <div className="right-player-info-box">
              <div className="game-ranking-box">
                <div
                  className={`gdnb-ranking ${
                    rightPlayerRanking > 4000
                      ? "high"
                      : rightPlayerRanking > 3000
                      ? "medium-high"
                      : rightPlayerRanking > 2000
                      ? "medium"
                      : rightPlayerRanking > 1000
                      ? "medium-low"
                      : "low"
                  }`}
                >
                  {rightPlayerRanking}
                </div>
              </div>
              <div
                className={`right-player-avatar-box ${
                  rightPlayerRanking > 4000
                    ? "high-border"
                    : rightPlayerRanking > 3000
                    ? "medium-high-border"
                    : rightPlayerRanking > 2000
                    ? "medium-border"
                    : rightPlayerRanking > 1000
                    ? "medium-low-border"
                    : rightPlayerRanking > 1
                    ? "low-border"
                    : ""
                }${turnPlayerId == rightPlayerUserId ? " active-bg" : ""}`}
              >
                {rightPlayerUserId ? (
                  <div
                    className="image-source"
                    style={{
                      backgroundImage: "url(" + rightBackgroundUrl + ")",
                    }}
                  ></div>
                ) : (
                  <div className="image-source"></div>
                )}
              </div>
              <div
                className={`game-player-name ${
                  turnPlayerId == rightPlayerUserId ? "active-turn" : ""
                }`}
              >
                {rightPlayerName}
              </div>

              <div
                className={`game-player-points ${
                  turnPlayerId == rightPlayerUserId ? "active-turn" : ""
                }`}
              >
                {rightPlayerPoints}
              </div>
            </div>
            <div className="right-player-cards-box">
              <div className="right-cards">
                {rightPlayerCards &&
                  rightPlayerCards.map((card, i) => (
                    <div
                      onClick={
                        jackAction
                          ? () =>
                              handleJackClick(rightPlayerGameId, {
                                text: card.text,
                                suit: card.suit,
                                isSpecial: card.isSpecial,
                              })
                          : queenAction
                          ? () =>
                              handleQueenClick(rightPlayerGameId, {
                                text: card.text,
                                suit: card.suit,
                                isSpecial: card.isSpecial,
                              })
                          : () => {}
                      }
                      className={`${
                        jackCardArray.at(-1).text === card.text &&
                        jackCardArray.at(-1).suit === card.suit
                          ? "active-special-card"
                          : jackCardArray.at(-2).text === card.text &&
                            jackCardArray.at(-2).suit === card.suit
                          ? "active-special-card"
                          : queenCardArray.at(-1).text === card.text &&
                            queenCardArray.at(-1).suit === card.suit
                          ? "active-special-card"
                          : ""
                      } ${jackAction || queenAction ? "clickable" : ""}`}
                    >
                      <Card
                        cheat={
                          cheat
                            ? true
                            : cheatArray.at(-1).text === card.text &&
                              cheatArray.at(-1).suit === card.suit
                            ? true
                            : cheatArray.at(-2).text === card.text &&
                              cheatArray.at(-2).suit === card.suit
                            ? true
                            : false
                        }
                        value={card.text}
                        suit={card.suit}
                        key={i + card.text + card.suit}
                        jackAnimation={
                          jackAnimation[0] &&
                          ((card.text === jackAnimation[1] &&
                            card.suit === jackAnimation[2]) ||
                            (card.text === jackAnimation[3] &&
                              card.suit === jackAnimation[4]))
                            ? 1
                            : 0
                        }
                        playAnimation={
                          playAnimation[0] === 4 &&
                          card.text === playAnimation[1] &&
                          card.suit === playAnimation[2]
                            ? 4
                            : 0
                        }
                      ></Card>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="middle">
            <div className="mid-card-box">
              {stackCard ? (
                <Card
                  cheat={true}
                  value={stackCard.text}
                  suit={stackCard.suit}
                  stackAnimation={stackAnimation}
                ></Card>
              ) : (
                <></>
              )}
            </div>
            <div className="get-mid-card-button-box">
              {started && sit && !lockGetFromStack ? (
                <Button variant="primary" onClick={() => handleGetCardStack()}>
                  Weź kartę
                </Button>
              ) : (
                started &&
                sit &&
                lockGetFromStack && (
                  <Button variant="primary" disabled={true}>
                    Weź kartę
                  </Button>
                )
              )}
            </div>
          </div>
          <div className="exit-game-box">
            <div className="leave-room">
              <Button
                variant="secondary"
                onClick={(e) => {
                  closeConnection();
                  props.setGo(!e);
                }}
              >
                Opuść stół
              </Button>
            </div>
          </div>
          <div className="main-player">
            <div className="main-player-grid">
              <div className="main-player-info-box">
                <div className="game-ranking-box">
                  <div
                    className={`gdnb-ranking ${
                      mainPlayerRanking > 4000
                        ? "high"
                        : mainPlayerRanking > 3000
                        ? "medium-high"
                        : mainPlayerRanking > 2000
                        ? "medium"
                        : mainPlayerRanking > 1000
                        ? "medium-low"
                        : "low"
                    }`}
                  >
                    {mainPlayerRanking}
                  </div>
                </div>
                <div
                  className={`main-player-avatar-box ${
                    mainPlayerRanking > 4000
                      ? "high-border"
                      : mainPlayerRanking > 3000
                      ? "medium-high-border"
                      : mainPlayerRanking > 2000
                      ? "medium-border"
                      : mainPlayerRanking > 1000
                      ? "medium-low-border"
                      : mainPlayerRanking > 1
                      ? "low-border"
                      : ""
                  } ${turnPlayerId == mainPlayerUserId ? "active-bg" : ""}`}
                >
                  {mainPlayerUserId ? (
                    <div
                      className="image-source"
                      style={{
                        backgroundImage: "url(" + mainBackgroundUrl + ")",
                      }}
                    ></div>
                  ) : (
                    <div className="image-source"></div>
                  )}
                </div>
                <div
                  className={`game-player-name ${
                    turnPlayerId == mainPlayerUserId ? "active-turn" : ""
                  }`}
                >
                  {mainPlayerName}
                </div>
                <div
                  className={`main-game-player-points ${
                    turnPlayerId == mainPlayerUserId ? "active-turn" : ""
                  }`}
                >
                  {mainPlayerPoints}
                </div>
              </div>
              <div className="end-game-box">
                {started && sit && !lockEndGame && !gameEnding ? (
                  <Button variant="secondary" onClick={() => handleEndGame()}>
                    Koniec rundy
                  </Button>
                ) : started && sit && lockEndGame && !gameEnding ? (
                  <Button variant="secondary" disabled={true}>
                    Koniec rundy
                  </Button>
                ) : (
                  started &&
                  sit &&
                  gameEnding && (
                    <Button variant="secondary" disabled={true}>
                      Runda się kończy
                    </Button>
                  )
                )}
              </div>
              <div className="stack-box">
                {started && <Card dealerAnimation={dealerAnimation}></Card>}
              </div>
              <div className="get-stack-button-box">
                {started && sit && !lockGetFromDealer ? (
                  <Button
                    variant="primary"
                    onClick={() => handleGetCardDealer()}
                  >
                    Weź kartę
                  </Button>
                ) : (
                  started &&
                  sit &&
                  lockGetFromDealer && (
                    <Button variant="primary" disabled={true}>
                      Weź kartę
                    </Button>
                  )
                )}
              </div>
              <div className="main-player-cards-box">
                <div className="main-cards">
                  {mainPlayerCards &&
                    mainPlayerCards.map((card, i) => (
                      <div
                        onClick={
                          startAction
                            ? () =>
                                handleStartClick({
                                  text: card.text,
                                  suit: card.suit,
                                  isSpecial: card.isSpecial,
                                })
                            : jackAction
                            ? () =>
                                handleJackClick(mainPlayerGameId, {
                                  text: card.text,
                                  suit: card.suit,
                                  isSpecial: card.isSpecial,
                                })
                            : queenAction
                            ? () =>
                                handleQueenClick(mainPlayerGameId, {
                                  text: card.text,
                                  suit: card.suit,
                                  isSpecial: card.isSpecial,
                                })
                            : () =>
                                handleSetActiveCard({
                                  text: card.text,
                                  suit: card.suit,
                                  isSpecial: card.isSpecial,
                                })
                        }
                        className={`${
                          activeCard.text === card.text &&
                          activeCard.suit === card.suit
                            ? "active-card"
                            : jackCardArray.at(-1).text === card.text &&
                              jackCardArray.at(-1).suit === card.suit
                            ? "active-special-card"
                            : jackCardArray.at(-2).text === card.text &&
                              jackCardArray.at(-2).suit === card.suit
                            ? "active-special-card"
                            : startArray.at(-1).text === card.text &&
                              startArray.at(-1).suit === card.suit
                            ? "active-special-card"
                            : startArray.at(-2).text === card.text &&
                              startArray.at(-2).suit === card.suit
                            ? "active-special-card"
                            : queenCardArray.at(-1).text === card.text &&
                              queenCardArray.at(-1).suit === card.suit
                            ? "active-special-card"
                            : ""
                        }`}
                      >
                        <Card
                          cheat={
                            cheat
                              ? true
                              : cheatArray.at(-1).text === card.text &&
                                cheatArray.at(-1).suit === card.suit
                              ? true
                              : cheatArray.at(-2).text === card.text &&
                                cheatArray.at(-2).suit === card.suit
                              ? true
                              : false
                          }
                          value={card.text}
                          suit={card.suit}
                          key={i + card.text + card.suit}
                          jackAnimation={
                            jackAnimation[0] &&
                            ((card.text === jackAnimation[1] &&
                              card.suit === jackAnimation[2]) ||
                              (card.text === jackAnimation[3] &&
                                card.suit === jackAnimation[4]))
                              ? 1
                              : 0
                          }
                          playAnimation={
                            playAnimation[0] === 1 &&
                            card.text === playAnimation[1] &&
                            card.suit === playAnimation[2]
                              ? 1
                              : 0
                          }
                        ></Card>
                      </div>
                    ))}
                </div>
              </div>
              <div className="play-card-box">
                {jackAction && jackCardArray.length > 3 ? (
                  <Button
                    onClick={() => {
                      handleJackEffect();
                    }}
                    variant="secondary"
                  >
                    Zamień karty
                  </Button>
                ) : jackAction && jackCardArray.length < 4 ? (
                  <Button variant="secondary" disabled={true}>
                    Wybierz karty do zamiany
                  </Button>
                ) : queenAction && queenCardArray.length > 2 ? (
                  <Button
                    onClick={() => {
                      handleQueenEffect();
                    }}
                    variant="secondary"
                  >
                    Pokaż kartę
                  </Button>
                ) : queenAction && queenCardArray.length < 3 ? (
                  <Button variant="secondary" disabled={true}>
                    Wybierz kartę do odkrycia
                  </Button>
                ) : lockPlayCard && started && sit ? (
                  <Button variant="secondary" disabled={true}>
                    Zagraj kartę
                  </Button>
                ) : !sit ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      takePlace();
                    }}
                  >
                    Zajmij miejsce
                  </Button>
                ) : !started && sit ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      leavePlace();
                    }}
                  >
                    Zwolnij miejsce
                  </Button>
                ) : started && !sit ? (
                  <></>
                ) : !activeCard && started && sit ? (
                  <Button variant="secondary" disabled={true}>
                    Wybierz kartę
                  </Button>
                ) : activeCard.text === penaltyCard.text &&
                  activeCard.suit === penaltyCard.suit ? (
                  <Button variant="secondary" disabled={true}>
                    Nie możesz zagrać teraz tej karty
                  </Button>
                ) : (
                  activeCard &&
                  started &&
                  sit && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        handlePlayCard();
                      }}
                    >
                      Zagraj kartę
                    </Button>
                  )
                )}
                <Button
                  style={{ color: "blue" }}
                  variant="outlined primary"
                  onClick={handleCheatCode}
                >
                  Cheat
                </Button>
              </div>
            </div>
          </div>
          <div className="game-chat-box">
            <Chat
              sendMessage={sendMessage}
              messages={messages}
              closeConnection={closeConnection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTable;
