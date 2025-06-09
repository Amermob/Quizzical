import { useEffect, useState } from "react";
import "./Quiz.css";
import blobs from "/public/blobs.png";
import { nanoid } from "nanoid";

export default function Quiz() {
  const [questions, setQuestions] = useState();

  const [page, setPage] = useState(false);

  const [choosedAnswer, setChoosedAnswer] = useState([]);

  const [allCorrectAnswer, setAllCorrectAnswer] = useState([]);

  const [showingResults, setShowingResults] = useState();

  const [gameIsOver, setGameIsOver] = useState(false);

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&category=9&type=multiple")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(
          data.results.map((quiz) => {
            const correctAnswer = quiz.correct_answer;
            setAllCorrectAnswer((prevA) => [...prevA, correctAnswer]);
            const incorrectAnswer = quiz.incorrect_answers.map((el) => {
              return el;
            });

            const allRightAnswer = allCorrectAnswer.map((answer) => answer);

            const options = [];
            options.push(correctAnswer, ...incorrectAnswer);

            return (
              <div key={nanoid()} className="questions">
                <h2>{quiz.question}</h2>
                <div>
                  {options.map((option) => (
                    <label className="label" dataset={allRightAnswer}>
                      {option}
                      <input
                        onClick={handleAnswers}
                        type="radio"
                        value={option}
                        name={quiz.question}
                      />
                    </label>
                  ))}
                </div>
                <hr />
              </div>
            );
          })
        );
      });
  }, [questions]);

  function handleAnswers(e) {
    setChoosedAnswer((prevCho) => [...prevCho, e.target.value]);
  }

  function checkedAnswers() {
    setGameIsOver(!gameIsOver);
    const h = choosedAnswer.filter((f, i) => {
      return f === allCorrectAnswer[i];
    });

    setShowingResults(`you scored ${h.length}/5 correct answer`);
  }

  function finished() {
    setPage(false);
    setQuestions();
    setShowingResults();
    setGameIsOver(false);
  }
  function render() {
    if (!page) {
      return (
        <>
          <img src={blobs} alt="" />
          <section>
            <div className="intro">
              <h2>Quizzical</h2>
              <p>are you smarter than a 5th grader?</p>
              <button onClick={() => setPage(!page)}>start quiz</button>
            </div>
          </section>
        </>
      );
    } else {
      return (
        <>
          <img className="img-in-qa" src={blobs} alt="" />
          {questions}
          <div className="result">
            <p className="score">{showingResults}</p>
            {!gameIsOver ? (
              <button onClick={checkedAnswers} className="answer-btn">
                Check answers
              </button>
            ) : (
              <button onClick={finished} className="answer-btn">
                Play again?
              </button>
            )}
          </div>
        </>
      );
    }
  }

  return <main>{render()}</main>;
}
