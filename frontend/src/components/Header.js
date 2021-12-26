import react from "react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { MdOutlineLogout, MdOutlineQuiz } from "react-icons/md";

const Header = () => {
  let { userData } = useContext(AuthContext);
  let { logoutUser } = useContext(AuthContext);

  return (
    <div className="header">
      <div className="navbar">
        <Link to="/">
          <MdOutlineQuiz />
        </Link>
        {userData && (
          <react.Fragment>
            <Link to="/play">Play</Link>
            <Link to="/rankings">Rankings</Link>
            <Link to="/questions">MyQuestions</Link>
          </react.Fragment>
        )}
      </div>
      <div className="loginbar">
        {/* if user is logged display link to profile and logout. otherwise - to login and register */}
        {userData ? (
          <React.Fragment>
            <Link to={`/profile/${userData.user_id}`}>{userData.username}</Link>
            <span onClick={logoutUser}>
              <MdOutlineLogout />
            </span>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Header;
