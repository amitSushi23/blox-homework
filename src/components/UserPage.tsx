import { api, API_URL, TApiParams } from "../constant";
import { usePriceSync } from "../hooks/usePriceSync";
import { useTokenIds } from "../hooks/useTokenIds";
import AddNewToken from "./AddNewToken";
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
      <AddNewToken dispatch={dispatch} />
    </>
  )
}

export default UserPage;
