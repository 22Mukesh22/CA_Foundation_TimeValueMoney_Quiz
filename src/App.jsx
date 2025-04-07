import React, { useState, useEffect } from "react";

const quizData = [
  {
    question: "What is the primary reason interest is charged on borrowed money?",
    options: ["To reward the borrower", "Due to government regulation", "Time value of money", "Inflation"],
    answer: 2,
    explanation: "Time value of money means money today is more valuable than in the future."
  },
  {
    question: "A sum of ₹10,000 is invested for 3 years at 10% p.a. simple interest. What will be the total interest earned?",
    options: ["₹ 3,000", "₹ 2,000", "₹ 3,300", "₹ 3,600"],
    answer: 0,
    explanation: "Simple interest = PRT/100 = 10000×10×3/100 = ₹ 3,000"
  },
  {
    question: "What is the formula for compound interest amount?",
    options: ["A = P(1 + rt)", "A = P + I", "A = P(1 + i)^n", "A = P + P(i × n)"],
    answer: 2,
    explanation: "Compound amount formula: A = P(1 + i)^n"
  },
  {
    question: "If ₹5,000 becomes ₹6,050 in 2 years at compound interest, what is the rate of interest per annum?",
    options: ["10%", "9%", "11%", "12%"],
    answer: 0,
    explanation: "6050 = 5000(1 + r)^2 → r = 10%"
  },
  {
    question: "What is the effective annual rate of interest for 6% p.a. compounded quarterly?",
    options: ["6.00%", "6.09%", "6.13%", "6.25%"],
    answer: 2,
    explanation: "Effective Rate = (1 + i)^n - 1 = (1 + 0.015)^4 - 1 = 6.13%"
  },
  {
    question: "At what rate will a sum double in 10 years under compound interest?",
    options: ["7%", "10.41%", "10%", "9%"],
    answer: 1,
    explanation: "2 = (1 + r)^10 → r ≈ 10.41%"
  },
  {
    question: "Which of the following is true for simple interest?",
    options: ["Principal changes every year", "Interest is paid on interest", "Interest is calculated only on original principal", "Interest is higher than compound interest"],
    answer: 2,
    explanation: "Simple interest is calculated only on principal."
  },
  {
    question: "The present value of ₹1,000 to be received after 2 years at 10% interest rate is:",
    options: ["₹ 800", "₹ 909", "₹ 826.4", "₹ 950"],
    answer: 2,
    explanation: "PV = 1000 / (1.1)^2 = ₹826.4"
  },
  {
    question: "Which of the following is an example of an annuity due?",
    options: ["EMI starting after 1 month", "Pension starting next year", "Rent paid at the beginning of each month", "Insurance claim at end of year"],
    answer: 2,
    explanation: "Annuity due means payment at beginning of each period."
  },
  {
    question: "A sum of ₹20,000 is deposited at 8% p.a. compounded semi-annually. What is the amount after 1 year?",
    options: ["₹ 21,600", "₹ 21,632", "₹ 21,648", "₹ 21,500"],
    answer: 1,
    explanation: "A = 20000(1 + 0.04)^2 = ₹ 21,632"
  },
  {
    question: "The future value of an annuity of ₹500 annually for 3 years at 10% is:",
    options: ["₹ 1,650", "₹ 1,576.50", "₹ 1,655", "₹ 1,500"],
    answer: 1,
    explanation: "FV = 500[(1.1)^3 – 1]/0.1 = ₹ 1,576.50"
  },
  {
    question: "Which table function is used to compute equal loan repayments?",
    options: ["Future Value Table", "Sinking Fund Table", "Amortization Table", "Compound Growth Table"],
    answer: 2,
    explanation: "Amortization Table helps calculate EMIs."
  },
  {
    question: "The difference between compound and simple interest on ₹10,000 for 2 years at 10% is:",
    options: ["₹ 100", "₹ 200", "₹ 150", "₹ 50"],
    answer: 1,
    explanation: "CI - SI = ₹200 in this case."
  },
  {
    question: "Which of the following is not a reason why interest is charged?",
    options: ["Risk", "Opportunity cost", "Inflation", "Gratitude"],
    answer: 3,
    explanation: "Gratitude isn't a financial factor."
  },
  {
    question: "If ₹16,000 amounts to ₹18,522 in 1.5 years compounded half-yearly at 10% p.a., what is the number of periods?",
    options: ["1", "3", "6", "2"],
    answer: 1,
    explanation: "Compounded half-yearly: n = 3"
  }
];

export default function App() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(Array(quizData.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 min
  const [showGreeting, setShowGreeting] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);

  useEffect(() => {
    if (started && timeLeft > 0 && !submitted) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted, started]);

  useEffect(() => {
    const handleBlur = () => {
      if (!submitted) {
        alert("Please do not switch tabs during the exam.");
        setTabSwitches((t) => t + 1);
      }
    };
    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [submitted]);

  const handleSelect = (qIndex, optIndex) => {
    const updated = [...answers];
    updated[qIndex] = optIndex;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = answers.reduce((acc, val, idx) => val === quizData[idx].answer ? acc + 1 : acc, 0);
  const mins = Math.floor(timeLeft / 60);
  const secs = String(timeLeft % 60).padStart(2, "0");

  if (!started) {
    return (
      <div className="max-w-lg mx-auto mt-20 p-6 bg-white shadow rounded">
        <h2 className="text-xl font-bold mb-4">Enter Details to Start Quiz</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />
        <button
          className="bg-blue-600 text-white w-full py-2 rounded"
          disabled={!name || !mobile}
          onClick={() => {
            setStarted(true);
            setShowGreeting(true);
            setTimeout(() => setShowGreeting(false), 20000);
            navigator.mediaDevices.getUserMedia({ video: true }).catch(() => {});
          }}
        >
          Start Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {showGreeting && (
        <div className="p-4 bg-yellow-100 rounded mb-4 text-center">
          Hello!! <strong>{name}</strong><br />
          Good luck from your Jijaji!
        </div>
      )}
      {!submitted && (
        <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
          <span>Time Left: {mins}:{secs}</span>
          <span>Tab Switches: {tabSwitches}</span>
        </div>
      )}
      <div className="mb-6">
        <p className="font-semibold text-lg">
          {currentQ + 1}. {quizData[currentQ].question}
        </p>
        <div className="mt-2 space-y-2">
          {quizData[currentQ].options.map((opt, idx) => (
            <label key={idx} className="block">
              <input
                type="radio"
                name={`q-${currentQ}`}
                checked={answers[currentQ] === idx}
                onChange={() => handleSelect(currentQ, idx)}
                className="mr-2"
                disabled={submitted}
              />
              {opt}
            </label>
          ))}
        </div>
        {submitted && (
          <div className="text-sm mt-2 text-gray-700">
            ✅ Correct Answer: {quizData[currentQ].options[quizData[currentQ].answer]}<br />
            📘 Explanation: {quizData[currentQ].explanation}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button disabled={currentQ === 0} onClick={() => setCurrentQ((q) => q - 1)} className="bg-gray-300 px-4 py-2 rounded">Previous</button>
        {!submitted ? (
          currentQ === quizData.length - 1 ? (
            <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
          ) : (
            <button onClick={() => setCurrentQ((q) => q + 1)} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
          )
        ) : (
          <button onClick={() => setCurrentQ((q) => (q + 1) % quizData.length)} className="bg-blue-500 text-white px-4 py-2 rounded">Next Review</button>
        )}
      </div>

      {submitted && currentQ === quizData.length - 1 && (
        <div className="mt-6 bg-green-100 p-4 border rounded">
          <h2 className="text-lg font-semibold">🎉 Your Score: {score} / {quizData.length}</h2>
        </div>
      )}
    </div>
  );
}
