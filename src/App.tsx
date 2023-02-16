import { useState } from "react"
import LoginPage from "./components/Login";

function App() {
  const [token, setToken] = useState<string | null>(null)
  return (
    token === null ? <LoginPage setToken={setToken} /> : <div>Hello world</div>
  )
}

export default App
