import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import react from "react";

const GamePage = () => {
  let { authTokens, logoutUser } = useContext(AuthContext);
  let [questions, setQuestions] = useState([]);
  let [game, setGame] = useState(true);
  let [canSubmit, setCanSubmit] = useState(false);
  let [finished, setFinished] = useState(false);
  let [newGame, setNewgame] = useState(true);
  let [counter, setCounter] = useState(0);

  useEffect(() => {
    getQuestions();
  }, [newGame]);

  useEffect(() => {
    styleOptions();
  }, [finished, game]);

  let getQuestions = async () => {
    let response = await fetch("/api/game_questions/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();
    if (response.status === 200) {
      setGame(true);
      setQuestions(data);
    } else if (response.status === 206) {
      setGame(false);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  let styleOptions = () => {
    let questionsList = document.querySelector("ul");
    if (!finished && game) {
      questionsList.classList.add("game-on");
    } else if (finished && game) {
      questionsList.classList.remove("game-on");
    }
  };

  let getOtherOptions = (e) => {
    let options = [];
    let firstOption = e.parentNode.firstChild;

    while (firstOption) {
      if (firstOption.nodeType === 1 && firstOption !== e) {
        options.push(firstOption);
      }
      firstOption = firstOption.nextElementSibling;
    }
    return options;
  };

  let pickOption = (e) => {
    if (!finished) {
      let thisOption = e.target;
      let otherOptions = getOtherOptions(thisOption);
      otherOptions.map((option) => (option.className = ""));

      thisOption.className = "active";

      let optionNumber = parseInt(e.target.getAttribute("data-option"));
      let questionIndex = parseInt(
        e.target.parentNode.parentNode.getAttribute("data-index")
      );
      let newQuestions = questions;
      newQuestions[questionIndex].userAnswer = optionNumber;
      setQuestions(newQuestions);

      let answeredQuestions = document.querySelectorAll(".active");

      answeredQuestions.length === 5 ? setCanSubmit(true) : setCanSubmit(false);
    } else {
      return;
    }
  };

  let sendGameResults = async (results) => {
    setCanSubmit(false);
    let response = await fetch("/api/results/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify(results),
    });
    console.log(response);
    setCanSubmit(true);
  };

  let submitGame = () => {
    setFinished(true);
    let results = [];
    let counter = 0;

    questions.forEach((question, index) => {
      let questionDiv = document.querySelector(`[data-index="${index}"]`);
      let userOption = questionDiv.querySelector(".active");
      if (question.rightAnswer === question.userAnswer) {
        userOption.classList.add("correct");
        userOption.classList.remove("active");
        questionDiv.classList.add("right");
        results.push({ [question.id]: true });
        counter += 1;
      } else {
        userOption.classList.add("incorrect");
        userOption.classList.remove("active");
        questionDiv.classList.add("wrong");

        results.push({ [question.id]: false });
      }
    });
    setCounter(counter);
    sendGameResults(results);
  };

  let nextGame = async () => {
    await setFinished(false);
    setNewgame(!newGame);
  };

  return (
    <div className="game-wrapper">
      {game ? (
        <div>
          {!finished && <h2>Good luck!</h2>}
          <ul>
            {questions.map((question, index) => (
              <li
                key={question.id}
                className="question-wrapper"
                data-id={question.id}
                data-index={index}
              >
                <div className="question-body">{question.body}</div>
                <div className="question-options">
                  <div onClick={pickOption} data-option={1}>
                    {question.option_1}
                  </div>
                  <div onClick={pickOption} data-option={2}>
                    {question.option_2}
                  </div>
                  <div onClick={pickOption} data-option={3}>
                    {question.option_3}
                  </div>
                  <div onClick={pickOption} data-option={4}>
                    {question.option_4}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {canSubmit && !finished && (
            <button onClick={submitGame} id="submitGameButton">
              Submit
            </button>
          )}
          {finished && (
            <react.Fragment>
              <h2>
                You have answered {counter}{" "}
                {counter > 1 ? "questions!" : "question!"}
              </h2>
              <button onClick={nextGame} id="nextButton">
                Go Next
              </button>
            </react.Fragment>
          )}
        </div>
      ) : (
        <react.Fragment>
          <span>
            Not enough questions to play right now ;( Maybe you want to&nbsp;
          </span>
          <Link to="/questions">create one?</Link>
        </react.Fragment>
      )}
    </div>
  );
};

export default GamePage;
