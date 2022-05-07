import React from "react"
import AppRouter from "./components/AppRouter"
import AuthContextProvider from "./context/AuthContext"
import { useAuth } from "./context/AuthContext"
import { useNavigate } from "react-router-dom"
import "./App.css"

function App() {
  const { currentUser, room } = useAuth()

  return (
    <AuthContextProvider>
      <AppRouter />
    </AuthContextProvider>
  )
}

export default App
