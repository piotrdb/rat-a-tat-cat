import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Board = (props) => {
  // let plyers = useSelector(
  // (state) => state.boards.boards[props.iterator].players
  // );
  
  const [ranking, setRanking] = useState(0);
  const [len, setLen] = useState(0);
  let [players, setPlayers] = useState([]);

  // plyers = Object.keys(plyers);

  // let avgRanking = 0;
  // const sumValues = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);
  // if (Object.keys(props.players).length > 0) {
  //   avgRanking = sumValues(props.players) / Object.keys(props.players).length;
  // }

  useEffect(() => {
    let avgRanking = 0;
    let playersArray = [];
    const sumValues = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);
    if (Object.keys(props.players).length > 0) {
      avgRanking = sumValues(props.players) / Object.keys(props.players).length;
    }

      
      setRanking(Math.round(avgRanking));
      if (props.players) {
        Object.entries(props.players).forEach(([key, value]) => {
          playersArray.push(key);
        });
      }

      setLen(playersArray.length);
      setPlayers(playersArray);
  }, [props.players]);

  // useEffect(() => {
  //   if (props.players) {
  //     Object.entries(props.players).forEach(([key, value]) => {
  //       players.push([key, value]);
  //     });

  //     // setLen(players.length);
  //     // setRanking(Math.round(avgRanking));
  //     // setPlayers(players);
  //     // players = [];
  //   }
  // }, []);

  return (
    <div className="board-card">
      <div className="board-card-id">{props.id}</div>
      <div className="board-card-ranked">
        {props.boardType === 1 ? <>N</> : <>R</>}
      </div>
      <div className="board-card-ranking">
        {ranking > 4000 ? (
          <div className="card-ranking high">{ranking}</div>
        ) : ranking > 3000 ? (
          <div className="card-ranking medium-high">{ranking}</div>
        ) : ranking > 2000 ? (
          <div className="card-ranking medium">{ranking}</div>
        ) : ranking > 1000 ? (
          <div className="card-ranking medium-low">{ranking}</div>
        ) : (
          <div className="card-ranking low">{ranking}</div>
        )}
      </div>
      <div className="board-card-name">
        <div className="card-name">{props.boardName}</div>
      </div>
      <div className="board-card-icon-box">
        {props.boardMode === 1 ? (
          <div className="board-card-icon rat"></div>
        ) : props.boardMode === 2 ? (
          <div className="board-card-icon dragon"></div>
        ) : (
          <div className="board-card-icon raven"></div>
        )}
      </div>
      <div className="board-card-players">
        {players.map((player, i) => (
          <div className="player-name" key={i}>
            {player}
          </div>
        ))}
        {len === 3 && (
          <>
            <div className="player-name">-</div>
          </>
        )}
        {len === 2 && (
          <>
            <div className="player-name">-</div>
            <div className="player-name">-</div>
          </>
        )}
        {len === 1 && (
          <>
            <div className="player-name">-</div>
            <div className="player-name">-</div>
            <div className="player-name">-</div>
          </>
        )}
        {len === 0 && (
          <>
            <div className="player-name">-</div>
            <div className="player-name">-</div>
            <div className="player-name">-</div>
            <div className="player-name">-</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Board;
