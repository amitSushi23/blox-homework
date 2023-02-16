import { useEffect, useRef, useState } from "react";
import { api, API_URL } from "../constant";

// const FIVE_MINUTES_IN_MILLISEC = 5 * 60 * 1000;
const FIVE_MINUTES_IN_MILLISEC = 3000;

interface ListPageProps {
  token: string | null,
}

const ListPage = ({ token }: ListPageProps) => {
  const tid = useRef<number | undefined>(undefined);
  const [isBgLoading, setIsBgLoading] = useState(false);
  const [tokenIds, setTokenIds] = useState<number[]>([]);
  const [prices, setPrices] = useState<Map<number, number>>(new Map());
  const [hasError, setHasError] = useState<boolean>(false);
  useEffect(() => {
    if (tokenIds.length > 0) {
      return
    }
    fetch(`${API_URL}/user/tokens`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || '',
      },
    })
    .then(resp => resp.json())
    .then(resp => {
      if (resp.error) {
        setHasError(true);
      } else {
        setHasError(false);
        setTokenIds(resp.data.map((t: {tokenId: number}) => t.tokenId));
        fetch(`${API_URL}/tokens-info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token || '',
          },
          body: `{"tokenIds": [${tokenIds.join(',')}]}`
        })
        .then(resp => resp.json())
        .then(resp => {
          console.log('look here', resp);
        })
      }
    });
  }, [])
  useEffect(() => {
    if (tokenIds.length === 0) {
      return
    }
    console.log('look', tokenIds);
    tid.current = setInterval(() => {
      setIsBgLoading(true);
      api({
        url: `${API_URL}/tokens-info`,
        method: 'POST',
        token,
        body: `{"tokenIds": [${tokenIds.join(',')}]}`
      })
      .then(resp => {
        if (resp.error) {
          setHasError(true);
        } else {
          const temp = new Map();
          resp.data.forEach((current: {tokenId: number, price: number}) => {
            temp.set(current.tokenId, current.price);
          });
          setPrices(temp);
          setHasError(false);
        }
      })
      .finally(() => setIsBgLoading(false));
    }, FIVE_MINUTES_IN_MILLISEC);

    return () => {
      clearInterval(tid.current);
    }
  }, [tokenIds]);
  return (
    <>
      {hasError ? <div>FAILURE: COULD NOT FETCH DATA</div> : null}
      <h1>TOKENS!</h1>
      <ul>{tokenIds.map(tokenId => (
        <li key={tokenId}>TOKEN ID: {tokenId} = {prices.get(tokenId) ? `${prices.get(tokenId)}$` : 'ON HOLD'}</li>
      ))}</ul>
    </>
  );
};

export default ListPage;
