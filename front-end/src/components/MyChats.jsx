import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { FETCH_CHAT } from "../Apis/apiUrl";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./miscellaneous/ChatLoading";
import { getSender, getUserProfile } from "../config/chatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";
const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${FETCH_CHAT}`, config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the chats",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p="3"
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb="3"
        px="3"
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily={"Work sans"}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            {" "}
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg={"#f8f8f8"}
        w="100%"
        h="100%"
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
       {chats ? (
  <Stack overflowY={"scroll"}>
   {chats.map((chat, index) => {
  console.log(index, 'index');
  console.log(chat.users, 'users');
  return (
    <Box
      cursor={"pointer"}
      bg={selectedChat === chat ? "#38b2ac" : "e8e8e8"}
      color={selectedChat === chat ? "white" : "black"}
      px={3}
      py={2}
      borderRadius={"lg"}
      key={chat?._id}
      onClick={() => setSelectedChat(chat)}
    >
      <Text>
        <Avatar
          size={"sm"}
          cursor={"pointer"}
          src={!chat?.isGroupChat
            ? getUserProfile(loggedUser, chat.users)
            : chat?.users[index].pic}
          mr={4}
        />
        {!chat?.isGroupChat
          ? getSender(loggedUser, chat.users)
          : chat?.chatName}
      </Text>
    </Box>
  );
})}

  </Stack>
) : (
  <ChatLoading />
)}

      </Box>
    </Box>
  );
};

export default MyChats;
