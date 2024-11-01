import { useEffect, useState } from 'react';
import { ChatState } from './../context/chatProvider';
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/chatLogics';
import GroupChatModel from './GroupChatModel';

const MyChats = ({ fetchAgain }) => {

    const [loggedUser, setLoggedUser] = useState();
    const { user, setUser, selectedchat, setSelectedChat, chats, setChats } = ChatState();
    const toast = useToast();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const res = await axios.get("http://localhost:5000/chat", config);
            setChats(res.data);
        } catch (err) {
            toast({
                title: "Error Occurred!",
                description: "Failed to load the chats!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain]);

    return (
        <Box
            display={{ base: selectedchat ? "none" : "flex", md: "flex" }}
            flexDirection="column"
            alignItems="center"
            p={3}
            bg="white"
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "17px", lg: "22px" }}
                fontFamily="Work sans"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                <GroupChatModel>
                    <Button
                        display="flex"
                        fontSize={{ base: "17px", md: "13px", lg: "16px" }}
                        rightIcon={<AddIcon />}
                        fontWeight="400"
                    >
                        New Group Chat
                    </Button>
                </GroupChatModel>
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {
                    chats ? (
                        <Stack overflowY="scroll">
                            {chats.map((c) =>
                            (
                                <Box
                                    onClick={() => setSelectedChat(c)}
                                    cursor="pointer"
                                    bg={selectedchat === c ? "#38B2AC" : "#E8E8E8"}
                                    color={selectedchat === c ? "white" : "black"}
                                    px={3}
                                    py={2}
                                    borderRadius="lg"
                                    key={c._id}
                                >
                                    <Text>
                                        {!c.isGroupChat ? getSender(loggedUser, c.users) : (c.chatName)}
                                    </Text>
                                </Box>
                            )
                            )}
                        </Stack>
                    ) : (
                        <ChatLoading />
                    )
                }
            </Box>
        </Box>
    )
};

export default MyChats;
