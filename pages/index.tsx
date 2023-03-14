import type { NextPage } from 'next'
import { Alchemy, Network, Nft } from 'alchemy-sdk';
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from "../components/Card"
import InfiniteList from "../components/InfiniteList"

const baycAddress = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d';
const apiKey = '84JDYpV82oFlRKht3Vpy9QiKrtd4w-wU';

// Optional config object, but defaults to the API key 'demo' and Network 'eth-mainnet'.
const settings = {
  apiKey, // Replace with your Alchemy API key.
  network: Network.ETH_MAINNET // Replace with your network.
};

const alchemy = new Alchemy(settings);

const Home: NextPage = () => {
  const [NFTs, setNFTs] = useState<Nft[]>([]);
  const [pageKey, setPageKey] = useState<undefined | string>('');
  const [filterKey, setFilterKey] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  async function fetchBAYC() {
    setIsFetching(true)
    const res = await alchemy.nft
      .getNftsForContract(baycAddress, {pageSize: 100, pageKey})
    if (res) {
      console.log(res);
      setNFTs([...NFTs, ...res.nfts]);
      setPageKey(res.pageKey);
    }
    setIsFetching(false)
  }

  useEffect(() => {
    fetchBAYC();
  }, []);

  const handleFilter = (e: React.FormEvent<HTMLInputElement>) => {
    setFilterKey(e?.currentTarget?.value)
  }

  const filteredNfts = useMemo(() => {
    // if no filter key
    if (!filterKey.trim()) {
      return NFTs;
    }
    // filter token ids by the key
    return NFTs.filter(item => item.tokenId.includes(filterKey))
  }, [filterKey, NFTs])

  const hasNextPage = !!pageKey;

  const fetchItems = () => {
    setIsFetching(true)
    fetchBAYC();

    setIsFetching(false)
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center py-8 gap-y-3">
        <div className="flex flex-col w-full justify-center items-center gap-y-2">
          <label className="text-gray-600 ">BAYC NFTs</label>
          <input className="bg-lime-100 border-4 border-indigo-500/50" type={"text"} placeholder="Filter by Token ID" onChange={handleFilter} />
        </div>
      </div>

      <InfiniteList
        items={filteredNfts}
        hasMore={hasNextPage}
        isFetching={isFetching}
        fetchItems={fetchItems}
      >
        {(nft) => <Card nft={nft} />}
      </InfiniteList>
    </>
  )
}

export default Home
