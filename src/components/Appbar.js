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
  serverTimestamp,
  orderBy,
} from "firebase/firestore"
import { db } from "../firebase"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import AskQuestion from "./AskQuestion"
function Appbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const signout = () => {
    logout()
      .then(async (res) => {
        try {
          const userRef = doc(db, "users", currentUser.uid)
          await setDoc(userRef, { isOnline: false })
          navigate("/")
        } catch (e) {
          console.error("Error adding document: ", e)
        }
        navigate("/")
      })
      .catch((error) => {
        alert(error.message)
      })
  }
  return (
    <>
      <div className=" container px-6 mx-auto flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-gray-300">
        <div>
          <h4 className="text-2xl font-bold leading-tight text-gray-800 dark:text-gray-100">
            {currentUser.email}
          </h4>
        </div>
        <div className="mt-6 md:mt-0">
          <button
            className="mr-3 bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out rounded hover:bg-gray-300 text-indigo-700 dark:hover:bg-gray-600 dark:text-indigo-600 px-5 py-2 text-sm"
            onClick={() => {
              navigate("/questions")
            }}
          >
            Back
          </button>
          <button
            className="transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
            onClick={() => {
              signout()
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  )
}

export default Appbar
