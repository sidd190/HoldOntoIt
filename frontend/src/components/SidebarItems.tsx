import type { ReactElement } from "react";


export function SidebarItem({text,icon}:{
    text:String,
    icon:ReactElement;
}){
    return <div className="flex justify-start items-center py-3 pl-2 cursor-pointer hover:bg-gray-200 rounded max-w-48">
        <div>
            {icon}
        </div>
        <div className="pl-2">
            {text}
        </div>
    </div>
}