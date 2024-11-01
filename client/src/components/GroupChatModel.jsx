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
    FormLabel,
    Input,
    Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ChatState } from '../context/chatProvider';
import axios from 'axios';
import UserListItem from "./UserListItem";
import UserBadgeItem from './UserBadgeItem';

const GroupChatModel = ({ children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { user, setChats, chats } = ChatState();

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

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the fields!",
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
                    Authorization: `Bearer ${user.token}`
                }
            };
            const res = await axios.post("http://localhost:5000/chat/group", {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map(u => u._id))
            }, config);
            setChats([res.data, ...chats]);
            onClose();
            toast({
                title: "New group chat created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } catch (err) {
            toast({
                title: "Failed to create the chat.",
                description: err.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    const handleGroup = (user) => {
        if (selectedUsers.includes(user)) {
            toast({
                title: "User already added.",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setSelectedUsers([...selectedUsers, user]);
    }

    const handleDelete = (user) => {
        setSelectedUsers(selectedUsers.filter(sel => sel._id != user._id));
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                    >
                        <FormControl>
                            <Input placeholder='Chat Name' mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add Users eg: ali, ibrahim, fatima' mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        <Box
                            w="100%"
                            display="flex"
                            flexWrap="wrap"
                        >
                            {selectedUsers.map((user) => (
                                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />
                            ))}
                        </Box>
                        {loading ?
                            <span>Loading</span> :
                            (
                                searchResult?.slice(0, 4).map((s) => (
                                    <UserListItem key={s._id} user={s} handleFunction={() => handleGroup(s)} />
                                ))
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
};

export default GroupChatModel;
