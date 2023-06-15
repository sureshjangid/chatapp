import React, { useEffect } from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userCheck = JSON.parse(localStorage.getItem("userInfo"));
    if (userCheck) {
      navigate("/chats");
    }
  }, [navigate]);
  return (
    <Container maxW={"xl"} centerContent>
      <Box
        d="flex"
        justifyContent={"center"}
        p={3}
        bg={"white"}
        w={"100%"}
        m="40px 0 15px 0"
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text fontSize={"4xl"} fontFamily={"Work Sans"} color={"black"}>
        ChatPro
        </Text>
      </Box>
      <Box
        bg={"white"}
        w={"100%"}
        p={4}
        borderRadius={"lg"}
        borderWidth={"1px"}
        color={"black"}
      >
        <Tabs variant="soft-rounded">
          <TabList mb="16px">
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
