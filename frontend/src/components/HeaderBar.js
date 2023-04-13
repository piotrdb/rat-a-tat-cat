import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/auth";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { resetCredentials } from "../slices/userCredentials";
import { Link } from "react-router-dom";
import { getRankingList } from "../slices/rankingList";
import CloseButton from "react-bootstrap/CloseButton";
import Profile from "./Profile";


const RankingModal = (props) => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.rankingList);
  const [ratingList, setRatingList] = useState([]);

  useEffect(() => {
    dispatch(getRankingList()).then((data) => {
      setRatingList(data.payload.data);
    });
  }, []);

  return (
    <div className="dim-screen">
      <div className="ranking-container">
        <div className="new-board-x-holder">
          <CloseButton variant="white" onClick={() => props.setRankingModal(!props.rankingModal)} />
        </div>
        <div className="ranking-table-box">
          <h1 className="top-50">Top 50</h1>
          <table className="ranking-table-table"
            style={{
              overflowY: "scroll",
              overflowX: "hidden",
              height: "100%",
            }}
          >
            <tr>
              <th className="ranking-row-number-title">Poz.</th>
              <th className="ranking-row-title">Nazwa użytkownika</th>
              <th className="ranking-row-number-title">Ranking</th>
            </tr>
            {ratingList.map((ratingRow, index) => (
              <tr className="ranking-row">
                <td className="ranking-row-number">{index + 1}</td>
                <td className="ranking-row-string">{ratingRow.displayName}</td>
                <td className="ranking-row-number">{ratingRow.ratMMR > 4000 ? (
                    <div className="high">{ratingRow.ratMMR}</div>
                  ) : ratingRow.ratMMR > 3000 ? (
                    <div className="medium-high">{ratingRow.ratMMR}</div>
                  ) : ratingRow.ratMMR > 2000 ? (
                    <div className="medium">{ratingRow.ratMMR}</div>
                  ) : ratingRow.ratMMR > 1000 ? (
                    <div className="medium-low">{ratingRow.ratMMR}</div>
                  ) : (
                    <div className="low">{ratingRow.ratMMR}</div>
                  )}
                  </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
};

const HeaderBar = (props) => {
  const [rankingModal, setRankingModal] = useState(false);
  const [profile, setProfile] = useState(false);
  const dispatch = useDispatch();
  const history = useNavigate();

  const handleLogOut = () => {
    props.setGo(false);
    dispatch(resetCredentials());
    dispatch(logout()).then(history("/"));
  };

  const backgroundUrl = "https://ratsapi.online/api/users/user/image/" + props.userId;
  return (
    <>
      <div className="header-bar-container">
        <div className="logout-wrapper">
            {!props.game && (<Button className="logout-button" onClick={handleLogOut}>
                Wyloguj się
            </Button>)}
        </div>
        <div className="header-bar-logo"></div>
        <div className="ranking-wrapper">
            {!props.game && (<Button className="ranking-button" onClick={() => setRankingModal(!rankingModal)}>
                Ranking
            </Button>)}
        </div>
        <div className="profile-wrapper">
            {!props.game && (<Button className="profile-button" onClick={() => setProfile(!profile)}>
                Profil
            </Button>)}
        </div>
        {props.username && (
          <div className="details-box">
            <div className="username-box">
              <div className="username">{props.username}</div>
            </div>
            <div className="icon-box">
                <div
                  className="icon"
                  style={{ backgroundImage: "url(" + backgroundUrl + ")" }}
                ></div>
            </div>
          </div>
        )}
      </div>
      {rankingModal && <RankingModal setRankingModal={setRankingModal} rankingModal={rankingModal}/>}
      {profile && <Profile setProfile={setProfile} profile={profile}></Profile>}
    </>
  );
};

export default HeaderBar;
