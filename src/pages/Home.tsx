import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <h1>ミニゲームアプリへようこそ！</h1>
      <ul>
        <li><Link to="/games/quiz">クイズゲーム</Link></li>
        <li><Link to="/games/othello">オセロ</Link></li>
        <li><Link to="/games/shooter">シューティング</Link></li>
      </ul>
    </div>
  )
}
