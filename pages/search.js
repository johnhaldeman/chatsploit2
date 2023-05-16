import NavBar from "../components/navigation/NavBar";
import { useUser } from '../lib/hooks';
import { useState } from "react";

import axios, * as axios_misc from 'axios';


const UserRow = (props) => {
  return (
  <tr className="bg-white dark:bg-gray-800">
    <td className="py-3 px-6">{props.user.username}</td>
    <td className="py-3 px-6">{props.user.name}</td>
    <td className="py-3 px-6">{props.user.joined}</td>
    <td className="py-4 px-6 text-right">
        <a href={`/chat/${props.user.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Send message</a>
    </td>
  </tr>
  )
}

export default function Search() {
  useUser({ redirectTo: '/login' })

  const [searchString, setSearchString ] = useState(undefined);
  const [searchResults, setSearchResults ] = useState([]);
  const [errorMessage, setErrorMessage ] = useState("");

  const onSearchClick = (e) => {
    e.preventDefault() // prevent form POST
    setErrorMessage("")
    axios.get(`/api/app/user/${encodeURIComponent(searchString)}`)
      .then((response => setSearchResults(response.data.users)))
      .catch(() => {
        setErrorMessage("Unable to search for users! Contact us at support@chatsploit.com to report.");
      });
  }

  return (
    <div className="flex flex-col h-screen">
      <NavBar id="search" />
      <div>
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">Find friends</h1>
        </div>
          <form className="flex flex-1 px-20  mb-4"
            onSubmit={onSearchClick}>
            <label htmlFor="email" class="mb-auto mt-auto whitespace-nowrap	block mb-2 mr-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Search usernames:
            </label>
            <input type="username" id="username" placeholder="user" required
              onChange={(str) => {
                console.log("str", str);
                setSearchString(str.target.value)
              }}
              value={searchString}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            <button
              type="submit"
              className="col-span-2 bg-transparent hover:bg-blue-500 hover:border-transparent hover:text-white text-blue-700 font-semibold py-2 px-4 border border-blue-500  rounded"
            >
              Search
            </button>
          </form>
        <div className="flex flex-1 px-20  mb-4">
          <p className="text-red-600">{errorMessage}</p>
        </div>
      </div>
      <div>
        <div className="flex flex-1 px-20  mb-4">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="py-3 px-6">Username</th>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Joined</th>
                <th className="py-3 px-6"></th>
              </tr>
            </thead>
            <tbody>
              {
                searchResults.map( user => 
                  <UserRow
                    user={user}
                  />
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
