import NavBar from "./navigation/NavBar"
import { useUser } from '../lib/hooks'
import React, { useEffect, useState } from "react";
import axios, * as axios_misc from 'axios';
import Link from 'next/link'


function MessageFromUser (props) {
  return(
    <React.Fragment>
      <div></div>
      <div className="bg-green-500 text-white p-4 col-span-7 rounded-lg"
        dangerouslySetInnerHTML={{__html: `<p>${props.message}</p>`}}
      />
    </React.Fragment>
  )
}

function MessageToUser (props) {
  return(
    <React.Fragment>
      <div className="bg-purple-500 text-white p-4 col-span-7 rounded-lg">
        <p>{props.message}</p>
      </div>
      <div></div>
    </React.Fragment>
  )
}

export function Chat(props) {  
  const user = useUser({ redirectTo: '/login' })
  const [convos, setConvos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const populateFriendList = () => {
    let id = user?.id;
    console.log("pop: " + id)
    if(id){
      let url = `/api/app/conversation_list/${encodeURIComponent(user?.id)}`
      if(props.id !== undefined){
        url = url + `/${encodeURIComponent(props.id)}`
      }
      axios.get(url)
      .then( res => {
        setConvos(res.data.conversations);
      })
    }
  }

  const populateMessages = () => {
    let selectedFriend = props.id;
    if(selectedFriend){
      let id = user?.id;
      if(id){
        let url = `/api/app/conversation/${encodeURIComponent(user?.id)}/${encodeURIComponent(props.id)}`
        console.log("url?" + url)
        axios.get(url)
        .then( res => {
          setMessages(res.data.messages);
          setTimeout(populateMessages, 500)
        })
      }
    }
  }

  const sendMessage = () => {
    axios.post("/api/app/message", {
      message: currentMessage,
      from_id: user.id,
      to_id: props.id
    }).then( () => {
      setCurrentMessage("");
    })
  }

  useEffect( () => {
    populateFriendList();
    populateMessages();
  }, [ user?.id, props.id ])

  return (
    <div className="flex flex-col h-screen">
      <NavBar id="chat" />
      <div className="flex-1 flex flex-col">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Chat</h1>
        </div>
        <div className="flex-1 flex px-20  mb-4">
          <div className="flex-1">
            <div className="min-h-full grid grid-cols-3 gap-4 mb-4">
              <div className="min-h-full rounded-lg border-2 border-blue-500">
                {
                  convos.map(user => {
                      let classes = "p-4 border-b-2 border-blue-500 hover:bg-blue-500 hover:border-transparent hover:text-white cursor-pointer";
                      if(user.id === props.id){
                        classes += " bg-blue-500 text-slate-200"; 
                      }
                      return <Link key={user.username} href={"/chat/" + user.id}>
                        <div className={classes}>
                          <p>{user.username} - {user.name}</p>
                        </div> 
                      </Link>
                    }
                  )
                }
              </div>
              <div className="p-2 min-h-full col-span-2 h-96 rounded-lg border-2 border-gray-200">
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-8 gap-2 overflow-y-scroll">
                    {
                      messages.map( d => {
                        if(user){
                          if(d.from_id === user.id){
                            return (
                              <MessageFromUser  key={d.sent} {...d} />
                            )
                          }
                          else{
                            return (
                              <MessageToUser key={d.sent} {...d} />
                            )
                          }
                        }
                      })
                    }
                  </div>
                  <div className="grid h-24 grid-cols-8 gap-2 mt-auto">
                    <textarea id="message" rows="4" className="p-4 col-span-6 rounded-lg block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                      placeholder="Type your message to send it to your friend...."
                      value={currentMessage}
                      onChange={ (e) => {
                        setCurrentMessage(e.target.value);
                      }}
                      >  
                    </textarea>
                    <button onClick={sendMessage} className="col-span-2 bg-transparent hover:bg-blue-500 hover:border-transparent hover:text-white text-blue-700 font-semibold py-2 px-4 border border-blue-500  rounded">
                      Send!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
