import { Box } from "@chakra-ui/layout";
import { ChatState } from "../context/ChatProvider";
import SideBar from "../components/miscellaneous/SideBar";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useState } from "react";
const Chats = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideBar />}
      <Box
        style={{ display: "flex" }}
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        
      </Box>
    </div>
  );
};
export default Chats;
