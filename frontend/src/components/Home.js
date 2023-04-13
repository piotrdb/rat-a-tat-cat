import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../custom.scss";
import { ButtonGroup, ToggleButton, Button } from "react-bootstrap";
import Login from "./Login.js";
import Register from "./Register.js";
import CloseButton from "react-bootstrap/CloseButton";
import Boards from "./Boards.js";
import HeaderBar from "./HeaderBar.js";
import GameTable from "./GameTable.js";
import NewBoard from "./NewBoard.js";
import { clearMessage } from "../slices/message";
// import { getBoards } from "../slices/boards";
import { getUserCredentials } from "../slices/userCredentials";
import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";
import { create } from "yup/lib/Reference";
import { clearPlayers } from "../slices/game";

const Home = () => {
  const dispatch = useDispatch();
  //REDUX STATES
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { inGame } = useSelector((state) => state.game.inGame);
  const username = useSelector((state) => state.userCredentials.userName);
  const displayName = useSelector((state) => state.userCredentials.displayName);
  const userId = useSelector((state) => state.userCredentials.userId);
  //COMPONENT STATES
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(true);
  const [showRegisterButton, setShowRegisterButton] = useState(true);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [go, setGo] = useState(false);
  const [currentBoardId, setCurrentBoardId] = useState(0);
  const [currentBoardMode, setCurrentBoardMode] = useState(0);
  const [currentBoardType, setCurrentBoardType] = useState(0);
  const [connection, setConnection] = useState(null);

  const [ranked, setRanked] = useState(true);
  const [casual, setCasual] = useState(true);
  const [freePlaces, setFreePlaces] = useState(1);
  const [sorting, setSorting] = useState(0);

  useEffect(() => {
    dispatch(getUserCredentials());
  }, []);

  useEffect(() => {
    if (!go) {
      dispatch(clearPlayers);
    }
  }, [go]);

  const handleLoginClick = () => {
    setShowLogin((showLogin) => !showLogin);
    setShowLoginButton((showLoginButton) => !showLoginButton);
    setShowRegisterButton((showRegisterButton) => !showRegisterButton);
  };

  const handleRegisterClick = () => {
    setShowRegister((showRegister) => !showRegister);
    setShowLoginButton((showLoginButton) => !showLoginButton);
    setShowRegisterButton((showRegisterButton) => !showRegisterButton);
  };

  const handleExitButton = () => {
    setShowLogin((showLogin) => false);
    setShowRegister((showRegister) => false);
    setShowLoginButton((showLoginButton) => true);
    setShowRegisterButton((showRegisterButton) => true);
  };

  const handleGo = (id, mode, type) => {
    setCurrentBoardId((currentBoardId) => id);
    setCurrentBoardMode((currentBoardMode) => mode);
    setCurrentBoardType((currentBoardType) => type);
    setGo(!go);
    setShowCreateBoard((showCreateBoard) => false);
    // if (!go) {
    //   dispatch(clearPlayers);
    // }
  };

  const handleShowCreateBoard = () => {
    setShowCreateBoard((showCreateBoard) => true);
  };

  const handleExitCreateBoard = () => {
    setShowCreateBoard((showCreateBoard) => false);
    dispatch(clearMessage());
  };

  const handleFreePlaces = () => {
    setFreePlaces((freePlaces) => !freePlaces);
  };

  const handleCasual = () => {
    if (ranked === false && casual === true) {
      setRanked((casual) => !casual);
      setCasual((ranked) => !ranked);
    }
    else {
      setCasual((casual) => !casual);
    }
  };

  const handleRanked = () => {
    if (casual === false && ranked === true) {
      setRanked((ranked) => !ranked);
      setCasual((casual) => !casual);
    }
    else {
      setRanked((ranked) => !ranked);
    }
  };

  const handleSorting = () => {
    if (sorting === 0) {
      setSorting((sorting) => 1);
    } else if (sorting === 1) {
      setSorting((sorting) => 0);
    }
  };

  return (
    <div className="cards-bg">
      {!isLoggedIn ? (
        <div className="home-wrapper">
          <div className="home-container">
            <div className="home-logo"></div>
            <div className="buttons-wrapper">
              {showLogin || showRegister ? (
                <div className="x-holder">
                  <CloseButton variant="white" onClick={handleExitButton} />
                </div>
              ) : (
                <div />
              )}
              <div className="home-buttons-container">
                {showLogin && <Login></Login>}
                {showRegister && <Register></Register>}
                {showLoginButton && (
                  <Button variant="primary" onClick={handleLoginClick}>
                    Zaloguj się
                  </Button>
                )}
                {showRegisterButton && (
                  <Button variant="secondary" onClick={handleRegisterClick}>
                    Utwórz nowe konto
                  </Button>
                )}
                <div />
              </div>
            </div>
          </div>
        </div>
      ) : // ) : isLoggedIn && loading ? (
      // <span className="board-loader spinner-border spinner-border-sm"></span>
      isLoggedIn && !inGame && !go ? (
        <>
          <HeaderBar
            username={displayName}
            userId={userId}
            setGo={setGo}
            game={false}
          ></HeaderBar>
          <div className="home-boards-bg">
            <div className="home-boards-title">stoły</div>
            <div className="home-boards-container">
              <Button
                variant="outline-primary"
                className="home-board-fliter filter"
                onClick={handleFreePlaces}
                checked={freePlaces}
                active={freePlaces}
              >
                Wolne miejsca
              </Button>
              <Button
                variant="outline-primary"
                className="home-board-fliter filter"
                onClick={handleCasual}
                checked={casual}
                active={casual}
              >
                Nierankingowe
              </Button>
              <Button
                variant="outline-primary"
                className="home-board-fliter filter"
                onClick={handleRanked}
                checked={ranked}
                active={ranked}
              >
                Rankingowe
              </Button>
              <Button
                variant="outline-primary"
                className="home-board-fliter filter"
                onClick={handleSorting}
                active={true}
              >
                Sortowanie: {sorting === 0 ? "ID" : "Nazwa"}
              </Button>
              <Button
                variant="secondary"
                className="home-board-fliter"
                onClick={handleShowCreateBoard}
              >
                Stwórz nową grę
              </Button>
              <Boards
                handleGo={handleGo}
                ranked={ranked}
                casual={casual}
                freePlaces={freePlaces}
                sorting={sorting}
              ></Boards>
            </div>
          </div>
          {showCreateBoard && !go && (
            <div className="dim-screen">
              <div className="new-board-wrapper">
                <div className="new-board-x-holder">
                  <CloseButton
                    variant="white"
                    onClick={handleExitCreateBoard}
                  />
                </div>
                <NewBoard
                  connection={connection}
                  handleGo={handleGo}
                ></NewBoard>
              </div>
            </div>
          )}
        </>
      ) : (
        go && (
          <>
            <HeaderBar
              setGo={setGo}
              username={displayName}
              game={true}
              userId={userId}
            ></HeaderBar>
            <GameTable
              setGo={setGo}
              username={username}
              boardId={currentBoardId}
              boardMode={currentBoardMode}
              boardType={currentBoardType}
            ></GameTable>
          </>
        )
      )}
    </div>
  );
};

export default Home;
