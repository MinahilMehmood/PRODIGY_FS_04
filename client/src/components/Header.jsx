import { Avatar, Box, Button, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useState } from "react";
import { ChatState } from "../context/chatProvider";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import ChatLoading from "./ChatLoading";
import axios from "axios";
import UserListItem from "./UserListItem";
import { getSender } from "../config/chatLogics";
import { Effect } from "react-notification-badge";
import NotificationBadge from 'react-notification-badge';

const Header = () => {

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    }

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
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
                title: "Error Occured!",
                description: "Failed to load the search results",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post("http://localhost:5000/chat", { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (err) {
            toast({
                title: "Error Fetching the chat!",
                description: err.message,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" bg="white" w="100%" p="5px 10px 5px 10px" borderWidth="5px">
                <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
                    <Button onClick={onOpen} variant="ghost">
                        <i class="fas fa-search"></i>
                        <Text display={{ base: "none", md: "flex" }} fontWeight="300" px="4">Search User</Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Work Sans" fontWeight="300">Chatter Box</Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No New Message."}
                            {notification.map((n) => (
                                <MenuItem key={n._id} onClick={() => {
                                    setSelectedChat(n.chat)
                                    setNotification(notification.filter((not) => not !== n))
                                }}>
                                    {n.chat.isGroupChat ? `New message in ${n.chat.chatName}` : `New message from ${getSender(user, n.chat.users)}`}
                                </MenuItem>
                            )
                            )}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.profilePic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModel>
                            <MenuDivider />
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>

            </Box>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">
                        Search Users
                    </DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" p={2}>
                            <Input fontSize="15px" placeholder="Search by name or email" mr={2} value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button onClick={handleSearch}>
                                Go
                            </Button>
                        </Box>
                        {loading ?
                            (
                                <ChatLoading />
                            ) :
                            (
                                searchResult?.map((s) => {
                                    return <UserListItem key={s._id} user={s} handleFunction={() => accessChat(s._id)} />
                                })
                            )
                        }
                        {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

        </>
    )
};

export default Header;
