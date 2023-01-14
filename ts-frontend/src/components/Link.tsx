import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {
    usePlaidLink,
    PlaidLinkOptions,
    PlaidLinkOnSuccess,
  } from 'react-plaid-link';
interface IPROPS{
    uid: string
}
let PlaidLink: React.FC<IPROPS> = ({uid}) => {
    const [token,setToken]=useState("")
    const [accounts, setAccounts] = useState([])
    const [newAcc, setnewAcc] = useState(0)
    const [newTrans,setnewTrans] = useState(0)
    const [itemId,setItemId] = useState("")
    const [accessToken,setAccessToken] = useState("")
    useEffect(() => {
        const createLinkToken = async () => {
            const response = await fetch('/create_link_token', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id:uid})
            });
            const responseJSON = await response.json();
            console.log(responseJSON["link_token"])
            setToken(responseJSON["link_token"]);
        };
        createLinkToken();
    }, []);
    useEffect(() =>{
        fetch('/get_accounts', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id:uid})
         })
         .then((res) => res.json())
         .then((data) => {
            console.log(data)
            setAccounts(data)
         })
    }, [newAcc])
    /*useEffect(() =>{
        if(newTrans!==0)
        {
            fetch('/transaction_sync', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id:uid, item_id:itemId, access_token: accessToken})
             })
        }
        if(newTrans!==0)
        {
            fetch('/transaction_sync', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id:uid, item_id:itemId, access_token: accessToken})
             })
        }
    },[newTrans])*/
    
    const config: PlaidLinkOptions = {
        onSuccess: (public_token, metadata) => {
            console.log("hi")
            fetch('/exchange_public_token',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id:uid, public_token:public_token, metadata: metadata})
            })
            .then((res) => res.json())
            .then((data) =>{
                setnewAcc(newAcc => newAcc+1)
                setItemId(data['item_id'])
                setAccessToken(data['access_token'])
                setnewTrans(newTrans => newTrans+1)
            })
            
        },
        token,
        };
        const { open, exit, ready } = usePlaidLink(config);
  return (
    <>
        <div>
            <button onClick={() => open()}>Connect a bank account</button>
            <Link to="/dashboard">Dashboard</Link>
            <h1>Hi this is user: {uid}</h1>
            <h2>Accounts Connected</h2>
            <h3>{newAcc}</h3>
        </div>
        {accounts.map((acc) =>{
            return <li key={acc['account_id']}>{acc['institution_name']} {acc['account_name']} {acc['account_mask']}</li>
        })}
    </>
  )
}

export default PlaidLink
