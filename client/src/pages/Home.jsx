import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Home = () => {

    const navigate = useNavigate();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            navigate("/chats");
        }
    }, [navigate])

    return (
        <Container maxW="xl" centerContent>
            <Box
                d="flex"
                justifyContent="center"
                p="3"
                bg="white"
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text
                    textAlign="center"
                    fontSize="3xl"
                    fontWeight="300"
                    fontFamily="Work Sans"
                >
                    Chatter Box
                </Text>
            </Box>
            <Box
                p="4"
                bg="white"
                w="100%"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Tabs variant='soft-rounded'>
                    <TabList mb="1em">
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Sign Up</Tab>
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
    )
}

export default Home
