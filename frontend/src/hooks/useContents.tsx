import axios from 'axios';
import {useEffect, useState} from 'react'

export function useContents() {

    const [contents, setContents] = useState([]);

    function refresh(){
        axios.get("http://localhost:5000/api/v1/content",
            {
                withCredentials:true,
            }
        ).then((response) => {
            setContents(response.data.content)
        })
    }

    useEffect(() => {
        refresh();
        let interval = setInterval(()=>{
            refresh();
        },10*1000)

        return () => {
            clearInterval(interval);
        }
    },[])
    return contents;
}
