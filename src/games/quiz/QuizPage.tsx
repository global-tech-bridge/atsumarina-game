// src/games/quiz/QuizPage.tsx

import { useState } from 'react'


const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const questions = [
    {
      question: '世界で最も高い山は？',
      options: ['エベレスト', 'キリマンジャロ', 'マウンテンピーク', 'ダイヤモンドピーク'],
      answer: 'エベレスト',
    },
    {
      question: '世界で最も大きい湖は？',
      options: ['バイカル湖', 'マリアナ海', 'カスピ海', 'カリブ海'],
      answer: 'バイカル湖',
    },
    {
      question: '世界で最も長い川は？',
      options: ['ナイル川', 'アマゾン川', 'ヨーロッパの川', 'メキシコの川'],
      answer: 'アマゾン川',
    },
    {
      question: '世界で最も深い海は？',
      options: ['マリアナ海', 'バイカル湖', 'カリブ海', 'カスピ海'],
      answer: 'マリアナ海',
    },
  ]

  const handleAnswer = (selectedOption: string) => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1)
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResult(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {showResult ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">クイズ結果</h1>
          <p className="text-lg mb-4">あなたの得点は {score} 点です。</p>
          <button
            onClick={handleRestart}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            再挑戦
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">クイズ</h1>
          <p className="text-lg mb-4">
            {questions[currentQuestion].question}
          </p>
        </div>
      )}
    </div>
  )
}

export default QuizPage
