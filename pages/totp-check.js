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


export default function Check() {
    const user = useUser({ redirectTo: '/login' })
    const [code, setCode] = useState("")
    const [totpSuccess, setTotpSuccess] = useState(false);



    return (
        <div className="flex flex-col h-screen">
            <NavBar id='totp' />
            <div className="flex-1 flex flex-col">
                <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                    <div className="login">
                        <form onSubmit={handleSubmit}>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">MFA Challenge</h1>
                            {!totpSuccess && <>
                            <p>Enter a one-time-code below to continue logging in:
                            </p>
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
                                <p>Success!
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
