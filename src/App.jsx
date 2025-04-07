// Complete professional-quality quiz app for Jijaji Test Series
// React + TailwindCSS + React Router + Webcam + Multi-page

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import './App.css';

const questions = [
  {
    text: "What is the primary reason interest is charged on borrowed money?",
    options: [
      "To reward the borrower",
      "Due to government regulation",
      "Time value of money",
      "Inflation"
    ],
    answer: 2,
    explanation: "Interest is charged primarily due to the time value of money — money today is worth more than the same amount in the future."
  },
  {
    text: "What does the term 'present value' mean?",
    options: [
      "Value of future money today",
      "Amount received in future",
      "Amount paid as interest",
      "None of the above"
    ],
    answer: 0,
    explanation: "Present value is the current worth of a future sum of money, discounted at a specific rate."
  }
];

function LandingPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  const handleStart = () => {
    if (name && mobile) {
      localStorage.setItem('userName', name);
      localStorage.setItem('userMobile', mobile);
      navigate('/quiz');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 px-4">
      <h1 className="text-4xl font-bold mb-2 text-center">Jijaji Test Series</h1>
      <p className="mb-6 text-lg text-gray-600">Time Value of Money – Mock Test</p>
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md space-y-4">
        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-xl" />
        <input type="tel" placeholder="Mobile Number" value={mobile} onChange={e => setMobile(e.target.value)} className="w-full p-3 border rounded-xl" />
        <div className="aspect-video rounded-xl overflow-hidden">
          <Webcam className="w-full h-full object-cover" />
        </div>
        <button onClick={handleStart} className="w-full bg-blue-600 text-white p-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition">
          Start Quiz
        </button>
      </div>
    </div>
  );
}

function QuizPage() {
  const [selected, setSelected] = useState(null);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [responses, setResponses] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
  const navigate = useNavigate();

  useEffect(() => {
    const handleBlur = () => setTabSwitches(prev => prev + 1);
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) navigate('/result', { state: { responses } });
    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleNext = () => {
    setResponses([...responses, selected]);
    setSelected(null);
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      navigate('/result', { state: { responses: [...responses, selected] } });
    }
  };

  const q = questions[currentQ];

  return (
    <div className="flex h-screen">
      <div className="w-2/3 p-6 space-y-6 bg-white overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800">Question {currentQ + 1}</h2>
        <p className="text-xl text-gray-700">{q.text}</p>
        <div className="space-y-4">
          {q.options.map((opt, idx) => (
            <label key={idx} className="flex items-start space-x-3 text-lg">
              <input type="radio" name="option" checked={selected === idx} onChange={() => setSelected(idx)} className="mt-1" />
              <span>{opt}</span>
            </label>
          ))}
        </div>
        <button disabled={selected === null} onClick={handleNext} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold disabled:bg-gray-400">
          {currentQ + 1 === questions.length ? 'Submit' : 'Next'}
        </button>
      </div>
      <div className="w-1/3 bg-slate-50 p-4 border-l">
        <p className="mb-2 font-semibold">Webcam Monitoring</p>
        <div className="aspect-video rounded-xl overflow-hidden border">
          <Webcam className="w-full h-full object-cover" />
        </div>
        <div className="mt-4 text-gray-600 space-y-1">
          <p><strong>Time Left:</strong> {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
          <p><strong>Tab Switches:</strong> {tabSwitches}</p>
        </div>
      </div>
    </div>
  );
}

function ResultPage({ location }) {
  const responses = location?.state?.responses || [];

  return (
    <div className="min-h-screen p-6 bg-slate-100">
      <h1 className="text-3xl font-bold text-center mb-6">Quiz Result</h1>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
        {questions.map((q, idx) => (
          <div key={idx} className="border-b pb-4">
            <h2 className="text-lg font-semibold">Q{idx + 1}: {q.text}</h2>
            <p className="text-gray-600">Your Answer: <strong className={responses[idx] === q.answer ? 'text-green-600' : 'text-red-600'}>{q.options[responses[idx]] || 'Not answered'}</strong></p>
            <p className="text-gray-600">Correct Answer: <strong className="text-green-700">{q.options[q.answer]}</strong></p>
            <p className="text-sm text-gray-500 mt-1 italic">Explanation: {q.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
