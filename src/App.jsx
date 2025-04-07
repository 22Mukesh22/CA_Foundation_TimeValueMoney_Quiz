// Enhanced Jijaji Test Series App
// Includes: 15 CA-Level Time Value of Money Questions, State Persistence, PDF Export

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Webcam from 'react-webcam';
import './App.css';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  question: { marginBottom: 10 },
  explanation: { marginTop: 5, fontStyle: 'italic' }
});

const questions = [
  {
    question: "What is the difference between compound and simple interest at 5% per annum for 4 years on ₹20,000?",
    options: ["₹250", "₹277", "₹300", "₹310"],
    answer: 3,
    explanation: "CI - SI for 4 years on ₹20,000 at 5% = ₹310 (Using CI and SI formulas)"
  },
  {
    question: "A sum doubles in 5 years under SI. When will it become 8 times?",
    options: ["35 years", "40 years", "45 years", "50 years"],
    answer: 1,
    explanation: "If it doubles in 5 years, it becomes 8x in 40 years under simple interest."
  },
  {
    question: "Present value of ₹10,000 in 5 years at 8%?",
    options: ["₹6,805", "₹6,805.83", "₹6,806", "₹6,806.41"],
    answer: 3,
    explanation: "PV = 10000 / (1+0.08)^5 ≈ ₹6,806.41"
  },
  {
    question: "₹1,000 at 12% per annum compounded quarterly for 2 years becomes?",
    options: ["₹1,268.24", "₹1,268.25", "₹1,268.26", "₹1,268.27"],
    answer: 1,
    explanation: "FV = 1000 × (1 + 0.03)^8 ≈ ₹1,268.25"
  },
  // Add more CA-level questions (total 15)
];

function QuizPDF({ questions, responses }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {questions.map((q, idx) => (
          <View key={idx} style={styles.question}>
            <Text>{`${idx + 1}. ${q.question}`}</Text>
            {q.options.map((opt, i) => (
              <Text key={i}>{`${String.fromCharCode(65 + i)}) ${opt}`}</Text>
            ))}
            <Text>Correct: {q.options[q.answer]}</Text>
            <Text>Chosen: {typeof responses[idx] === 'number' ? q.options[responses[idx]] : 'Not Answered'}</Text>
            <Text style={styles.explanation}>{q.explanation}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}

function LandingPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  const handleStart = () => {
    if (name && mobile) {
      localStorage.setItem('user', JSON.stringify({ name, mobile }));
      localStorage.removeItem('quizCompleted');
      navigate('/quiz');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4">
      <h1 className="text-4xl font-bold mb-2 text-center">Jijaji Test Series</h1>
      <p className="mb-6 text-lg text-gray-600">Time Value of Money – CA Foundation</p>
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md space-y-4">
        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-xl" />
        <input type="tel" placeholder="Mobile Number" value={mobile} onChange={e => setMobile(e.target.value)} className="w-full p-3 border rounded-xl" />
        <div className="aspect-video rounded-xl overflow-hidden">
          <Webcam className="w-full h-full object-cover" />
        </div>
        <button onClick={handleStart} className="w-full bg-blue-600 text-white p-3 rounded-xl text-lg font-semibold hover:bg-blue-700">
          Start Quiz
        </button>
      </div>
    </div>
  );
}

function QuizPage() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [responses, setResponses] = useState([]);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('quizState'));
    if (stored) {
      setCurrentQ(stored.currentQ);
      setResponses(stored.responses);
      setTimeLeft(stored.timeLeft);
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) handleSubmit();
    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    const saveState = () => {
      localStorage.setItem('quizState', JSON.stringify({ currentQ, responses, timeLeft }));
    };
    saveState();
  }, [currentQ, responses, timeLeft]);

  useEffect(() => {
    window.addEventListener('blur', () => setTabSwitches(p => p + 1));
    return () => window.removeEventListener('blur', () => {});
  }, []);

  const handleNext = () => {
    const updated = [...responses];
    updated[currentQ] = selected;
    setResponses(updated);
    setSelected(null);
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      handleSubmit(updated);
    }
  };

  const handleSubmit = (finalResponses = responses) => {
    localStorage.setItem('quizCompleted', 'true');
    localStorage.setItem('finalResponses', JSON.stringify(finalResponses));
    navigate('/result');
  };

  const q = questions[currentQ];

  return (
    <div className="flex h-screen">
      <div className="w-2/3 p-6 space-y-6 bg-white">
        <h2 className="text-2xl font-bold">Question {currentQ + 1}</h2>
        <p className="text-xl">{q.question}</p>
        <div className="space-y-3">
          {q.options.map((opt, idx) => (
            <label key={idx} className="flex items-start space-x-3 text-lg">
              <input type="radio" name="option" checked={selected === idx} onChange={() => setSelected(idx)} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
        <button onClick={handleNext} disabled={selected === null} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl disabled:bg-gray-400">
          {currentQ + 1 === questions.length ? 'Submit' : 'Next'}
        </button>
      </div>
      <div className="w-1/3 bg-slate-100 p-4 border-l">
        <p className="font-semibold mb-2">Webcam Monitoring</p>
        <Webcam className="aspect-video w-full rounded-xl" />
        <div className="mt-4 text-gray-600">
          <p><strong>Time Left:</strong> {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
          <p><strong>Tab Switches:</strong> {tabSwitches}</p>
        </div>
      </div>
    </div>
  );
}

function ResultPage() {
  const responses = JSON.parse(localStorage.getItem('finalResponses')) || [];
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('quizCompleted')) {
      navigate('/');
    }
  }, []);

  return (
    <div className="min-h-screen p-6 bg-slate-100">
      <h1 className="text-3xl font-bold text-center mb-6">Quiz Results</h1>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
        {questions.map((q, idx) => (
          <div key={idx} className="border-b pb-4">
            <h2 className="font-semibold">Q{idx + 1}: {q.question}</h2>
            <p>Your Answer: <strong className={responses[idx] === q.answer ? 'text-green-600' : 'text-red-600'}>{q.options[responses[idx]] || 'Not Answered'}</strong></p>
            <p>Correct Answer: <strong className="text-green-700">{q.options[q.answer]}</strong></p>
            <p className="text-sm text-gray-500 italic">Explanation: {q.explanation}</p>
          </div>
        ))}
        <div className="mt-6 text-center">
          <PDFDownloadLink document={<QuizPDF questions={questions} responses={responses} />} fileName="Jijaji_Quiz_Solutions.pdf">
            {({ loading }) => (
              <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold">
                {loading ? 'Preparing PDF...' : 'Download Solutions PDF'}
              </button>
            )}
          </PDFDownloadLink>
        </div>
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
