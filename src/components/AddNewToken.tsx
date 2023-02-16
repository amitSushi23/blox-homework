import { Dispatch, useState } from "react";
import { TTokenActions } from "../hooks/useTokenIds";

interface AddNewTokenProps {
  dispatch: Dispatch<TTokenActions>
}

const AddNewToken = ({ dispatch }: AddNewTokenProps) => {
  const [newToken, setNewToken] = useState<string>('');
  return (
    <div>
      token: <input value={newToken} onChange={(e) => setNewToken(e.currentTarget.value)} />
      <button
        type="button"
        disabled={newToken.trim().length === 0 || isNaN(parseInt(newToken))}
        onClick={() => {
          dispatch({ type: 'ADD_TOKEN', data: Number(newToken ) });
          setNewToken('');
        }}
      >Add new token</button>
    </div>
  )
}

export default AddNewToken;
