import React from "react"
import { useState, useEffect } from "react"
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
} from "firebase/firestore"
import { db } from "../firebase"
import AskQuestion from "../components/AskQuestion"
import { useAuth } from "../context/AuthContext"

import { useNavigate } from "react-router-dom"
import Appbar from "../components/Appbar"
import Loader from "../components/Loader"

function Questions() {
  const { currentUser, room, setRoom } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [questions, setQuestions] = useState()
  const [loading, setloading] = useState(false)

  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("users", "array-contains", currentUser.email)
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.docs.length) {
        const userDoc = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        setQuestions(
          snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        )
      }
    })

    return () => unsubscribe()
  }, [])
  const navigate = useNavigate()
  const nav = (id) => {
    setRoom(id)
    navigate("/chat")
  }

  return (
    <div className="container w-full max-w-4xl m-auto h-full ">
      <Appbar />
      <div className="px-4 py-5 border-b rounded-t sm:px-6">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {questions ? (
              questions.map((question) => (
                <div key={question.id}>
                  <li>
                    <div
                      className="block hover:bg-gray-50 dark:hover:bg-gray-900"
                      onClick={() => nav(question.id)}
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-md text-gray-700 dark:text-white md:truncate">
                            {question.users[0]}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {question.users[1]}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-md font-light text-gray-500 dark:text-gray-300">
                              {question.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </div>
              ))
            ) : (
              <blockquote className="text-2xl font-medium text-center">
                <p className="text-lg font-semibold">
                  You havent asked any questions yet,{currentUser.email}
                </p>
              </blockquote>
            )}
          </ul>
        </div>
      </div>
      <button
        type="button"
        className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg mt-6"
        onClick={() => setShowModal(true)}
      >
        Ask Question
      </button>
      <AskQuestion setShowModal={setShowModal} showModal={showModal} />
    </div>
  )
}

export default Questions
