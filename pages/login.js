import { useState } from 'react'
import Router from 'next/router'
import { useUser } from '../lib/hooks'
import Form from '../components/form'
import NavBar from "../components/navigation/NavBar"

const Login = () => {
  useUser({ redirectTo: '/', redirectIfFound: true })

  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    if (errorMsg) setErrorMsg('')

    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.status === 200) {
        Router.push('/')
      } else {
        throw new Error(await res.text())
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
      setErrorMsg(error.message)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <NavBar id="login" />

      <div>
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <div className="login">
            <Form isLogin errorMessage={errorMsg} onSubmit={handleSubmit} />
          </div>
          <style jsx>{`
            .login {
              max-width: 21rem;
              margin: 0 auto;
              padding: 1rem;
              border: 1px solid #ccc;
              border-radius: 4px;
            }
          `}</style>
        </div>
      </div>
    </div>
  )
}

export default Login
