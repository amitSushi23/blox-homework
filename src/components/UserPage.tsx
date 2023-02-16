import { useEffect, useRef, useState } from "react";
import { api, API_URL, TApiParams } from "../constant";
import { usePriceSync } from "../hooks/usePriceSync";
import { useTokenIds } from "../hooks/useTokenIds";
import ListPage from "./List";

interface UserPageProps {
  logout: () => void,
  token: string | null,
}

const apiPayload = (token: string, tokens: number[]): TApiParams => ({
  url: `${API_URL}/tokens-info`,
  method: 'POST',
  token,
  body: `{"tokenIds": [${tokens.join(',')}]}`
})

const UserPage = ({ token, logout}: UserPageProps) => {
  const [state, dispatch] = useTokenIds(token || '');
  const [newToken, setNewToken] = useState('');
  const {isSyncing, prices} = usePriceSync(state.tokens, api(apiPayload(token || '', state.tokens)));
  return (
    <>
      <button onClick={logout}>LOGOUT</button>
      <ListPage
        onDelete={(tid: number) => {
          dispatch({ type: 'REMOVE_TOKEN', data: tid })
        }}
        status={isSyncing ? 'SYNCING' : 'IDLE'}
        items={prices}
      />
      <div>
        token: <input value={newToken} onChange={(e) => setNewToken(e.currentTarget.value)} />
        <button type="button" disabled={newToken.length === 0} onClick={() => {
          dispatch({ type: 'ADD_TOKEN', data: Number(newToken ) });
          setNewToken('');
        }}>Add</button>
      </div>
    </>
  )
}

export default UserPage;
