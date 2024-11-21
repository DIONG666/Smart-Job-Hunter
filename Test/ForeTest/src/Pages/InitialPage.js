import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const InitialPage=()=>{
    const navigate=useNavigate()
    useEffect(()=>{
        navigate('/signIn')
    })
    return <></>
}

export default InitialPage