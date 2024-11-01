import { ViewIcon } from '@chakra-ui/icons';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    Button,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,
} from '@chakra-ui/react'
import { ChatState } from '../context/chatProvider';
import { useState } from 'react';
import UserBadgeItem from "./UserBadgeItem";
import axios from "axios";
import UserListItem from "./UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, selectedchat, setSelectedChat } = ChatState();
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const toast = useToast();

    const handleRemove = async (user1) => {

        if (selectedchat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only admin can add someone.",
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

            const { data } = await axios.put("http://localhost:5000/chat/groupremove", {
                chatId: selectedchat._id,
                userId: user1._id
            }, config);

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);

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
    }

    const handleAddUser = async (user1) => {
        if (selectedchat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User already in group.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (selectedchat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admin can add someone.",
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

            const { data } = await axios.put("http://localhost:5000/chat/groupadd", {
                chatId: selectedchat._id,
                userId: user1._id
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);

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

    }

    const handleRename = async () => {
        if (!groupChatName) {
            return;
        }

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put("http://localhost:5000/chat/rename", {
                chatId: selectedchat._id,
                chatName: groupChatName
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (err) {
            toast({
                title: "Error Occurred!",
                description: err.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    }

    const handleSearch = async (value) => {
        setSearch(value);
        if (!value) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const res = await axios.get(`http://localhost:5000/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(res.data);
        } catch (err) {
            toast({
                title: "Error Occurred!",
                description: "Failed to load the search results!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="32px"
                        display="flex"
                        fontFamily="Work sans"
                        justifyContent="center"
                        color="#333"
                        fontWeight="400"
                    >{selectedchat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box
                            w="100%"
                            display="flex"
                            flexWrap="wrap"
                            pb={3}
                        >
                            {selectedchat.users.map((user) => (
                                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleRemove(user)} />
                            ))}
                        </Box>
                        <FormControl
                            display="flex"
                        >
                            <Input placeholder='Chat Name' mb={3} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
                            <Button
                                variant="solid"
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add user to group' mb={1} onChange={(e) => handleSearch(e.target.value)} />

                        </FormControl>
                        {
                            loading ?
                                (<Spinner size="lg" />) :
                                (
                                    searchResult?.map((user) => {
                                        return <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                                    })
                                )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme='red'>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
};

export default UpdateGroupChatModal;
