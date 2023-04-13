import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { setMainPlayer, setRightPlayer } from "../slices/game";

const GameDisplay = (props) => {
  const mainPlayerName = useSelector((state) => state.game.mainPlayerName);
  const leftPlayerName = useSelector((state) => state.game.leftPlayerName);
  const topPlayerName = useSelector((state) => state.game.topPlayerName);
  const rightPlayerName = useSelector((state) => state.game.rightPlayerName);

  const mainPlayerUserId = useSelector((state) => state.game.mainPlayerUserId);
  const leftPlayerUserId = useSelector((state) => state.game.leftPlayerUserId);
  const topPlayerUserId = useSelector((state) => state.game.topPlayerUserId);
  const rightPlayerUserId = useSelector(
    (state) => state.game.rightPlayerUserId
  );
  const mainPlayerRanking = useSelector(
    (state) => state.game.mainPlayerRanking
  );
  const leftPlayerRanking = useSelector(
    (state) => state.game.leftPlayerRanking
  );
  const topPlayerRanking = useSelector((state) => state.game.topPlayerRanking);
  const rightPlayerRanking = useSelector(
    (state) => state.game.rightPlayerRanking
  );
  
  const topPoints = useSelector((state) => state.game.topPoints);
  const leftPoints = useSelector((state) => state.game.leftPoints);
  const rightPoints = useSelector((state) => state.game.rightPoints);
  const mainPoints = useSelector((state) => state.game.mainPoints);

  const [topBackgroundUrl, setTopBackgroundUrl] = useState("");
  const [leftBackgroundUrl, setLeftBackgroundUrl] = useState("");
  const [rightBackgroundUrl, setRightBackgroundUrl] = useState("");
  const [mainBackgroundUrl, setMainBackgroundUrl] = useState("");
  const [turnTop, setTurnTop] = useState(false);
  const [turnRight, setTurnRight] = useState(false);
  const [turnBottom, setTurnBottom] = useState(false);
  const [turnLeft, setTurnLeft] = useState(false);

  useEffect(() => {
  setMainBackgroundUrl("https://ratsapi.online/api/UserImage?id=" + mainPlayerUserId)
  setLeftBackgroundUrl("https://ratsapi.online/api/UserImage?id=" + leftPlayerUserId)
  setRightBackgroundUrl("https://ratsapi.online/api/UserImage?id=" + rightPlayerUserId);
  setTopBackgroundUrl("https://ratsapi.online/api/UserImage?id=" + topPlayerUserId);
}, [mainPlayerUserId, leftPlayerUserId, rightPlayerUserId, topPlayerUserId])
  
  useEffect(() => {
    if(props.turn){
      if(props.turn.displayName === topPlayerName){
        setTurnTop(true);
        setTurnLeft(false);
        setTurnRight(false);
        setTurnBottom(false);
      }
      else if(props.turn.displayName === leftPlayerName){
        setTurnTop(false);
        setTurnLeft(true);
        setTurnRight(false);
        setTurnBottom(false);
      }
      else if(props.turn.displayName === rightPlayerName){
        setTurnTop(false);
        setTurnLeft(false);
        setTurnRight(true);
        setTurnBottom(false);
      }
      else if(props.turn.displayName === mainPlayerName){
        setTurnTop(false);
        setTurnLeft(false);
        setTurnRight(false);
        setTurnBottom(true);
      }
    }
  }, [props.turn])

  return (
    <div className="game-display-wrapper">
      <div className="game-display-box">
        <div className="game-display-grid">
          <div className={turnTop ? "game-display-top turn-top" : "game-display-top"}>
            <div className="game-display-name">
              <div className="game-display-name-box">
                <div className="gdnb-name">{topPlayerName}</div>
              </div>
            </div>
            <div className="game-display-image-box">
              <div className="gdnb-image">
                <div
                  className="image-source"
                  style={{ backgroundImage: "url(" + topBackgroundUrl + ")" }}
                >
                </div>
              </div>
            </div>
            <div className="game-display-ranking-box">
              {topPlayerRanking > 2600 ? (
                <div className="gdnb-ranking high">{topPlayerRanking}</div>
              ) : topPlayerRanking > 2000 ? (
                <div className="gdnb-ranking medium-high">
                  {topPlayerRanking}
                </div>
              ) : topPlayerRanking > 1500 ? (
                <div className="gdnb-ranking medium">{topPlayerRanking}</div>
              ) : topPlayerRanking > 1000 ? (
                <div className="gdnb-ranking medium-low">
                  {topPlayerRanking}
                </div>
              ) : (
                <div className="gdnb-ranking low">{topPlayerRanking}</div>
              )}
            </div>
          </div>
          <div className={turnLeft ? "game-display-left turn-left" : "game-display-left"}>
            <div className="game-display-name">
              <div className="game-display-name-box">
                <div className="gdnb-name">{leftPlayerName}</div>
              </div>
            </div>
            <div className="game-display-image-box">
              <div className="gdnb-image">
                <div
                  className="image-source"
                  style={{ backgroundImage: "url(" + leftBackgroundUrl + ")" }}
                ></div>
              </div>
            </div>

            <div className="game-display-ranking-box">
              {leftPlayerRanking > 2600 ? (
                <div className="gdnb-ranking high">{leftPlayerRanking}</div>
              ) : leftPlayerRanking > 2000 ? (
                <div className="gdnb-ranking medium-high">
                  {leftPlayerRanking}
                </div>
              ) : leftPlayerRanking > 1500 ? (
                <div className="gdnb-ranking medium">{leftPlayerRanking}</div>
              ) : leftPlayerRanking > 1000 ? (
                <div className="gdnb-ranking medium-low">
                  {leftPlayerRanking}
                </div>
              ) : (
                <div className="gdnb-ranking low">{leftPlayerRanking}</div>
              )}
            </div>
          </div>
          <div className="game-display-center">
            <div className="game-display-center-grid">
              <div className="gdc-top">
                <div className="gdc-top-points-box">
                  <div className="gdc-points">
                    <div className="gdc-top-points">{topPoints}</div>
                  </div>
                </div>
              </div>
              <div className="gdc-left">
                <div className="gdc-left-points-box">
                  <div className="gdc-points">
                    <div className="gdc-left-points">{leftPoints}</div>
                  </div>
                </div>
              </div>
              <div className="gdc-right">
                <div className="gdc-right-points-box">
                  <div className="gdc-points">
                    <div className="gdc-right-points">{rightPoints}</div>
                  </div>
                </div>
              </div>
              <div className="gdc-bottom">
                <div className="gdc-bottom-points-box">
                  <div className="gdc-points">
                    <div className="gdc-bottom-points">{mainPoints}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={turnRight ? "game-display-right turn-right" : "game-display-right"}>
            <div className="game-display-name">
              <div className="game-display-name-box">
                <div className="gdnb-name">{rightPlayerName}</div>
              </div>
              <div className="game-display-image-box">
                <div className="gdnb-image">
                  <div
                    className="image-source"
                    style={{
                      backgroundImage: "url(" + rightBackgroundUrl + ")",
                    }}
                  >
                    {}
                  </div>
                </div>
              </div>
              <div className="game-display-ranking-box">
                {rightPlayerRanking > 2600 ? (
                  <div className="gdnb-ranking high">{rightPlayerRanking}</div>
                ) : rightPlayerRanking > 2000 ? (
                  <div className="gdnb-ranking medium-high">
                    {rightPlayerRanking}
                  </div>
                ) : rightPlayerRanking > 1500 ? (
                  <div className="gdnb-ranking medium">
                    {rightPlayerRanking}
                  </div>
                ) : rightPlayerRanking > 1000 ? (
                  <div className="gdnb-ranking medium-low">
                    {rightPlayerRanking}
                  </div>
                ) : (
                  <div className="gdnb-ranking low">{rightPlayerRanking}</div>
                )}
              </div>
            </div>
          </div>
          <div className={turnBottom ? "game-display-bottom turn-bottom" : "game-display-bottom"}>
            <div className="game-display-name">
              <div className="game-display-name-box">
                <div className="gdnb-name">{mainPlayerName}</div>
              </div>
            </div>
            <div className="game-display-image-box">
              <div className="gdnb-image">
                <div
                  className="image-source"
                  style={{ backgroundImage: "url(" + mainBackgroundUrl + ")" }}
                >
                  {}
                </div>
              </div>
            </div>
            <div className="game-display-ranking-box">
              {mainPlayerRanking > 2600 ? (
                <div className="gdnb-ranking high">{mainPlayerRanking}</div>
              ) : mainPlayerRanking > 2000 ? (
                <div className="gdnb-ranking medium-high">
                  {mainPlayerRanking}
                </div>
              ) : mainPlayerRanking > 1500 ? (
                <div className="gdnb-ranking medium">{mainPlayerRanking}</div>
              ) : mainPlayerRanking > 1000 ? (
                <div className="gdnb-ranking medium-low">
                  {mainPlayerRanking}
                </div>
              ) : (
                <div className="gdnb-ranking low">{mainPlayerRanking}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDisplay;
