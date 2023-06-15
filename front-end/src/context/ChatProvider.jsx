import React, {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [selectedChat, setSelectedChat] = useState("");
  const [chats, setChats] = useState([]);
  const [notfication, setNotfication] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userCheck = JSON.parse(localStorage.getItem("userInfo"));
    if (!userCheck) {
      navigate("/");
    } else {
      setUser(userCheck);
    }
  }, [navigate]);
  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        notfication,
        setNotfication,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};
export default ChatProvider;
