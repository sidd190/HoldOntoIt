import { ShareIcon } from "../icons/ShareIcon";

interface CardProps{
    title:String,
    link:String,
    type:"Twitter"|"Youtube";
};

export function Card({link,title,type}:CardProps){
    return (
      <div className=" h-full w-96 p-6 bg-white rounded-xl border">
        <div className="flex justify-between">
          <div className="flex items-center text-sm">
            <div className="text-gray-500 pr-4">
              <ShareIcon />
            </div>
            {title}
          </div>
          <div className="flex">
            <div className="pr-2 text-gray-500">
                <a href={link} target="_blank">
                    <ShareIcon/>
                </a>
            </div>
            <div className="text-gray-500">
              <ShareIcon />
            </div>
          </div>
        </div>
        <div className="pt-6">
            {type==="Youtube" && 
            <iframe className="w-full h-full"
            src={link.replace("watch","embed").replace("?v=" || "&v=","/")}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            ></iframe>}
            {type==="Twitter" && 
            <blockquote className="twitter-tweet">
                <a href={link.replace("x.com","twitter.com")}></a> 
            </blockquote>}
        </div>
      </div>
    );
}