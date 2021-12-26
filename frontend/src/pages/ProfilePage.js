import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useParams } from "react-router-dom";
import moment from "moment";

const ProfilePage = () => {
  // get params from URL
  let params = useParams();

  // auth tokens and logout function from provider
  let { authTokens, logoutUser } = useContext(AuthContext);

  // state to store profile data
  let [profile, setProfile] = useState({});

  // fetch data, set profile state to the data if everething is ok
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
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  useEffect(() => {
    getProfile();
  }, [params]);

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
