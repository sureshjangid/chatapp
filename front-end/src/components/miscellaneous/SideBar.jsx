import React, { useState } from "react";
import {
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
  DrawerBody,
  InputAddon,
  Input,
  Toast,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { Box } from "@chakra-ui/layout";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { ACCESS_USER, SEARCH_HANDLER } from "../../Apis/apiUrl";
import { getSender } from "../../config/chatLogics";
import NotificationBadge, { Effect } from 'react-notification-badge'
const SideBar = () => {
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notfication,
    setNotfication,
  } = ChatState();

  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in Search",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${SEARCH_HANDLER}=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the search Result",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`${ACCESS_USER}`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Fetching the Chat!",
        description: error.messages,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        style={{ display: "flex" }}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth={"5px"}
      >
        <Tooltip label="Search Users To Chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Work sans"}>
          ChatPro
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge 
              count={notfication.length}
              effect={Effect.SCALE}
              />
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notfication.length && "No new Message"}
              {notfication?.map((notif) => {
                return (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotfication(notfication.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModel>{" "}
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search User</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search By name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user, index) => {
                return (
                  <UserListItem
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                );
              })
            )}
            {loadingChat && <Spinner ml="auto" display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideBar;
