import { useEffect, useRef, useState } from "react";
import { api, API_URL } from "../constant";
import { useTokenIds } from "../hooks/useTokenIds";
import ListPage from "./List";

interface UserPageProps {
  logout: () => void,
  token: string | null,
}

const UserPage = ({ token, logout}: UserPageProps) => {
  const [state, dispatch] = useTokenIds(token || '');
  const [newToken, setNewToken] = useState('');
  const [prices, setPrices] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);
  const tid = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (state.tokens.length === 0) {
      clearInterval(tid.current);
      tid.current = undefined;
      return;
    }

    setIsSyncing(true);
    tid.current = setInterval(() => {
      api({
        url: `${API_URL}/tokens-info`,
        method: 'POST',
        token,
        body: `{"tokenIds": [${state.tokens.join(',')}]}`
      })
      .then(resp => {
        if (resp.error) {
        } else {
          setPrices(
            resp.data.reduce((accum: Record<number, number>, token: {tokenId: number, price: number}) => {
                accum[token.tokenId] = token.price;
                return accum;
              },
              state.tokens.reduce((accum, tId) => {
                accum[tId] = null;
                return accum;
              },{} as Record<number, number | null>),
            )
          );
        }
      })
      .finally(() => setIsSyncing(false));
    }, 1000);

    return () => {
      clearInterval(tid.current)
      tid.current = undefined;
    };
  }, [state.tokens.length]);
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
