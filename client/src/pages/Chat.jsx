import React, { useEffect, useState } from 'react';
import axios from "axios";
import { ChatState } from "./../context/chatProvider";
import { Box } from "@chakra-ui/react";
import Header from '../components/Header';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';

const Chat = () => {

    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
        <div style={{ width: "100%" }}>
            {user && <Header />}
            <Box
                style={{ display: "flex", justifyContent: "space-between", padding: "10px", height: "91.5vh", width: "100%" }}
            >
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    )
}

export default Chat
