import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import react from "react";

const GamePage = () => {
  // auth data and logout function from context provider
  let { authTokens, logoutUser } = useContext(AuthContext);

  // game questions state
  let [questions, setQuestions] = useState([]);

  // state to store if its enough questions to play the game
  let [game, setGame] = useState(true);

  // state to store if user answered all questions and may submit the game now
  let [canSubmit, setCanSubmit] = useState(false);

  //state to store if the game is finished to turn off game logic and show result
  let [finished, setFinished] = useState(false);

  // new game state
  let [newGame, setNewgame] = useState(true);

  // state to store answered questions
  let [counter, setCounter] = useState(0);

  // get questions
  useEffect(() => {
    getQuestions();
  }, [newGame]);

  // call styleOptions function
  useEffect(() => {
    styleOptions();
  }, [finished, game]);

  // fetch questions
  let getQuestions = async () => {
    let response = await fetch("/api/game_questions/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();

    // if its ok, start the game, populate the questions state
    if (response.status === 200) {
      setGame(true);
      setQuestions(data);
    } else if (response.status === 206) {
      // if not enough questions - stop the game
      setGame(false);
    } else if (response.statusText === "Unauthorized") {
      // logout if unauthorized call
      logoutUser();
    }
  };
  // add class for css, if game is active
  let styleOptions = () => {
    let questionsList = document.querySelector("ul");
    if (!finished && game) {
      questionsList.classList.add("game-on");
    } else if (finished && game) {
      questionsList.classList.remove("game-on");
    }
  };

  // function to get other sibling options of the question
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

  // pick target option
  let pickOption = (e) => {
    if (!finished) {
      let thisOption = e.target;
      let otherOptions = getOtherOptions(thisOption);

      // remove classes of other options
      otherOptions.map((option) => (option.className = ""));

      // set active class
      thisOption.className = "active";

      // parse picked option and save it in the question state
      let optionNumber = parseInt(e.target.getAttribute("data-option"));
      let questionIndex = parseInt(
        e.target.parentNode.parentNode.getAttribute("data-index")
      );
      let newQuestions = questions;
      newQuestions[questionIndex].userAnswer = optionNumber;
      setQuestions(newQuestions);
      // if 5 questions is answered, user can finish the game
      let answeredQuestions = document.querySelectorAll(".active");
      answeredQuestions.length === 5 ? setCanSubmit(true) : setCanSubmit(false);
    } else {
      return;
    }
  };

  // send results to backend
  let sendGameResults = async (results) => {
    // turn off canSubmit to prevent doubleclicking
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

  // submit game
  let submitGame = () => {
    // turn off game logic, show results
    setFinished(true);
    let results = [];
    let counter = 0;

    // mark every picked option as correct or incorrect (and show the correct one in that case)
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

    // update answered questions counter, call sendGameResults
    setCounter(counter);
    sendGameResults(results);
  };

  // make finished state false, trigger new game
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
