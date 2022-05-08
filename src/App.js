import React, { useEffect } from "react"
import AppRouter from "./components/AppRouter"
import AuthContextProvider from "./context/AuthContext"
import { useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { token, onMessageListener } from "./firebase"

import "./App.css"

function App() {
  const notify = () => toast(token(setTokenFound))
  const [notification, setNotification] = useState({ title: "", body: "" })
  const [isTokenFound, setTokenFound] = useState(false)
  const [show, setShow] = useState(false)
  token(setTokenFound)

  onMessageListener()
    .then((payload) => {
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      })
      console.log(payload)
    })
    .catch((err) => console.log("failed: ", err))
  return (
    <AuthContextProvider>
      <AppRouter />
    </AuthContextProvider>
  )
}

export default App
