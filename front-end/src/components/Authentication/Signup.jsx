import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputAddon,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { REGISTER_URL } from "../../Apis/apiUrl";
const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const handleClick = () => {
    show ? setShow(false) : setShow(true);
  };
  const navigate = useNavigate();
  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatapp");
      data.append("cloud_name", "dwa1dl6ta");
      fetch("https://api.cloudinary.com/v1_1/dwa1dl6ta/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };
  const SubmitHandler = async () => {
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill All The Feilds",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Do Not Match",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = {
        header: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${REGISTER_URL}`,
        { name, email, password, pic },
        config
      );
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder={"Enter your Name"}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="Email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder={"Enter your Email"}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="Password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder={"Enter your Password"}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h="1.5rem" size={"sm"} onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="Confirm-Password" isRequired>
        <FormLabel>Confirm Password</FormLabel>

        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder={"Enter your Confirm Password"}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h="1.5rem" size={"sm"} onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="Profile-Photo">
        <FormLabel>Profile Photo</FormLabel>
        <Input
          type="file"
          accept="image/*"
          placeholder={"Upload your Photo"}
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={SubmitHandler}
        isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
