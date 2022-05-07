import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import React, { useState, useEffect, useContext } from "react"

import Home from "../pages/Home"
import Chat from "../pages/Chat"
import Questions from "../pages/Questions"
import Signup from "../pages/Signup"
import Signin from "../pages/Signin"
import { useAuth } from "../context/AuthContext"

function AppRouter() {
  const { currentUser } = useAuth()

  return (
    <Router>
      {currentUser ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/questions" element={<Questions />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Signin />} />
        </Routes>
      )}
    </Router>
  )
}

export default AppRouter
