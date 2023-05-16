/* This example requires Tailwind CSS v2.0+ */
import NavBar from "../components/navigation/NavBar"
import { useUser } from '../lib/hooks'

export default function Home() {
  const user = useUser()

  return (
    <div className="flex flex-col h-screen">
      <NavBar user={user} />
      <div className="flex-1 flex flex-col">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <img width="300" src="http://localhost/chatsploit2/static/waspy.png" />
          <img width="300" src="http://localhost/chatsploit2/static/waspy2.png" />
        </div>
      </div>
    </div>
  )
}
