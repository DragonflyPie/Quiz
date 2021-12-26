import React, { useEffect, useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  let { authTokens, logoutUser } = useContext(AuthContext);

  let [users, setUsers] = useState([]);

  useEffect(() => {
    getRankings();
  }, []);

  let getRankings = async () => {
    let response = await fetch("/api/rankings/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();
    if (response.status === 200) {
      if (data.length > 10) {
        setUsers(data.slice(0, 10));
      } else {
        setUsers(data);
      }

      console.log(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };
  return (
    <div className="leaderboard-wrapper">
      <h3>Current top quiz players</h3>
      <ul>
        <li>
          <div className="ranking-header">
            <div>№</div>
            <div>Username</div>
            <div>Winrate, %</div>
            <div>Games played</div>
          </div>
        </li>
        {users.map((user, index) => (
          <li key={user.id}>
            <div className="ranking-row">
              <div>{index + 1}</div>
              <div>
                {" "}
                <Link to={`/profile/${user.id}`}>{user.username}</Link>
              </div>
              <div>{user.winrate ? user.winrate : "-"}</div>
              <div>{user.guesses}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
