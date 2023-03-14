import { Nft } from 'alchemy-sdk';

export const Card = ({ nft }: {nft: Nft}) => {

    return (
        <div className="w-1/2 flex flex-col ">
        <div className="rounded-md">
            <img className="object-cover h-128 w-full rounded-t-md" src={nft.media[0].gateway} ></img>
        </div>
        <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
            <div className="">
                <h2 className="text-base text-gray-600">Title: {nft.title}</h2>
                <p className="text-xs text-gray-600">Token Id: {nft.tokenId}</p>
            </div>
        </div>

    </div>
    )
}
