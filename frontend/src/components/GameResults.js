import GameResult from "./GameResult";
import { Button } from "react-bootstrap";

const GameResults = (props) => {
  console.log("GAME RESULTS PROPS");
  console.log(props);
  const results = [];

  if (props.gameResults.length > 1) {
    console.log("props are there:", props.gameResults);
    if(Object.keys(props.gameResults[2]).length > 0){
      console.log("ranked game");
    for (const [key, value] of Object.entries(props.gameResults[0])) {
      results.push({
        displayName: key,
        points: value,
        oldRanking: props.gameResults[1][key],
        newRanking: props.gameResults[2][key]["item1"],
      });
    }
  }
  
    if(Object.keys(props.gameResults[2]).length < 1){
      console.log("unranked game");
      for (const [key, value] of Object.entries(props.gameResults[0])) {
        results.push({
          displayName: key,
          points: value,
          oldRanking: props.gameResults[1][key],
          newRanking: props.gameResults[1][key],
        });
      }
    }

    results.sort((x, y) => (x.points > y.points ? 1 : -1));
    console.log("results:" + results);
  }

  return (
    <div className="game-results-wrapper">
      <div className="game-results-box">
        <div className="game-results-label-grid">
          <div className="game-results-label">
            <div className="label-text">miejsce</div>
          </div>
          <div className="game-results-label">
            <div className="label-text">gracz</div>
          </div>
          <div className="game-results-label">
            <div className="label-text">punkty</div>
          </div>
          <div className="game-results-label">
            <div className="label-text">ranking</div>
          </div>
          <div className="game-results-label">
            <div className="label-text">zmiana</div>
          </div>
          <div className="game-results-label">
            <div className="label-text">nowy</div>
          </div>
        </div>
        <div className="game-results-container">
          {results.map((row, index) => (
            <GameResult
              pos={index + 1}
              name={row.displayName}
              points={row.points}
              oldRanking={row.oldRanking}
              newRanking={row.newRanking}
            />
          ))}
          <Button
            id="leave"
            variant="secondary"
            onClick={(e) => {
              props.setGo(!e);
              props.handleExitGame();
            }}
          >
            Wyjdź
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameResults;
