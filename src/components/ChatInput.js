import React from "react"
import { useState, useEffect } from "react"
import {
  addDoc,
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore"
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage"
import { db, storage } from "../firebase"
import { useAuth } from "../context/AuthContext"

function ChatInput() {
  const [input, setinput] = useState()
  const [File, setFile] = useState()
  const { currentUser, room, setRoom } = useAuth()

  const sendMessage = async (e) => {
    const msgRef = collection(db, "chats", room, "messages")
    await addDoc(msgRef, {
      timestamp: serverTimestamp(),
      message: input,
      user: currentUser.email,
      photoURL: currentUser.photoURL,
    })

    const chatRef = doc(db, "chats", room)
    await setDoc(
      chatRef,
      {
        latestMessage: input,
        timestamp: serverTimestamp(),
      },
      { merge: true }
    )
    setinput("")
  }
  const uploadPicture = async (file) => {
    const storageRef = ref(storage, `images/${room}/${file.name}`)
    const uploadTask = await uploadBytes(storageRef, file)
    const starsRef = ref(storage, `images/${room}/${file.name}`)
    const name = file.name

    // Get the download URL
    await getDownloadURL(starsRef)
      .then(async (url) => {
        setFile(url)
        console.log(File)
        const msgRef = collection(db, "chats", room, "messages")
        await addDoc(msgRef, {
          timestamp: serverTimestamp(),
          url: url,
          message: name,
          user: currentUser.email,
          photoURL: currentUser.photoURL,
          type: "image",
        })
        const chatRef = doc(db, "chats", room)
        await setDoc(
          chatRef,
          {
            latestMessage: name,
            timestamp: serverTimestamp(),
          },
          { merge: true }
        )
        setFile("")
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            break
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break
          case "storage/canceled":
            // User canceled the upload
            break

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect the server response
            break
          default:
            break
        }
      })
  }

  return (
    <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
      <label htmlFor="file">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={() => {}}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
          />
        </svg>

        <input
          type="file"
          id="file"
          onChange={(e) => {
            uploadPicture(e.target.files[0])
          }}
          className="hidden"
        ></input>
      </label>

      <input
        type="text"
        placeholder="Message"
        className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
        name="message"
        required
        value={input}
        onChange={(e) => {
          setinput(e.target.value)
        }}
      />

      <button onClick={() => sendMessage()}>
        <svg
          className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </div>
  )
}

export default ChatInput
