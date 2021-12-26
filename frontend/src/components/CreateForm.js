import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";

const CreateForm = ({ onReloadStateChange }) => {
  // auth data from context provider
  let { authTokens } = useContext(AuthContext);
  // question state
  let [question, setQuestion] = useState({
    body: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    rightAnswer: "",
  });

  let addQuestion = (e) => {
    e.preventDefault();
    // get array of current options
    let allOptions = [];
    allOptions.push(question.option1);
    allOptions.push(question.option2);
    allOptions.push(question.option3);
    allOptions.push(question.option4);

    // is something is missing
    if (
      !question.body ||
      !question.option1 ||
      !question.option2 ||
      !question.option3 ||
      !question.option4 ||
      !question.rightAnswer ||
      !question.rightAnswer === " "
    ) {
      alert("Please fill all fields");
      return;
    }
    // if set from array < 4, meaning the was a dublicate answer
    else if (new Set(allOptions).size !== 4) {
      alert("No dublicate answers allowed");
      return;
    } else {
      sendQuestion();
    }
  };

  // send data to backend
  let sendQuestion = async () => {
    let response = await fetch("/api/create/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify(question),
    });
    // if everething ok, reset the form
    if (response.status === 200) {
      onReloadStateChange();
      setQuestion({
        body: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        rightAnswer: "",
      });
      document.querySelector(".create-form").reset();
    }
  };

  // resize textarea to fit the content
  let resize = (e) => {
    let textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  return (
    <div>
      {/*  on submit - try to create new question
      on change of every field update the question state
       */}
      <form className="create-form" onSubmit={addQuestion}>
        <div className="flex-col">
          <label>Your question</label>
          <textarea
            name="body"
            id="body-textarea"
            maxlength="150"
            autoComplete="off"
            value={question.body}
            onChange={(e) => {
              let newQuestion = { ...question, body: e.target.value };
              setQuestion(newQuestion);
            }}
            onKeyUp={resize}
          />
        </div>
        <div className="flex-col">
          <label>Option 1</label>
          <input
            type="text"
            name="option1"
            autoComplete="off"
            maxlength="40"
            value={question.answer1}
            onChange={(e) => {
              let newQuestion = { ...question, option1: e.target.value };
              setQuestion(newQuestion);
            }}
          />
        </div>
        <div className="flex-col">
          <label>Option 2</label>
          <input
            type="text"
            name="option2"
            autoComplete="off"
            maxlength="40"
            onChange={(e) => {
              let newQuestion = { ...question, option2: e.target.value };
              setQuestion(newQuestion);
            }}
            value={question.answer2}
          />
        </div>
        <div className="flex-col">
          <label>Option 3</label>
          <input
            type="text"
            name="option3"
            maxlength="40"
            autoComplete="off"
            onChange={(e) => {
              let newQuestion = { ...question, option3: e.target.value };
              setQuestion(newQuestion);
            }}
            value={question.answer3}
          />
        </div>
        <div className="flex-col">
          <label>Option 4</label>
          <input
            type="text"
            name="option4"
            maxlength="40"
            autoComplete="off"
            onChange={(e) => {
              let newQuestion = { ...question, option4: e.target.value };
              setQuestion(newQuestion);
            }}
            value={question?.answer4}
          />
        </div>
        <div>
          <div className="flex-col">
            <label>Right answer?</label>
            <select
              value={question.rightAnswer}
              onChange={(e) => {
                let newQuestion = { ...question, rightAnswer: e.target.value };
                setQuestion(newQuestion);
              }}
            >
              <option value=" ">-</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div>
            <input
              type="submit"
              className="save-button"
              value="Save question"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
