import React from 'react'
import {useState} from 'react'
import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
interface IPROPS{
    setUid:  React.Dispatch<React.SetStateAction<string>>
}
let Signin:React.FC<IPROPS> = ({setUid}) => {
    const navigate = useNavigate()
    const[auth,setAuth] = useState(false)
    const[user,setUser]= useState({
        email: "",
        password: ""
    })
    const[formCompletion,setFormCompletion]=useState(false)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }
    const submitForm = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
        e.preventDefault()
        fetch("/signin",{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"email":user.email, "password":user.password}),
            redirect: "manual"
        })
        .then((res) => res.json().then(data =>{
            if(res.status===200)
            {
                setUid(data.uid)
                navigate("/link")
            }
            
        }))
    }
  return (
    <form>
        <h1>MiniMint Sign-In</h1>
        <h2>Email</h2>
        <input type="text" name="email" placeholder='Enter Email' value={user.email} onChange={handleChange}></input>
        <h2>Password</h2>
        <input type="text" name="password" placeholder='Enter Password' value={user.password} onChange={handleChange}></input>
        <button type="submit" onClick={submitForm}>Sign In</button>
    </form>
  )
}

export default Signin
