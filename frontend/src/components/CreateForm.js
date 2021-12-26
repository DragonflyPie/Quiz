import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";

const CreateForm = ({ onReloadStateChange }) => {
  let { authTokens } = useContext(AuthContext);
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
    let allQuestion = [];
    allQuestion.push(question.option1);
    allQuestion.push(question.option2);
    allQuestion.push(question.option3);
    allQuestion.push(question.option4);
    console.log(allQuestion);

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
    } else if (new Set(allQuestion).size !== 4) {
      alert("No dublicate answers allowed");
      return;
    } else {
      sendQuestion();
    }
  };

  let sendQuestion = async () => {
    let response = await fetch("/api/create/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify(question),
    });
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

  let resize = (e) => {
    let textarea = e.target;
    console.log(textarea);
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  return (
    <div>
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
