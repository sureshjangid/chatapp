import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { FETCH_MESSAGE, SEND_MESSAGE } from "../Apis/apiUrl";
import { getSender, getSenderFull } from "../config/chatLogics";
import { ChatState } from "../context/ChatProvider";
import ScrollableChat from "./ScrollableChat";
import ProfileModel from "./miscellaneous/ProfileModel";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import "./style.css";
import animationData from "../animation/TypingAnimation.json";
import Lottie from "react-lottie";
const END_POINT = "http://localhost:3002"; // Replace with your server endpoint

var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notfication, setNotfication } =
    ChatState();
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [SocketConntected, setSocketConntected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessage = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `${FETCH_MESSAGE}/${selectedChat._id}`,
        config
      );
      setMessage(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the message",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  useEffect(() => {
    socket = io(END_POINT);
    socket.emit("setup", user);
    socket.on("conntected", () => setSocketConntected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessage();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecived.chat._id
      ) {
        if (!notfication.includes(newMessageRecived)) {
          setNotfication([newMessageRecived, ...notfication]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessage([...message, newMessageRecived]);
      }
    });
  });
  const toast = useToast();
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");

        const { data } = await axios.post(
          `${SEND_MESSAGE}`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessage([...message, data]);
      } catch (error) {
        toast({
          title: "Error Occured",
          description: "Failed to send the message",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top-left",
        });
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!SocketConntected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
            pb={3}
            px={2}
            w="100%"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                {
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessage={fetchMessage}
                  />
                }
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w="100%"
            h="100%"
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w="20"
                h={"20"}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="message">
                <ScrollableChat message={message} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  {" "}
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />{" "}
                </div>
              ) : (
                " "
              )}
              <Input
                bg="#e0e0e0"
                placeholder="Enter a message..."
                variant={"filled"}
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
