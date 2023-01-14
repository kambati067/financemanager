import React from 'react'
import {useState} from 'react'
import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Signup = () => {
    const navigate = useNavigate()
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
        fetch("/login",{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"email":user.email, "password":user.password})
        })
        navigate("/signin")

    }
  return (
    <form>
        <h1>Create MiniMint Account!</h1>
        <h2>Email</h2>
        <input type="text" name="email" placeholder='Enter Email' value={user.email} onChange={handleChange}></input>
        <h2>Password</h2>
        <input type="text" name="password" placeholder='Enter Password' value={user.password} onChange={handleChange}></input>
        <button type="submit" onClick={submitForm}>Create Account</button>
    </form>
  )
}

export default Signup

