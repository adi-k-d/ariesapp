import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Appbar from "../components/Appbar"
import AskQuestion from "../components/AskQuestion"
import { useAuth } from "../context/AuthContext"

function Home() {
  const [showModal, setShowModal] = useState(false)
  const { currentUser, room } = useAuth()
  const nav = useNavigate()

  return (
    <>
      <figure className="h-screen flex bg-gray-100">
        <div className="w-full max-w-2xl m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-1">
          <blockquote className="text-2xl font-medium text-center">
            <p className="text-lg font-semibold">
              Welcome to Aries Online,{currentUser.email}
            </p>
          </blockquote>
          <blockquote className="text-2xl font-medium text-center">
            {/* <p className="text-lg font-semibold">{usera}</p> */}
          </blockquote>
          <div className="bg-white dark:bg-gray-800 ">
            <div className="text-center w-full mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-20">
              <h2 className="text-3xl font-extrabold text-black dark:text-white sm:text-4xl">
                <span className="block">Do you have a Medical issue?</span>
                <span className="block text-indigo-500">
                  Want to quickly get a second opinion?
                </span>
              </h2>
              <div className="flex items-center justify-center mt-4">
                <button
                  className="uppercase py-2 px-4 bg-indigo-600 border-2 border-transparent text-white text-md mr-4 hover:bg-indigo-900"
                  onClick={() => setShowModal(true)}
                >
                  Ask A Question
                </button>
                <button
                  className="uppercase py-2 px-4 bg-transparent border-2 border-gray-800 text-gray-800 dark:text-white hover:bg-gray-800 hover:text-white text-md"
                  onClick={() => nav("/questions")}
                >
                  Your Previous Questions
                </button>
              </div>
            </div>
          </div>
        </div>
        <AskQuestion setShowModal={setShowModal} showModal={showModal} />
      </figure>
    </>
  )
}

export default Home
