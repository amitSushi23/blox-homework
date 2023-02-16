import { useState } from "react"
import LoginPage from "./components/Login";
import UserPage from "./components/UserPage";

const TOKEN = null;
function App() {
  const [token, setToken] = useState<string | null>(TOKEN);
  return (
    token === null ? <LoginPage setToken={setToken} /> : <UserPage token={token} logout={() => setToken(null)} />
  )
}

export default App
