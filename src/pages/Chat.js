import ChatContainer from "../components/ChatContainer"
import Chatheader from "../components/Chatheader"
import Appbar from "../components/Appbar"
import ChatInput from "../components/ChatInput"
import React, { useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

function Chat() {
  const { currentUser, room, setRoom } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (!room) {
      navigate("/questions")
    }
  }, [room])

  if (room) {
    return (
      <div className="container w-full max-w-6xl m-auto  ">
        <Appbar />
        <div className="max-w-6xl border rounded ">
          <div className="w-full ">
            <Chatheader />
            <ChatContainer />
            <ChatInput />
          </div>
        </div>
      </div>
    )
  } else {
    navigate("/questions")
  }
}

export default Chat
