import { useEffect, useReducer } from "react";
import { api, API_URL } from "../constant";

export interface TokenState {
  status: 'LOADING' | 'ERROR' | 'IDLE' | 'SYNCING',
  tokens: number[],
  error: string | null,
}

export type TTokenActions = { type: 'SUCCESS', data: number[] } |
  { type: 'FAILURE', data: string } |
  { type: 'REMOVE_TOKEN', data: number } |
  { type: 'ADD_TOKEN', data: number };

const tokenReducer = (state: TokenState, action: TTokenActions): TokenState => {
  switch(action.type) {
    case 'SUCCESS':
      return {
        status: 'IDLE',
        tokens: action.data,
        error: null,
      };
      case 'FAILURE':
        return {
          status: 'ERROR',
          tokens: state.tokens,
          error: action.data,
        };
      case 'REMOVE_TOKEN':
        return {
          status: 'SYNCING',
          tokens: state.tokens.filter(token => token !== action.data),
          error: null,
        }
      case 'ADD_TOKEN':
        return {
          status: 'SYNCING',
          tokens: [...state.tokens, action.data],
          error: null,
        }
    default:
      return state;
  }
}

export const useTokenIds = (apiToken: string) => {
  const [state, dispatch] = useReducer(tokenReducer, {
    status: 'LOADING',
    tokens: [],
    error: null,
  })

  useEffect(() => {
    if (state.status !== 'SYNCING') {
      return;
    }
    api({
      method: 'POST',
      url: `${API_URL}/user/tokens`,
      token: apiToken,
      body: `{"tokenIds": [${state.tokens.join(',')}]}`
    }).then(resp => {
      if (resp.err) {
        dispatch({
          type: 'FAILURE',
          data: 'FAILED FETCHING TOKENS',
        });
      } else {
        dispatch({
          type: 'SUCCESS',
          data: resp.data.map((token: {tokenId: number}) => token.tokenId),
        });
      }
    }).catch(_ => {
      dispatch({
        type: 'FAILURE',
        data: 'FAILED FETCHING TOKENS',
      });
    })
  }, [state.status]);

  useEffect(() => {
    if (state.status !== 'LOADING') {
      return;
    }
    api({
      url: `${API_URL}/user/tokens`,
      token: apiToken,
    })
    .then(resp => {
      if (resp.data) {
        dispatch({
          type: 'SUCCESS',
          data: resp.data.map((token: {tokenId: number}) => token.tokenId)
        });
      } else {
        dispatch({ type: 'FAILURE', data: 'NO DATA' });
      }
    })
  }, [state.status]);

  return [state, dispatch] as const;
}
