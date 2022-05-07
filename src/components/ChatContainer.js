import React from "react"
import { useState, useEffect, useRef } from "react"
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  orderBy,
} from "firebase/firestore"
import { db } from "../firebase"
import { useAuth } from "../context/AuthContext"
import { saveAs } from "file-saver"

function ChatContainer() {
  const { currentUser, room, setRoom } = useAuth()
  const chatBox = useRef(null)
  const [messages, setmessages] = useState([])
  const saveFile = (url, name) => {
    console.log(url, name)
    saveAs(url, "aries.pdf")
  }
  useEffect(() => {
    const msgRef = collection(db, "chats", room, "messages")
    const q = query(msgRef, orderBy("timestamp", "asc"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setmessages(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          timestamp: doc.data().timestamp?.toDate().getTime(),
        }))
      )
    })
    return unsubscribe
  }, [room])
  useEffect(() => {
    chatBox.current.addEventListener("DOMNodeInserted", (event) => {
      const { currentTarget: target } = event
      target.scroll({ top: target.scrollHeight, behavior: "smooth" })
    })
  }, [messages])

  return (
    <div className="relative w-full p-6 " ref={chatBox}>
      {messages &&
        messages.map((message) => (
          <div key={message.id}>
            <ul className="space-y-2">
              {message.user === currentUser.email ? (
                <li className="flex items-end">
                  <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                    {!message.type ? (
                      <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-blue-300 mt-2">
                        {message.message}
                      </span>
                    ) : (
                      <div className="max-w-sm mt-2 rounded overflow-hidden shadow-lg ">
                        <img
                          className="w-full"
                          src={message.url}
                          alt={message.message}
                        />
                        <div className="px-6 py-4 mt-2 bg-blue-300 cursor-pointer ">
                          <div
                            className=" text-xl mb-2"
                            onClick={() => {
                              saveFile(message.url, message.name)
                            }}
                          >
                            Click here to open {message.message}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ) : (
                <li className="flex items-end justify-end">
                  <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                    {!message.type ? (
                      <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600 mt-2">
                        {message.message}
                      </span>
                    ) : (
                      <div className="max-w-sm rounded overflow-hidden shadow-lg mt-2">
                        <img
                          className="w-full"
                          src={message.url}
                          alt={message.message}
                        />
                        <div className="px-6 py-4 px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600 mt-2 ">
                          <div
                            className=" text-xl mb-2 mt-2  cursor-pointer"
                            onClick={() => {
                              saveFile(message.url, message.name)
                            }}
                          >
                            Click here to open {message.message}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              )}
            </ul>
          </div>
        ))}
    </div>
  )
}

export default ChatContainer
