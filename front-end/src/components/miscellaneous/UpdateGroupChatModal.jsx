import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  IconButton,
  useToast,
  useDisclosure,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import {
  ADD_NEW_USER_TO_GROUP,
  REMOVE_USER_FROM_GROUP,
  RENAME_GROUP_NAME,
  SEARCH_HANDLER,
} from "../../Apis/apiUrl";
import UserListItem from "../UserAvatar/UserListItem";
const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessage }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [GroupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleAddUser = async (add) => {
    if (selectedChat.users.find((u) => u._id === add._id)) {
      toast({
        title: "User already in group !!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someOne !",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
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

      const { data } = await axios.put(
        `${ADD_NEW_USER_TO_GROUP}`,
        {
          chatId: selectedChat._id,
          userId: add._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured  !!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleRemove = async (remove) => {
    if (selectedChat.groupAdmin._id !== user._id && remove._id !== user._id) {
      toast({
        title: "Only admins can remove someOne !",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
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
      const { data } = await axios.put(
        `${REMOVE_USER_FROM_GROUP}`,
        {
          chatId: selectedChat._id,
          userId: remove._id,
        },
        config
      );
      remove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessage();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured  !!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleRename = async () => {
    if (!GroupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${RENAME_GROUP_NAME}`,
        {
          chatId: selectedChat._id,
          chatName: GroupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured !!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
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
      const { data } = await axios.get(`${SEARCH_HANDLER}=${query}`, config);
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
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      >
        Open Modal
      </IconButton>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work Sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat?.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display={"flex"} flexWrap={"wrap"} pb={3}>
              {selectedChat.users.map((u) => {
                return (
                  <>
                    <UserBadgeItem
                      key={user?._id}
                      user={u}
                      handleFunction={() => handleRemove(u)}
                    />
                  </>
                );
              })}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Chat Name"
                mb="3"
                value={GroupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                colorScheme="teal"
                variant="outline"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl display={"flex"}>
              <Input
                placeholder="Add new user to group"
                mb="3"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult?.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
