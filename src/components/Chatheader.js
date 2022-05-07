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
  getDoc,
  orderBy,
} from "firebase/firestore"
import { db } from "../firebase"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
function Chatheader() {
  const { currentUser, room } = useAuth()
  const [question, setquestion] = useState()

  const [doctor, setdoctor] = useState()
  const fetchQuestions = async () => {
    const docRef = doc(db, "questions", room)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      setquestion(docSnap.data())
      // const fetchDoctor = async () => {
      //   const docRef = doc(db, "users", where("email", "==", currentUser.email))
      //   const docSnap = await getDoc(docRef)

      //   if (docSnap.exists()) {
      //     setdoctor(docSnap.data())
      //     console.log(doctor)
      //   } else {
      //     // doc.data() will be undefined in this case
      //     console.log("No such document!")
      //   }
      // }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!")
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  return (
    <div>
      {question && (
        <header className="text-gray-600 body-font border-b border-gray-300">
          <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <div className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
              {doctor}
              <span className="ml-3 text-xl">{question.doctor}</span>
            </div>
            <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
              {question.desc}
            </nav>
          </div>
        </header>
      )}
    </div>
  )
}

export default Chatheader
