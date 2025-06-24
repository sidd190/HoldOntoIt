import { useRef, useState, forwardRef } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { PlusIcon } from "../icons/PlusIcon";
import { Button } from "./Button";
import axios from "axios";

enum ContentTypes{
  Youtube="Youtube",
  Twitter="Twitter"
}


export function ConstCreateModal({open,onClose}){

  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState(ContentTypes.Youtube)

  async function addContent(){
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;
    const x = await axios.post(`http://localhost:5000/api/v1/content`,{
      link,
      title,
      type
    },{
      withCredentials:true
    })
    if(x.status===200){
      alert("Content added successfully");
      onClose();
    }
  }

  return (
    <>
      {open && (
        <>
          <div className="w-screen h-screen bg-slate-700 fixed top-0 left-0 opacity-85 flex justify-center items-center" onClick={onClose}>
          </div>
          <div className="bg-white rounded-md min-h-72 w-96 flex flex-col gap-4 items-center justify-center p-6 absolute top-1/4 left-[40%]">
              <div className="flex justify-between w-full text-3xl">
                  <h1 className="pl-16 ">Add Content</h1>
                  <div className="cursor-pointer font-extrabold" onClick={onClose}>
                      <CrossIcon/>
                  </div>
              </div>
                <Input ref={titleRef} placeholder={"Title"}/>
                <Input ref={linkRef} placeholder={"Link"} />
                <div className="flex gap-5 items-center">
                  <h1 className="font-bold">Type : </h1>
                  <Button text={"Youtube"} variant={type===ContentTypes.Youtube?"Primary":"Secondary"} onClick={()=>{setType(ContentTypes.Youtube)}}/>
                  <Button text={"Twitter"} variant={type===ContentTypes.Twitter?"Primary":"Secondary"} onClick={()=>{setType(ContentTypes.Twitter)}}/>
                </div>
                <Button onClick={()=>addContent()} text="Add" variant="Primary" startIcon={<PlusIcon/>}/>
          </div>
        </>
      )}
    </>
  );
}

const Input = forwardRef<HTMLInputElement, { placeholder: string }>(
  ({ placeholder }, ref) => (
    <div>
      <input type="text" placeholder={placeholder} className="px-4 py-2 m-2 border border-slate-500" ref={ref} />
    </div>
  )
);