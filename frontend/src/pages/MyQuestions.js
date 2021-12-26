import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import CreateForm from "../components/CreateForm";
import Button from "../components/Button";

const MyQuestions = () => {
  // auth tokens and logout function from context provider
  let { authTokens, logoutUser } = useContext(AuthContext);

  // state to store questions
  let [questions, setQuestions] = useState([]);

  // state to show/hide form
  let [showCreateForm, setShowCreateForm] = useState(false);

  // state to reload the page
  let [reloadState, setReloadState] = useState(false);

  useEffect(() => {
    getQuestions();
  }, [reloadState]);

  // handle reload when create form is submited
  let handleReloadStateChange = () => {
    setReloadState(!reloadState);
  };

  // fetch data, set questions state to the returned data if everething is ok
  let getQuestions = async () => {
    let response = await fetch("/api/my_questions/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();
    if (response.status === 200) {
      setQuestions(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  // hide/show create form
  let toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  return (
    <div className="my-questions-wrapper">
      <div className="flex-row">
        <h3>My questions</h3>
        {showCreateForm ? (
          <Button
            onclick={toggleCreateForm}
            text={"Hide form"}
            color={"grey"}
          />
        ) : (
          <Button
            onclick={toggleCreateForm}
            text={"Create"}
            color={"#457b9d"}
          />
        )}
      </div>

      {showCreateForm && (
        <CreateForm onReloadStateChange={handleReloadStateChange} />
      )}
      <ul>
        {questions.map((question) => (
          <li key={question.id} className="question-wrapper">
            <div className="question-body">{question.body}</div>
            <div className="question-options">
              <div>{question.option_1}</div>
              <div>{question.option_2}</div>
              <div>{question.option_3}</div>
              <div>{question.option_4}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyQuestions;
