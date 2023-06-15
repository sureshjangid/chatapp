import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { CREATE_GROUP, SEARCH_HANDLER } from "../../Apis/apiUrl";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [seletedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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
        description: "Failed to Load the Search ,Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName || !seletedUsers) {
      toast({
        title: " Please fill the all feilds!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if(seletedUsers < 2){
        toast({
            title: "Need 2+ uses",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${CREATE_GROUP}`,
        {
          name: groupChatName,
          users: JSON.stringify(seletedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        title: "Group Created !!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: " Failed to Create the New Group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const { user, chats, setChats } = ChatState();
  const handleGroup = (userAdd) => {
    if (seletedUsers.includes(userAdd)) {
      toast({
        title: "This user already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    } else {
      setSelectedUsers([...seletedUsers, userAdd]);
    }
  };
  const handleDelete = (deleteUser) => {
    setSelectedUsers(seletedUsers.filter((sel) => sel._id !== deleteUser._id));
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily={"Work sans"}
            fontSize={"35px"}
            display={"flex"}
            justifyContent={"center"}
          >
            Creating Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Input
                placeholder="Add Users eg: Rahul , Suresh , Ramesh"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {seletedUsers?.map((u) => {
                return (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                );
              })}
            </Box>
            {loading ? (
              <div>Please Wait</div>
            ) : (
              searchResult?.slice(0, 4)?.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
