import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
import { Button, IconButton, Image, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
const ProfileModel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return ( 
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size={"lg"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize={"40px"}
            fontFamily={"Work sans"}
            display="flex"
            justifyContent={"center"}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            style={{ display: "flex" }}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Image
              src={user.pic}
              borderRadius={"full"}
              boxSize={"150px"}
              alt={user.name}
            />
            <Text fontSize={"2xl"}>Email : {user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModel;
