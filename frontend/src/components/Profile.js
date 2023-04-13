import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import HeaderBar from "./HeaderBar";
import ImageSelector from "./ImageSelector";
import { getUserCredentials } from "../slices/userCredentials";
import { updateEmail, updatePassword, updateDisplayName } from "../slices/auth";
import { getImagesIds, setProfileImage } from "../slices/userImage";
import "../custom.scss";
import CloseButton from "react-bootstrap/CloseButton";

const DataRow = (props) => {
  return (
    <div className="profile-data-row">
      <span className="profile-data-row-text">{props.label}</span>
      <Button onClick={props.onClick} variant="secondary">
        Aktualizuj
      </Button>
    </div>
  );
};

const PasswordModal = (props) => {
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const { message } = useSelector((state) => state.message);
  const handlePassword = () => {
    dispatch(
      updatePassword({
        oldPassword,
        newPassword,
      })
    )
      .unwrap()
      .then(() => {
        props.onClose();
      })
      .catch((e) => {});
  };

  return (
    <div className="dim-screen">
      <div
        style={{
          backgroundColor: "#f87d09",
          position: "absolute",
          left: 0,
          right: 0,
          margin: "200px auto",
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          padding: "2rem",
          borderRadius: "10px",
        }}
      >
        <input
          type="password"
          placeholder="Poprzednie hasło"
          onChange={(event) => setOldPassword(event.target.value)}
        />
        <input
          type="password"
          placeholder="Nowe hasło"
          onChange={(event) => setNewPassword(event.target.value)}
        />
        <Button onClick={handlePassword}>Aktualizuj hasło</Button>
        <Button variant="secondary" onClick={props.onClose}>
          Anuluj
        </Button>
        {message && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EmailModal = (props) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState(false);
  const [message, setMessage] = useState();

  const handleEmail = (e) => {
    e.preventDefault();
    dispatch(updateEmail(email))
      .unwrap()
      .then(() => {
        setMessage(undefined);
        dispatch(getUserCredentials());
        props.onClose();
      })
      .catch((e) => {
        setMessage(e);
      });
  };

  return (
    <div className="dim-screen">
      <div
        style={{
          backgroundColor: "#f87d09",
          position: "absolute",
          left: 0,
          right: 0,
          margin: "200px auto",
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          padding: "2rem",
          borderRadius: "10px",
        }}
      >
        <form onSubmit={handleEmail}>
          <input
            className="w-100 mx-1 mb-5"
            type="email"
            placeholder="Adres e-mail"
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button className="w-100 m-1" type="submit">
            Zmień Adres e-mail
          </Button>
          <Button
            variant="secondary"
            className="w-100 m-1"
            onClick={props.onClose}
          >
            Anuluj
          </Button>
        </form>
        {message && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DisplayNameModal = (props) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(false);
  const { message } = useSelector((state) => state.message);

  const handleDisplayName = (e) => {
    e.preventDefault();
    dispatch(updateDisplayName(name))
      .unwrap()
      .then(() => {
        dispatch(getUserCredentials());
        props.onClose();
      })
      .catch((e) => {});
  };

  return (
    <div className="dim-screen">
      <div
        style={{
          backgroundColor: "#f87d09",
          position: "absolute",
          left: 0,
          right: 0,
          margin: "200px auto",
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          padding: "2rem",
          borderRadius: "10px",
        }}
      >
        <form onSubmit={handleDisplayName}>
          <input
            className="w-100 mx-1 mb-5"
            type="string"
            placeholder="Nazwa użytkownika"
            onChange={(event) => setName(event.target.value)}
          />
          <Button className="w-100 m-1" type="submit">
            Zmień nazwę użytkownika
          </Button>
          <Button
            variant="secondary"
            className="w-100 m-1"
            onClick={props.onClose}
          >
            Anuluj
          </Button>
        </form>
        {message && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileTab = (props) => {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.userImages);
  const [fetchedImages, setFetchedImages] = useState([]);
  const backgroundUrl =
    "https://ratsapi.online/api/users/user/image/" + props.userId;
  const displayName = useSelector((state) => state.userCredentials.displayName);

  useEffect(() => {
    dispatch(getImagesIds()).then((data) => {
      setFetchedImages(data.payload.data);
    });
  }, []);

  return (
    <div className="profile-profile-tab">
      <div className="profile-tab-title">Wybór awatara</div>
      <div className="main-player-avatar-box high-border">
        <div
          className="image-source"
          style={{
            backgroundImage: "url(" + backgroundUrl + ")",
          }}
        ></div>
      </div>
      <p className="profile-player-name">{displayName}</p>
      <ImageSelector
        images={fetchedImages}
        onSubmit={(id) => {
          dispatch(
            setProfileImage({
              userId: Number(props.userId),
              imageId: Number(id),
            })
          ).then(() => window.location.reload(false));
        }}
      />
    </div>
  );
};
const ProfileDataTab = (props) => {
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [showModalEmail, setShowModalEmail] = useState(false);
  const [showModalDisplayName, setShowModalDisplayName] = useState(false);
  return (
    <div className="profile-profile-tab">
      <div className="profile-tab-title">Dane konta</div>
      <DataRow label="Hasło" onClick={() => setShowModalPassword(true)} />
      <DataRow
        label={`Adres e-mail : ${props.userEmail}`}
        onClick={() => setShowModalEmail(true)}
      />
      <DataRow
        label={`Nazwa użytkownika : ${props.displayName}`}
        onClick={() => setShowModalDisplayName(true)}
      />
      {showModalPassword && (
        <PasswordModal
          userId={props.userId}
          email={props.userEmail}
          displayName={props.displayName}
          onClose={() => setShowModalPassword(false)}
        />
      )}
      {showModalEmail && (
        <EmailModal
          userId={props.userId}
          displayName={props.displayName}
          onClose={() => setShowModalEmail(false)}
        />
      )}
      {showModalDisplayName && (
        <DisplayNameModal
          userId={props.userId}
          displayName={props.displayName}
          onClose={() => setShowModalDisplayName(false)}
        />
      )}
    </div>
  );
};
const SecurityTab = () => {
  return <div>SecurityTab</div>;
};
const PrivacyTab = () => {
  return <div>PrivacyTab</div>;
};
const GameSettingsTab = () => {
  return <div>GameSettingsTab</div>;
};

const Profile = (props) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [tab, setTab] = useState("Wybór awatara");
  const settings = [
    "Wybór awatara",
    "Dane konta",
    // "Zabezpieczenia",
    // "Prywatność",
    // "Ustawienia gry",
  ];
  // if (!currentUser) {
  //   return <Navigate to="/login" />;
  // }

  const displayName = useSelector((state) => state.userCredentials.displayName);
  const userId = useSelector((state) => state.userCredentials.userId);
  const userEmail = useSelector((state) => state.userCredentials.userEmail);

  useEffect(() => {
    dispatch(getUserCredentials());
  }, [dispatch]);

  return (
    <>
      <div className="cards-bg">
        <HeaderBar username={displayName} userId={userId} />
        <div className="dim-screen">
          <div className="profile-container">
            <div className="profile-box">
              <div className="new-board-x-holder">
                <CloseButton
                  variant="white"
                  onClick={() => props.setProfile(!props.profile)}
                />
              </div>
              <div className="profile-left-pane">
                <div className="profile-title">Ustawienia</div>
                <ul className="profile-tab-option">
                  {settings.map((setting) => (
                    <li
                      className={
                        setting === tab ? "profile-tab-option--selected" : ""
                      }
                      onClick={() => setTab(setting)}
                      key={setting}
                    >
                      {setting}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="profile-right-pane">
                {tab === "Wybór awatara" && <ProfileTab userId={userId} />}
                {tab === "Dane konta" && (
                  <ProfileDataTab
                    userId={userId}
                    userEmail={userEmail}
                    displayName={displayName}
                  />
                )}
                {tab === "Zabezpieczenia" && <SecurityTab />}
                {tab === "Prywatność" && <PrivacyTab />}
                {tab === "Ustawienia gry" && <GameSettingsTab />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
