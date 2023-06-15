import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL } from "../../Apis/apiUrl";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    show ? setShow(false) : setShow(true);
  };
  const navigate = useNavigate();
  const toast = useToast();

  const SubmitHandler = async () => {
    setLoading(true);

    if (!email || !password) {
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
    try {
      const config = {
        header: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${LOGIN_URL}`,
        { email, password },
        config
      );
      toast({
        title: "Login Successful",
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
      setLoading(false);
    }
  };
  return (
    <VStack spacing={"5px"}>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="Password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder={"Enter your Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h="1.5rem" size={"sm"} onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={SubmitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant={"solid"}
        colorScheme="red"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={() => {
          setEmail("guest@exaple.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
