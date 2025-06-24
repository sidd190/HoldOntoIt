import { ReactElement } from "react";

interface ButtonProps {
  variant: "Primary" | "Secondary";
  text: String;
  startIcon: ReactElement;
  onClick?: ()=>void;
}

const variantClasses = {
    "Primary" :"bg-blue-500 text-white",
    "Secondary" :"bg-blue-200 text-blue-700"
}
const defaultStyles= " px-4 py-2 rounded-md font-light flex justify-center items-center"

export function Button ({variant,text,startIcon,onClick}:ButtonProps){

    return <button onClick={onClick} className={variantClasses[variant]+ defaultStyles}>
        <div className="pr-2 flex gap-2">
            {startIcon}
            {text}
        </div>
    </button>
}