import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import QuizPage from '../games/quiz/QuizPage'
import OthelloPage from '../games/othello/OthelloPage'
import ShooterPage from '../games/shooter/ShooterPage'
import NotFound from '../pages/NotFound'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/quiz" element={<QuizPage />} />
        <Route path="/games/othello" element={<OthelloPage />} />
        <Route path="/games/shooter" element={<ShooterPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
