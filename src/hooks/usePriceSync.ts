import { useEffect, useRef, useState } from "react";

export const usePriceSync = (tokens: number[], apicall: Promise<any>) => {
  const [prices, setPrices] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);
  const tid = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (tokens.length === 0) {
      clearInterval(tid.current);
      tid.current = undefined;
      return;
    }

    setIsSyncing(true);
    tid.current = setInterval(() => {
      apicall
      .then(resp => {
        if (resp.error) {
        } else {
          setPrices(
            resp.data.reduce((accum: Record<number, number>, token: {tokenId: number, price: number}) => {
                accum[token.tokenId] = token.price;
                return accum;
              },
              tokens.reduce((accum, tId) => {
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
  }, [tokens.length]);
  return {isSyncing, prices} as const;
}
