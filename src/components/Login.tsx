import { FormEvent, useEffect, useState, Dispatch } from "react";
import { api, API_URL } from "../constant";


interface LoginPageProps {
  setToken: Dispatch<string | null>,
}

const LoginPage = ({ setToken }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onLogin = (event: FormEvent) => {
    if (username.length && password.length) {
      event.preventDefault();
      setIsLoading(true);
    }
  }

  useEffect(() => {
    if (!isLoading) {
      return
    }
    api({
      url: `${API_URL}/login`,
      method: 'POST',
      body: `{"username": "${username}", "password": "${password}"}`
    })
    .then(resp => {
      if (resp?.error) {
        setError(resp.error?.message ?? 'COULD NOT LOGIN');
      } else {
        setToken(resp?.data?.token || null);
      }
    }).finally(() => {
      setIsLoading(false);
    })
  }, [isLoading]);
  return (
    <>
      {error ? <div>FAILURE: {error}</div> : null}
      <form style={{display: 'flex', flexDirection: 'column', width: '500px', gap:'10px'}}>
        Username*
        <input
          disabled={isLoading}
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
          required
        />
        Password*
        <input
          disabled={isLoading}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          required
        />
        <br/>
        <button onClick={onLogin} disabled={isLoading}>LOGIN</button>
      </form>
    </>
  )
}

export default LoginPage;
