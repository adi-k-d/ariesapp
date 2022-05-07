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

import { useAuth } from "../context/AuthContext"

import Select from "./Select"
import { useNavigate } from "react-router-dom"

function AskQuestion({ setShowModal, showModal }) {
  const [inputs, setInputs] = useState({})
  const [myDoctor, setMyDoctor] = useState()
  const [users, setUsers] = useState()
  const { currentUser, room, setRoom } = useAuth()

  const navigate = useNavigate()

  useEffect(() => {
    const q = query(collection(db, "users"), where("type", "==", "doctor"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.docs.length) {
        const userDoc = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        setUsers(
          snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        )
      }
    })
    return () => unsubscribe()
  }, [])

  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setInputs((values) => ({ ...values, [name]: value }))
  }

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = src

      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const createChat = async (id, desc) => {
    await setDoc(doc(db, "chats", id), {
      desc: desc,
      users: [currentUser.email, inputs.doctor],
    })
  }

  const payRazorpay = async (amount) => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

    if (!res) {
      alert("no")
      return
    }

    const options = {
      key: "rzp_test_wkvegiM9Q60sJT", // Enter the Key ID generated from the Dashboard
      amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Aries Online",
      description: "Paying ",
      image: "https://example.com/your_logo",

      handler: async function (response) {
        alert(response.razorpay_payment_id)

        await setDoc(doc(db, "questions", response.razorpay_payment_id), {
          desc: inputs.desc,
          email: currentUser.email,
          doctor: inputs.doctor,
        })
        createChat(response.razorpay_payment_id, inputs.desc)
        setRoom(response.razorpay_payment_id)
        navigate("/chat")
      },
      prefill: {
        name: "Aries Online Clinic",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    }
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  }
  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Modal Title</h3>
                  <button onClick={() => setShowModal(false)}>
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="grid max-w-xl grid-cols-2 gap-4 m-auto">
                    <div className="col-span-2 lg:col-span-1">
                      <div className=" relative ">
                        <input
                          type="text"
                          name="name"
                          value={inputs.name || ""}
                          onChange={handleChange}
                          className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          placeholder="Name"
                        />
                      </div>
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <div className=" relative ">
                        <input
                          type="text"
                          name="email"
                          value={inputs.email || ""}
                          onChange={handleChange}
                          className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          placeholder="email"
                        />
                        <div></div>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="text-gray-700">
                        <textarea
                          className="flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          id="desc"
                          placeholder="Briefly describe your problem"
                          name="desc"
                          rows="5"
                          cols="40"
                          onChange={handleChange}
                        ></textarea>
                      </label>
                      <select
                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-state"
                        value={myDoctor}
                        onChange={handleChange}
                        name="doctor"
                      >
                        <option value="">Select a Doctor</option>

                        {users &&
                          users.map((user) => (
                            <option value={user.email} key={user.id}>
                              {user.email}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-span-2 text-right"></div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>

                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      payRazorpay(499)
                    }}
                  >
                    Ask Question
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  )
}

export default AskQuestion
