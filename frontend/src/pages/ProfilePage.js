import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useParams } from "react-router-dom";
import moment from "moment";

const ProfilePage = () => {
  let params = useParams();
  let { authTokens, logoutUser } = useContext(AuthContext);
  let [profile, setProfile] = useState({});

  let getProfile = async () => {
    let response = await fetch(`/api/profile/${params.profileId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();
    if (response.status === 200) {
      setProfile(data);
      console.log(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <div className="profile-wrapper">
      <h1>{profile.username}</h1>
      <div>
        <span>Joined:</span>
        <span>{moment(profile.date_joined).format("MMMM Do YYYY")}</span>
      </div>
      <div>
        <span>Games played:</span> <span>{profile.guesses}</span>
      </div>
      <div>
        <span>Winrate:</span>{" "}
        <span>{profile.winrate ? profile.winrate + "%" : "-"}</span>
      </div>
      <div>
        <span>Questions created:</span>
        {profile.userQuestions ? profile.userQuestions.length : "0"}
      </div>
    </div>
  );
};

export default ProfilePage;
