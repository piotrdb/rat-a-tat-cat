import React, { useState, useEffect } from "react";
import Board from "./Board.js";
import { clearMessage } from "../slices/message";
import { getBoards, clearBoards } from "../slices/boards";
import { useDispatch, useSelector } from "react-redux";
import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";

const Boards = (props) => {
  const dispatch = useDispatch();
  const { boards } = useSelector((state) => state.boards);
  // const inGame = useSelector((state) => state.game.inGame);
  const [connection, setConnection] = useState(null);
  const [sortedBoards, setSortedBoards] = useState([]);

  useEffect(() => {
    dispatch(clearMessage());
    dispatch(getBoards())
      .unwrap()
      .then(() => {})
      .catch(() => {});

    const connection = new HubConnectionBuilder()
      .withUrl("https://ratsapi.online/BoardHub", {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(connection);
    if (connection) {
      connection.start().then((result) => {});
    }

    connection.on("refreshBoards", () => {
      console.log("refresh Boards");
      dispatch(getBoards());
    });

    return () => {
      connection.stop();
    };
  }, []);

  useEffect(() => {
    if (boards) {
      let sortedBoards = [...boards];
      if (props.sorting === 0) {
        console.log(props.sorting);
        sortedBoards = sortedBoards.sort((s1, s2) => {
          return s1.boardId - s2.boardId;
        });
      } else if (props.sorting === 1) {
        console.log(props.sorting);
        setSortedBoards(
          sortedBoards.sort(function (a, b) {
            const nameA = a.boardName.toUpperCase();
            const nameB = b.boardName.toUpperCase();
            if (nameA > nameB) {
              return 1;
            }
            if (nameA < nameB) {
              return -1;
            }
            return 0;
          })
        );
      }
      setSortedBoards(sortedBoards);
    }
  }, [props.sorting, boards]);

  return (
    <>
      {sortedBoards ? (
        sortedBoards.map((item, i) =>
          props.freePlaces && Object.keys(item.players).length < 4
            ? item.boardType === 1
              ? props.casual && (
                  <div
                    onClick={(e) =>
                      props.handleGo(
                        item.boardId,
                        item.boardMode,
                        item.boardType,
                        e
                      )
                    }
                  >
                    <Board
                      key={Date.now() * Math.random()}
                      iterator={i}
                      id={item.boardId}
                      boardName={item.boardName}
                      boardMode={item.boardMode}
                      boardType={item.boardType}
                      players={item.players}
                    ></Board>
                  </div>
                )
              : item.boardType === 2 &&
                props.ranked && (
                  <div
                    onClick={(e) =>
                      props.handleGo(
                        item.boardId,
                        item.boardMode,
                        item.boardType,
                        e
                      )
                    }
                  >
                    <Board
                      key={Date.now() * Math.random()}
                      iterator={i}
                      id={item.boardId}
                      boardName={item.boardName}
                      boardMode={item.boardMode}
                      boardType={item.boardType}
                      players={item.players}
                    ></Board>
                  </div>
                )
            : !props.freePlaces &&
              (item.boardType === 1
                ? props.casual && (
                    <div
                      onClick={(e) =>
                        props.handleGo(
                          item.boardId,
                          item.boardMode,
                          item.boardType,
                          e
                        )
                      }
                    >
                      <Board
                        key={Date.now() * Math.random()}
                        iterator={i}
                        id={item.boardId}
                        boardName={item.boardName}
                        boardMode={item.boardMode}
                        boardType={item.boardType}
                        players={item.players}
                      ></Board>
                    </div>
                  )
                : item.boardType === 2 &&
                  props.ranked && (
                    <div
                      onClick={(e) =>
                        props.handleGo(
                          item.boardId,
                          item.boardMode,
                          item.boardType,
                          e
                        )
                      }
                    >
                      <Board
                        key={Date.now() * Math.random()}
                        iterator={i}
                        id={item.boardId}
                        boardName={item.boardName}
                        boardMode={item.boardMode}
                        boardType={item.boardType}
                        players={item.players}
                      ></Board>
                    </div>
                  ))
        )
      ) : (
        <span className="board-loader spinner-border spinner-border-sm"></span>
      )}
    </>
  );
};

export default Boards;
