import { useState } from "react"
import ListPage from "./components/List";
import LoginPage from "./components/Login";

const TOKEN = "eacad0c4-e0fd-453e-985a-ea52640c1909" // null; //'539dda7d-5bac-462f-aa5d-fcf976d25ad1';
function App() {
  const [token, setToken] = useState<string | null>(TOKEN);
  return (
    token === null ? <LoginPage setToken={setToken} /> : <ListPage token={token} />
  )
}

export default App
