// src/pages/NotFound.tsx

import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div>
      <h1>ページが見つかりません</h1>
      <Link to="/">ホームに戻る</Link>
    </div>
  )
}
