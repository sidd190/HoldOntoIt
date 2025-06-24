import { XIcon } from "../icons/X";
import { YtIcon } from "../icons/YtIcon";
import { SidebarItem } from "./SidebarItems";

export function Sidebar(){
    return <div className="h-screen bg-white border-r w-[15%] left-0 top-0 pl-6 pt-6">
        <div className="text-2xl">
            HoldOntoIt!
        </div>
        <div className="pt-6">
            <SidebarItem text={"Twitter"} icon={<XIcon/>}/>
            <SidebarItem text={"Youtube"} icon={<YtIcon/>}/>
        </div>
    </div>
}