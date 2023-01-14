import React,{useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Route,Routes} from 'react-router-dom'
import Signin from './components/Signin';
import Signup from './components/Signup';
import Link from './components/Link';
import DashboardContent from './components/DasboardMUI';
import SignupComponent from './components/SignupComponent';
function App() {
  const[uid,setUid]= useState("")
  return (
    <>
      <Routes>
        <Route path="/" element={<SignupComponent></SignupComponent>}></Route>
        <Route path= "/signin" element={<Signin setUid={setUid}></Signin>}></Route>
        <Route path="/link" element={<Link uid={uid}></Link>}></Route>
        <Route path="/dashboard" element={<DashboardContent uid={uid}></DashboardContent>}></Route>
      </Routes>
    </>
  );
}

export default App;
