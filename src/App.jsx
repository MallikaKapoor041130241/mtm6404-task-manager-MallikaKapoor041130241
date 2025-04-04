
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    axios.get('https://opentdb.com/api.php?amount=10&category=11&type=multiple')
      .then(response => {
        console.log('Questions fetched:', response.data.results);
        setQuestions(response.data.results);
      })
      .catch(error => {
        console.error('Error fetching the questions', error);
      });
  }, []);

  const handleAnswer = (questionIndex, selectedAnswer) => {
    setUserAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      newAnswers[questionIndex] = selectedAnswer;
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleTryAgain = () => {
    setShowResults(false);
    setUserAnswers([]);
    setQuestions([]); 

    axios.get('https://opentdb.com/api.php?amount=10&category=11&type=multiple')
      .then(response => {
        console.log('Questions fetched:', response.data.results);
        setQuestions(response.data.results);
      })
      .catch(error => {
        console.error('Error fetching the questions', error);
      });
  };

  return (
    <div className="quiz-container">
      <h1>Interactive Quiz</h1>
      {showResults ? (
        <div>
          <h2>Results</h2>
          {questions.map((question, index) => (
            <div key={index}>
              <p>{question.question}</p>
              {question.incorrect_answers.concat(question.correct_answer).map((answer, answerIndex) => {
                const isCorrect = answer === question.correct_answer;
                const isSelected = userAnswers[index] === answer;
                return (
                  <button
                    key={answerIndex}
                    className={isSelected ? (isCorrect ? 'correct' : 'wrong') : ''}
                  >
                    {answer}
                  </button>
                );
              })}
            </div>
          ))}
          <p>Your score: {userAnswers.filter((answer, index) => answer === questions[index].correct_answer).length} / 10</p>
          <button onClick={handleTryAgain}>Try Again</button>
        </div>
      ) : (
        <div>
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div key={index}>
                <p>{question.question}</p>
                {question.incorrect_answers.concat(question.correct_answer).map((answer, answerIndex) => (
                  <button key={answerIndex} onClick={() => handleAnswer(index, answer)}>
                    {answer}
                  </button>
                ))}
              </div>
            ))
          ) : (
            <p>Loading questions...</p>
          )}
          <button onClick={handleSubmit}>Submit Quiz</button>
        </div>
      )}
    </div>
  );
}

export default App;
