import { FormEvent, useEffect, useState, Dispatch } from "react";

const API_URL = 'http://127.0.0.1:8888'

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
    fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: `{"username": "${username}", "password": "${password}"}`
    })
    .then(resp => resp.json())
    .then(resp => {
      if (resp?.error) {
        setError(resp.error?.message ?? 'COULD NOT LOGIN');
      } else {
        setToken(resp?.data?.token || null);
      }
      console.log('look at me', resp);
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
