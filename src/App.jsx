// Jijaji Test Series - Full App.jsx with Supabase Last Score Sync

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import './App.css';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { supabase } from './supabaseClient';

const styles = StyleSheet.create({
  page: { padding: 30 },
  question: { marginBottom: 10 },
  explanation: { marginTop: 5, fontStyle: 'italic' }
});

// 15 CA Foundation MCQs from ICAI – Commented for brevity
const originalQuestions = [
  {
    text: "What is the formula to calculate Simple Interest (S.I)?",
    options: ["S.I = P × R × T", "S.I = P × R × T / 100", "S.I = A – P", "S.I = P × (1 + R × T)"],
    answer: 1,
    explanation: "Simple Interest = (Principal × Rate × Time) / 100."
  },
  {
    text: "S.I on ₹3,500 for 3 years at 12% p.a. is:",
    options: ["₹1,200", "₹1,260", "₹2,260", "None of these"],
    answer: 1,
    explanation: "S.I = (3500 × 12 × 3)/100 = ₹1,260"
  },
  {
    text: "What will ₹50,000 amount to in 2 years at 5.5% p.a. simple interest?",
    options: ["₹55,000", "₹55,500", "₹56,000", "None of these"],
    answer: 1,
    explanation: "I = ₹5,500; A = ₹55,500"
  },
  {
    text: "If a sum of ₹46,875 amounts to ₹50,000 in 1 year 8 months at simple interest, find the rate.",
    options: ["4%", "5%", "6%", "8%"],
    answer: 0,
    explanation: "I = ₹3,125. Rate = (I × 100)/(P × T)"
  },
  {
    text: "A sum triples in 20 years at simple interest. What is the rate of interest?",
    options: ["5%", "10%", "15%", "20%"],
    answer: 1,
    explanation: "P=100 ⇒ A=300, I=200 ⇒ R = (200×100)/(100×20) = 10%"
  },
  {
    text: "₹70,000 becomes ₹85,925 at 6.5% p.a. S.I. in how many years?",
    options: ["3.5 yrs", "4 yrs", "5 yrs", "2.5 yrs"],
    answer: 0,
    explanation: "T = (I × 100)/(P × R)"
  },
  {
    text: "A sum of ₹2,000 earns compound interest @10% p.a. for 2 years annually. Amount is:",
    options: ["₹2,420", "₹2,400", "₹2,500", "₹2,200"],
    answer: 0,
    explanation: "A = P(1 + r)^n"
  },
  {
    text: "₹4,000 invested at 10% p.a. compounded half-yearly for 1.5 years gives C.I. of:",
    options: ["₹630.50", "₹620", "₹600", "₹650.75"],
    answer: 0,
    explanation: "CI = A – P with n = 3, r = 5%"
  },
  {
    text: "What’s the effective rate for 6% p.a. compounded quarterly?",
    options: ["6.09%", "6.14%", "6.13%", "6.00%"],
    answer: 2,
    explanation: "Effective Rate = (1 + r/m)^(m) - 1"
  },
  {
    text: "Which is better: 3.2% simple interest or 3% compounded monthly?",
    options: ["Simple", "Compound", "Both same", "Can't determine"],
    answer: 0,
    explanation: "Effective CI < 3.2% ⇒ SI is better."
  },
  {
    text: "Find the C.I. on ₹16,000 for 1.5 years at 10% p.a. compounded half-yearly.",
    options: ["₹2,522", "₹2,500", "₹2,222", "None"],
    answer: 0,
    explanation: "n = 3, i = 5%; A = P(1 + i)^n"
  },
  {
    text: "A sum of ₹8,000 becomes ₹8,820 in 1 year @10% p.a. compounded half-yearly. Confirm n:",
    options: ["1", "2", "3", "4"],
    answer: 1,
    explanation: "(1.05)^2 = 1.1025 ⇒ 2 periods"
  },
  {
    text: "The formula to calculate the Present Value (PV) of future amount (A) is:",
    options: ["PV = A × (1 + i)^n", "PV = A / (1 + i)^n", "PV = A × i × n", "PV = A × (1 – i)^n"],
    answer: 1,
    explanation: "PV = A / (1 + r)^n"
  },
  {
    text: "Find present value of ₹10,000 due in 5 years at 9% p.a. compounded annually.",
    options: ["₹6,499", "₹6,500", "₹6,250", "₹7,000"],
    answer: 0,
    explanation: "PV = A / (1 + r)^n = ₹6,499"
  },
  {
    text: "To accumulate ₹3,00,000 in 10 years at 10% p.a., how much to invest yearly (annuity)?",
    options: ["₹18,823.62", "₹20,000", "₹15,000", "₹25,000"],
    answer: 0,
    explanation: "Use annuity formula: A = P[(1 + r)^n – 1]/r"
  }
];



function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function QuizPDF({ questions, responses }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {questions.map((q, idx) => (
          <View key={idx} style={styles.question}>
            <Text>{`${idx + 1}. ${q.text}`}</Text>
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
      const shuffled = shuffle(originalQuestions);
      localStorage.setItem('user', JSON.stringify({ name, mobile }));
      localStorage.setItem('questions', JSON.stringify(shuffled));
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
  const [questions, setQuestions] = useState([]);
  const [lastResult, setLastResult] = useState({ name: 'Mukesh Sharma', score: 12 });

  useEffect(() => {
    const storedQ = JSON.parse(localStorage.getItem('questions'));
    if (!storedQ) navigate('/');
    setQuestions(storedQ);

    const fetchLast = async () => {
      const { data } = await supabase.from('last_result').select('name, score').order('updated_at', { ascending: false }).limit(1).single();
      if (data) setLastResult(data);
    };
    fetchLast();
  }, [navigate]);

  useEffect(() => {
    if (timeLeft <= 0) handleSubmit();
    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    const handleBlur = () => setTabSwitches(p => p + 1);
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
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

  const handleSubmit = async (finalResponses = responses) => {
    localStorage.setItem('quizCompleted', 'true');
    localStorage.setItem('finalResponses', JSON.stringify(finalResponses));
    localStorage.setItem('finalQuestions', JSON.stringify(questions));
    const correct = questions.filter((q, i) => q.answer === finalResponses[i]).length;
    const user = JSON.parse(localStorage.getItem('user'));
    await supabase.from('last_result').insert([{ name: user?.name || 'Unknown', score: correct }]);
    navigate('/result');
  };

  if (!questions.length) return null;
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
      <div className="w-1/3 bg-slate-100 p-4 border-l">
        <p className="font-semibold mb-2">Webcam Monitoring</p>
        <div className="aspect-video rounded-xl overflow-hidden border">
          <Webcam className="w-full h-full object-cover" />
        </div>
        <div className="mt-4 text-gray-800 space-y-2 text-xl">
          <p><strong>⏱ Time Left:</strong> {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
          <p><strong>🚨 Tab Switches:</strong> {tabSwitches}</p>
          <p><strong>👤 Last Attempt:</strong> {lastResult.name} ({lastResult.score}/15)</p>
        </div>
      </div>
    </div>
  );
}

function ResultPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const responses = JSON.parse(localStorage.getItem('finalResponses')) || [];
  const questions = JSON.parse(localStorage.getItem('finalQuestions')) || [];
  const correct = questions.filter((q, i) => q.answer === responses[i]).length;

  const handleRetry = () => {
    localStorage.removeItem('quizCompleted');
    navigate('/');
  };

  return (
    <div className="min-h-screen p-6 bg-slate-100">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-700">You scored {correct} out of {questions.length}</h1>
        <p className="text-center text-xl font-medium text-gray-700">
          {correct < 6
            ? <button onClick={handleRetry} className="mt-2 bg-red-600 text-white px-4 py-2 rounded-xl">Take Test Again</button>
            : <>Thank you {user?.name}! Keep working harder 💪</>}
        </p>
        {questions.map((q, idx) => (
          <div key={idx} className="border-b pb-4">
            <h2 className="font-semibold">Q{idx + 1}: {q.text}</h2>
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


// // Enhanced Jijaji Test Series App
// // Full App.jsx with Score Display, Retry Option for Low Scores, Shuffled Questions, PDF Export

// import { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
// import Webcam from 'react-webcam';
// import './App.css';
// import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// const styles = StyleSheet.create({
//   page: { padding: 30 },
//   question: { marginBottom: 10 },
//   explanation: { marginTop: 5, fontStyle: 'italic' }
// });

// const originalQuestions = [
//   {
//     text: "What is the formula to calculate Simple Interest (S.I)?",
//     options: ["S.I = P × R × T", "S.I = P × R × T / 100", "S.I = A – P", "S.I = P × (1 + R × T)"],
//     answer: 1,
//     explanation: "Simple Interest = (Principal × Rate × Time) / 100."
//   },
//   {
//     text: "S.I on ₹3,500 for 3 years at 12% p.a. is:",
//     options: ["₹1,200", "₹1,260", "₹2,260", "None of these"],
//     answer: 1,
//     explanation: "S.I = (3500 × 12 × 3)/100 = ₹1,260"
//   },
//   {
//     text: "What will ₹50,000 amount to in 2 years at 5.5% p.a. simple interest?",
//     options: ["₹55,000", "₹55,500", "₹56,000", "None of these"],
//     answer: 1,
//     explanation: "I = ₹5,500; A = ₹55,500"
//   },
//   {
//     text: "If a sum of ₹46,875 amounts to ₹50,000 in 1 year 8 months at simple interest, find the rate.",
//     options: ["4%", "5%", "6%", "8%"],
//     answer: 0,
//     explanation: "I = ₹3,125. Rate = (I × 100)/(P × T)"
//   },
//   {
//     text: "A sum triples in 20 years at simple interest. What is the rate of interest?",
//     options: ["5%", "10%", "15%", "20%"],
//     answer: 1,
//     explanation: "P=100 ⇒ A=300, I=200 ⇒ R = (200×100)/(100×20) = 10%"
//   },
//   {
//     text: "₹70,000 becomes ₹85,925 at 6.5% p.a. S.I. in how many years?",
//     options: ["3.5 yrs", "4 yrs", "5 yrs", "2.5 yrs"],
//     answer: 0,
//     explanation: "T = (I × 100)/(P × R)"
//   },
//   {
//     text: "A sum of ₹2,000 earns compound interest @10% p.a. for 2 years annually. Amount is:",
//     options: ["₹2,420", "₹2,400", "₹2,500", "₹2,200"],
//     answer: 0,
//     explanation: "A = P(1 + r)^n"
//   },
//   {
//     text: "₹4,000 invested at 10% p.a. compounded half-yearly for 1.5 years gives C.I. of:",
//     options: ["₹630.50", "₹620", "₹600", "₹650.75"],
//     answer: 0,
//     explanation: "CI = A – P with n = 3, r = 5%"
//   },
//   {
//     text: "What’s the effective rate for 6% p.a. compounded quarterly?",
//     options: ["6.09%", "6.14%", "6.13%", "6.00%"],
//     answer: 2,
//     explanation: "Effective Rate = (1 + r/m)^(m) - 1"
//   },
//   {
//     text: "Which is better: 3.2% simple interest or 3% compounded monthly?",
//     options: ["Simple", "Compound", "Both same", "Can't determine"],
//     answer: 0,
//     explanation: "Effective CI < 3.2% ⇒ SI is better."
//   },
//   {
//     text: "Find the C.I. on ₹16,000 for 1.5 years at 10% p.a. compounded half-yearly.",
//     options: ["₹2,522", "₹2,500", "₹2,222", "None"],
//     answer: 0,
//     explanation: "n = 3, i = 5%; A = P(1 + i)^n"
//   },
//   {
//     text: "A sum of ₹8,000 becomes ₹8,820 in 1 year @10% p.a. compounded half-yearly. Confirm n:",
//     options: ["1", "2", "3", "4"],
//     answer: 1,
//     explanation: "(1.05)^2 = 1.1025 ⇒ 2 periods"
//   },
//   {
//     text: "The formula to calculate the Present Value (PV) of future amount (A) is:",
//     options: ["PV = A × (1 + i)^n", "PV = A / (1 + i)^n", "PV = A × i × n", "PV = A × (1 – i)^n"],
//     answer: 1,
//     explanation: "PV = A / (1 + r)^n"
//   },
//   {
//     text: "Find present value of ₹10,000 due in 5 years at 9% p.a. compounded annually.",
//     options: ["₹6,499", "₹6,500", "₹6,250", "₹7,000"],
//     answer: 0,
//     explanation: "PV = A / (1 + r)^n = ₹6,499"
//   },
//   {
//     text: "To accumulate ₹3,00,000 in 10 years at 10% p.a., how much to invest yearly (annuity)?",
//     options: ["₹18,823.62", "₹20,000", "₹15,000", "₹25,000"],
//     answer: 0,
//     explanation: "Use annuity formula: A = P[(1 + r)^n – 1]/r"
//   }
// ];


// function shuffle(array) {
//   const copy = [...array];
//   for (let i = copy.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [copy[i], copy[j]] = [copy[j], copy[i]];
//   }
//   return copy;
// }

// function QuizPDF({ questions, responses }) {
//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {questions.map((q, idx) => (
//           <View key={idx} style={styles.question}>
//             <Text>{`${idx + 1}. ${q.text}`}</Text>
//             {q.options.map((opt, i) => (
//               <Text key={i}>{`${String.fromCharCode(65 + i)}) ${opt}`}</Text>
//             ))}
//             <Text>Correct: {q.options[q.answer]}</Text>
//             <Text>Chosen: {typeof responses[idx] === 'number' ? q.options[responses[idx]] : 'Not Answered'}</Text>
//             <Text style={styles.explanation}>{q.explanation}</Text>
//           </View>
//         ))}
//       </Page>
//     </Document>
//   );
// }

// function LandingPage() {
//   const navigate = useNavigate();
//   const [name, setName] = useState('');
//   const [mobile, setMobile] = useState('');

//   const handleStart = () => {
//     if (name && mobile) {
//       const shuffled = shuffle(originalQuestions);
//       localStorage.setItem('user', JSON.stringify({ name, mobile }));
//       localStorage.setItem('questions', JSON.stringify(shuffled));
//       localStorage.removeItem('quizCompleted');
//       navigate('/quiz');
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4">
//       <h1 className="text-4xl font-bold mb-2 text-center">Jijaji Test Series</h1>
//       <p className="mb-6 text-lg text-gray-600">Time Value of Money – CA Foundation</p>
//       <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md space-y-4">
//         <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-xl" />
//         <input type="tel" placeholder="Mobile Number" value={mobile} onChange={e => setMobile(e.target.value)} className="w-full p-3 border rounded-xl" />
//         <div className="aspect-video rounded-xl overflow-hidden">
//           <Webcam className="w-full h-full object-cover" />
//         </div>
//         <button onClick={handleStart} className="w-full bg-blue-600 text-white p-3 rounded-xl text-lg font-semibold hover:bg-blue-700">
//           Start Quiz
//         </button>
//       </div>
//     </div>
//   );
// }

// function QuizPage() {
//   const navigate = useNavigate();
//   const [currentQ, setCurrentQ] = useState(0);
//   const [selected, setSelected] = useState(null);
//   const [responses, setResponses] = useState([]);
//   const [tabSwitches, setTabSwitches] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(1800);
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     const storedQ = JSON.parse(localStorage.getItem('questions'));
//     if (!storedQ) navigate('/');
//     setQuestions(storedQ);
//   }, []);

//   useEffect(() => {
//     if (timeLeft <= 0) handleSubmit();
//     const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
//     return () => clearInterval(interval);
//   }, [timeLeft]);

//   useEffect(() => {
//     const handleBlur = () => setTabSwitches(p => p + 1);
//     window.addEventListener('blur', handleBlur);
//     return () => window.removeEventListener('blur', handleBlur);
//   }, []);

//   const handleNext = () => {
//     const updated = [...responses];
//     updated[currentQ] = selected;
//     setResponses(updated);
//     setSelected(null);
//     if (currentQ + 1 < questions.length) {
//       setCurrentQ(currentQ + 1);
//     } else {
//       handleSubmit(updated);
//     }
//   };

//   const handleSubmit = (finalResponses = responses) => {
//     localStorage.setItem('quizCompleted', 'true');
//     localStorage.setItem('finalResponses', JSON.stringify(finalResponses));
//     localStorage.setItem('finalQuestions', JSON.stringify(questions));
//     navigate('/result');
//   };

//   if (!questions.length) return null;
//   const q = questions[currentQ];

//   return (
//     <div className="flex h-screen">
//       <div className="w-2/3 p-6 space-y-6 bg-white overflow-y-auto">
//         <h2 className="text-2xl font-bold text-gray-800">Question {currentQ + 1}</h2>
//         <p className="text-xl text-gray-700">{q.text}</p>
//         <div className="space-y-4">
//           {q.options.map((opt, idx) => (
//             <label key={idx} className="flex items-start space-x-3 text-lg">
//               <input type="radio" name="option" checked={selected === idx} onChange={() => setSelected(idx)} className="mt-1" />
//               <span>{opt}</span>
//             </label>
//           ))}
//         </div>
//         <button disabled={selected === null} onClick={handleNext} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold disabled:bg-gray-400">
//           {currentQ + 1 === questions.length ? 'Submit' : 'Next'}
//         </button>
//       </div>
//       <div className="w-1/3 bg-slate-100 p-4 border-l">
//         <p className="font-semibold mb-2">Webcam Monitoring</p>
//         <div className="aspect-video rounded-xl overflow-hidden border">
//           <Webcam className="w-full h-full object-cover" />
//         </div>
//         <div className="mt-4 text-gray-800 space-y-2 text-xl">
//           <p><strong>⏱ Time Left:</strong> {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
//           <p><strong>🚨 Tab Switches:</strong> {tabSwitches}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ResultPage() {
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem('user'));
//   const responses = JSON.parse(localStorage.getItem('finalResponses')) || [];
//   const questions = JSON.parse(localStorage.getItem('finalQuestions')) || [];
//   const correct = questions.filter((q, i) => q.answer === responses[i]).length;

//   const handleRetry = () => {
//     localStorage.removeItem('quizCompleted');
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen p-6 bg-slate-100">
//       <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
//         <h1 className="text-3xl font-bold text-center text-blue-700">You scored {correct} out of {questions.length}</h1>
//         <p className="text-center text-xl font-medium text-gray-700">
//           {correct < 6
//             ? <button onClick={handleRetry} className="mt-2 bg-red-600 text-white px-4 py-2 rounded-xl">Take Test Again</button>
//             : <>Thank you {user?.name}! Keep working harder 💪</>}
//         </p>
//         {questions.map((q, idx) => (
//           <div key={idx} className="border-b pb-4">
//             <h2 className="font-semibold">Q{idx + 1}: {q.text}</h2>
//             <p>Your Answer: <strong className={responses[idx] === q.answer ? 'text-green-600' : 'text-red-600'}>{q.options[responses[idx]] || 'Not Answered'}</strong></p>
//             <p>Correct Answer: <strong className="text-green-700">{q.options[q.answer]}</strong></p>
//             <p className="text-sm text-gray-500 italic">Explanation: {q.explanation}</p>
//           </div>
//         ))}
//         <div className="mt-6 text-center">
//           <PDFDownloadLink document={<QuizPDF questions={questions} responses={responses} />} fileName="Jijaji_Quiz_Solutions.pdf">
//             {({ loading }) => (
//               <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold">
//                 {loading ? 'Preparing PDF...' : 'Download Solutions PDF'}
//               </button>
//             )}
//           </PDFDownloadLink>
//         </div>
//       </div>
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/quiz" element={<QuizPage />} />
//         <Route path="/result" element={<ResultPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// // Enhanced Jijaji Test Series App
// // Includes: 15 CA-Level Time Value of Money Questions, State Persistence, PDF Export

// import { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// import Webcam from 'react-webcam';
// import './App.css';
// import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// const styles = StyleSheet.create({
//   page: { padding: 30 },
//   question: { marginBottom: 10 },
//   explanation: { marginTop: 5, fontStyle: 'italic' }
// });

// const questions = [
//   {
//     question: "What is the difference between compound and simple interest at 5% per annum for 4 years on ₹20,000?",
//     options: ["₹250", "₹277", "₹300", "₹310"],
//     answer: 3,
//     explanation: "CI - SI for 4 years on ₹20,000 at 5% = ₹310 (Using CI and SI formulas)"
//   },
//   {
//     question: "A sum doubles in 5 years under SI. When will it become 8 times?",
//     options: ["35 years", "40 years", "45 years", "50 years"],
//     answer: 1,
//     explanation: "If it doubles in 5 years, it becomes 8x in 40 years under simple interest."
//   },
//   {
//     question: "Present value of ₹10,000 in 5 years at 8%?",
//     options: ["₹6,805", "₹6,805.83", "₹6,806", "₹6,806.41"],
//     answer: 3,
//     explanation: "PV = 10000 / (1+0.08)^5 ≈ ₹6,806.41"
//   },
//   {
//     question: "₹1,000 at 12% per annum compounded quarterly for 2 years becomes?",
//     options: ["₹1,268.24", "₹1,268.25", "₹1,268.26", "₹1,268.27"],
//     answer: 1,
//     explanation: "FV = 1000 × (1 + 0.03)^8 ≈ ₹1,268.25"
//   },
//   {
//     question: "A machine costing ₹50,000 depreciates at 10% per annum. Value after 3 years?",
//     options: ["₹36,450", "₹36,450.45", "₹36,450.49", "₹36,450.50"],
//     answer: 2,
//     explanation: "Value = ₹50,000 × (0.9)^3 = ₹36,450.49"
//   },
//   {
//     question: "Find effective rate corresponding to 6% nominal rate compounded semi-annually.",
//     options: ["6.06%", "6.08%", "6.09%", "6.10%"],
//     answer: 2,
//     explanation: "EAR = (1 + 0.06/2)^2 - 1 = 6.09%"
//   },
//   {
//     question: "₹5,000 deposited yearly for 5 years @10% compounded annually becomes?",
//     options: ["₹30,525", "₹30,530", "₹30,600", "₹30,625"],
//     answer: 0,
//     explanation: "FV = 5000 × [(1+0.10)^5 – 1]/0.10 = ₹30,525"
//   },
//   {
//     question: "If CI for 2 years is ₹3,816 and SI is ₹3,600, find principal.",
//     options: ["₹15,000", "₹18,000", "₹20,000", "₹30,000"],
//     answer: 2,
//     explanation: "SI = P×r×t/100 = ₹3,600 ⇒ P = ₹20,000"
//   },
//   {
//     question: "What is the SI on ₹1,000 for 3 years at 5% p.a.?",
//     options: ["₹100", "₹150", "₹125", "₹120"],
//     answer: 1,
//     explanation: "SI = P×r×t/100 = 1000×5×3/100 = ₹150"
//   },
//   {
//     question: "At what rate ₹10,000 becomes ₹14,641 in 3 years compounded annually?",
//     options: ["12%", "13%", "14%", "15%"],
//     answer: 3,
//     explanation: "A = P(1+r)^n ⇒ 14641 = 10000(1+r)^3 ⇒ r = 15%"
//   },
//   {
//     question: "Discount factor for ₹1 at 8% in 4 years is?",
//     options: ["0.7350", "0.73503", "0.7351", "0.735"],
//     answer: 1,
//     explanation: "PV = 1 / (1+0.08)^4 ≈ 0.73503"
//   },
//   {
//     question: "Which method considers time value of money in capital budgeting?",
//     options: ["Payback", "ARR", "NPV", "Accounting Rate"],
//     answer: 2,
//     explanation: "NPV considers time value of money."
//   },
//   {
//     question: "A sum becomes ₹6,600 in 3 years and ₹6,000 in 2 years CI. Rate?",
//     options: ["10%", "12%", "15%", "8%"],
//     answer: 0,
//     explanation: "6600/6000 = 1.1 ⇒ r = 10%"
//   },
//   {
//     question: "Time taken to double money at 10% CI annually?",
//     options: ["7.2 years", "7 years", "7.3 years", "7.5 years"],
//     answer: 0,
//     explanation: "Using Rule of 72 ⇒ 72/10 = 7.2 years"
//   },
//   {
//     question: "Present value of ₹1,000 due in 10 years at 6%?",
//     options: ["₹558.39", "₹558", "₹558.4", "₹559"],
//     answer: 0,
//     explanation: "PV = 1000 / (1.06)^10 = ₹558.39"
//   }
// ];

// function QuizPDF({ questions, responses }) {
//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {questions.map((q, idx) => (
//           <View key={idx} style={styles.question}>
//             <Text>{`${idx + 1}. ${q.question}`}</Text>
//             {q.options.map((opt, i) => (
//               <Text key={i}>{`${String.fromCharCode(65 + i)}) ${opt}`}</Text>
//             ))}
//             <Text>Correct: {q.options[q.answer]}</Text>
//             <Text>Chosen: {typeof responses[idx] === 'number' ? q.options[responses[idx]] : 'Not Answered'}</Text>
//             <Text style={styles.explanation}>{q.explanation}</Text>
//           </View>
//         ))}
//       </Page>
//     </Document>
//   );
// }

// function LandingPage() {
//   const navigate = useNavigate();
//   const [name, setName] = useState('');
//   const [mobile, setMobile] = useState('');

//   const handleStart = () => {
//     if (name && mobile) {
//       localStorage.setItem('user', JSON.stringify({ name, mobile }));
//       localStorage.removeItem('quizCompleted');
//       navigate('/quiz');
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4">
//       <h1 className="text-4xl font-bold mb-2 text-center">Jijaji Test Series</h1>
//       <p className="mb-6 text-lg text-gray-600">Time Value of Money – CA Foundation</p>
//       <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md space-y-4">
//         <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-xl" />
//         <input type="tel" placeholder="Mobile Number" value={mobile} onChange={e => setMobile(e.target.value)} className="w-full p-3 border rounded-xl" />
//         <div className="aspect-video rounded-xl overflow-hidden">
//           <Webcam className="w-full h-full object-cover" />
//         </div>
//         <button onClick={handleStart} className="w-full bg-blue-600 text-white p-3 rounded-xl text-lg font-semibold hover:bg-blue-700">
//           Start Quiz
//         </button>
//       </div>
//     </div>
//   );
// }

// function QuizPage() {
//   const navigate = useNavigate();
//   const [currentQ, setCurrentQ] = useState(0);
//   const [selected, setSelected] = useState(null);
//   const [responses, setResponses] = useState([]);
//   const [tabSwitches, setTabSwitches] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(1800);

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem('quizState'));
//     if (stored) {
//       setCurrentQ(stored.currentQ);
//       setResponses(stored.responses);
//       setTimeLeft(stored.timeLeft);
//     }
//   }, []);

//   useEffect(() => {
//     if (timeLeft <= 0) handleSubmit();
//     const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
//     return () => clearInterval(interval);
//   }, [timeLeft]);

//   useEffect(() => {
//     const saveState = () => {
//       localStorage.setItem('quizState', JSON.stringify({ currentQ, responses, timeLeft }));
//     };
//     saveState();
//   }, [currentQ, responses, timeLeft]);

//   useEffect(() => {
//     window.addEventListener('blur', () => setTabSwitches(p => p + 1));
//     return () => window.removeEventListener('blur', () => {});
//   }, []);

//   const handleNext = () => {
//     const updated = [...responses];
//     updated[currentQ] = selected;
//     setResponses(updated);
//     setSelected(null);
//     if (currentQ + 1 < questions.length) {
//       setCurrentQ(currentQ + 1);
//     } else {
//       handleSubmit(updated);
//     }
//   };

//   const handleSubmit = (finalResponses = responses) => {
//     localStorage.setItem('quizCompleted', 'true');
//     localStorage.setItem('finalResponses', JSON.stringify(finalResponses));
//     navigate('/result');
//   };

//   const q = questions[currentQ];

//   return (
//     <div className="flex h-screen">
//       <div className="w-2/3 p-6 space-y-6 bg-white">
//         <h2 className="text-2xl font-bold">Question {currentQ + 1}</h2>
//         <p className="text-xl">{q.question}</p>
//         <div className="space-y-3">
//           {q.options.map((opt, idx) => (
//             <label key={idx} className="flex items-start space-x-3 text-lg">
//               <input type="radio" name="option" checked={selected === idx} onChange={() => setSelected(idx)} />
//               <span>{opt}</span>
//             </label>
//           ))}
//         </div>
//         <button onClick={handleNext} disabled={selected === null} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl disabled:bg-gray-400">
//           {currentQ + 1 === questions.length ? 'Submit' : 'Next'}
//         </button>
//       </div>
//       <div className="w-1/3 bg-slate-100 p-4 border-l">
//         <p className="font-semibold mb-2">Webcam Monitoring</p>
//         <Webcam className="aspect-video w-full rounded-xl" />
//         <div className="mt-4 text-gray-600">
//           <p><strong>Time Left:</strong> {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
//           <p><strong>Tab Switches:</strong> {tabSwitches}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ResultPage() {
//   const responses = JSON.parse(localStorage.getItem('finalResponses')) || [];
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!localStorage.getItem('quizCompleted')) {
//       navigate('/');
//     }
//   }, []);

//   return (
//     <div className="min-h-screen p-6 bg-slate-100">
//       <h1 className="text-3xl font-bold text-center mb-6">Quiz Results</h1>
//       <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
//         {questions.map((q, idx) => (
//           <div key={idx} className="border-b pb-4">
//             <h2 className="font-semibold">Q{idx + 1}: {q.question}</h2>
//             <p>Your Answer: <strong className={responses[idx] === q.answer ? 'text-green-600' : 'text-red-600'}>{q.options[responses[idx]] || 'Not Answered'}</strong></p>
//             <p>Correct Answer: <strong className="text-green-700">{q.options[q.answer]}</strong></p>
//             <p className="text-sm text-gray-500 italic">Explanation: {q.explanation}</p>
//           </div>
//         ))}
//         <div className="mt-6 text-center">
//           <PDFDownloadLink document={<QuizPDF questions={questions} responses={responses} />} fileName="Jijaji_Quiz_Solutions.pdf">
//             {({ loading }) => (
//               <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold">
//                 {loading ? 'Preparing PDF...' : 'Download Solutions PDF'}
//               </button>
//             )}
//           </PDFDownloadLink>
//         </div>
//       </div>
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/quiz" element={<QuizPage />} />
//         <Route path="/result" element={<ResultPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
