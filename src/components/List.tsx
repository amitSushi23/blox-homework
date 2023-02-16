interface ListPageProps {
  items: Record<number, number | null>,
  onDelete: (id: number) => void,
  status: string,
}

const ListPage = ({ items, onDelete, status }: ListPageProps) => {
  return (
    <>
      <h1>TOKENS!</h1>
      <h3>STATUS: {status}</h3>
      <ul>{Object.keys(items).map(tokenId => (
        <li key={tokenId}>
          TOKEN ID: {tokenId} {items[Number(tokenId)] === null ? null : `(PRICE = ${items[Number(tokenId)]})`} 
          <button disabled={status === 'SYNCING'} onClick={() => onDelete(Number(tokenId))}>DELETE</button>
        </li>
      ))}</ul>
    </>
  );
};

export default ListPage;
