import NavBar from "../components/navigation/NavBar";
import { useUser } from '../lib/hooks';
import { useEffect, useState } from "react";

import axios, * as axios_misc from 'axios';
import Link from "next/link";

async function handleSubmit(e) {
    e.preventDefault()

}

async function totpCheck(code) {
    try{
        const resp = await axios.get(`/api/totp-check/${code}`);
        return resp.status === 200;
    }
    catch(e){
        return false
    }
}



export default function Signup() {
    const user = useUser({ redirectTo: '/login', noTotpRedirect: true })
    const [secret, setSecret] = useState(undefined)
    const [code, setCode] = useState("")
    const [totpSuccess, setTotpSuccess] = useState(false);

    const loadSecret = async() => {
        const resp = await axios.get("/api/totp-setup");
        setSecret(resp.data.secret);
    }

    useEffect( () => {
        if(user !==undefined){
            loadSecret();      
        }  
    }, [ user])

    if (!user) {
        return;
    }

    console.log(user);
    let qrData = `otpauth://totp/${user.username}?secret=${secret}`;
    let qrURL = "https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=" + qrData;


    return (
        <div className="flex flex-col h-screen">
            <NavBar id='totp' />
            <div className="flex-1 flex flex-col">
                <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                    <div className="login">
                        <form onSubmit={handleSubmit}>

                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">MFA Signup</h1>
                            {!totpSuccess && <>
                            <p>Enter a one-time-code below to register the QR code with chatsploit.
                                Download a totp provider on your phone (eg: Google Authenticator) and register
                                chatsploit by scanning this QR code:
                            </p>
                            <img className="m-auto" height="150px" width="150px" src={qrURL} alt={user.TOTP_SECRET} />
                            <label>
                                <span>Code: </span>
                                <input type="text" name="code" placeholder="123456" 
                                    value={code} onChange={(e) => setCode(e.currentTarget.value)}
                                    required />
                            </label>
                            <div className="submit">
                                <>
                                    <button type="submit" onClick={() => setTotpSuccess(totpCheck(code))}>Register</button>
                                </>
                            </div>
                            </>}
                            {totpSuccess && <>
                                <p>Registration Complete!
                                </p>
                                <br/>
                                <div className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                    <Link href="/chat">Go Chat!</Link>
                                </div>
                                <br />
                                <div className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                    <Link className="font-medium text-blue-600 dark:text-blue-500 hover:underline" href="/search">Find Friends!</Link>
                                </div>
                            </>}
                        </form>
                    </div>
                    <style jsx>{`
                            .login {
                            max-width: 40rem;
                            margin: 0 auto;
                            padding: 1rem;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            }
                            form,
                            label {
                                display: flex;
                                flex-flow: column;
                            }
                            label > span {
                                font-weight: 600;
                            }
                            input {
                                padding: 8px;
                                margin: 0.3rem 0 1rem;
                                border: 1px solid #ccc;
                                border-radius: 4px;
                            }
                            .submit {
                                display: flex;
                                justify-content: flex-end;
                                align-items: center;
                                justify-content: space-between;
                            }
                            .submit > a {
                                text-decoration: none;
                            }
                            .submit > button {
                                padding: 0.5rem 1rem;
                                cursor: pointer;
                                background: #fff;
                                border: 1px solid #ccc;
                                border-radius: 4px;
                            }
                            .submit > button:hover {
                                border-color: #888;
                            }
                            .error {
                                color: brown;
                                margin: 1rem 0 0;
                            }
                        `}</style>
                </div>
            </div>
        </div>
    )
}
