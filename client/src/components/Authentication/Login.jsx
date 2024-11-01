import { Button, FormControl, FormLabel, Input, useToast, VStack } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: "Please select a valid Image (JPEG/PNG)!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/auth/login", { email, password });
            toast({
                title: "Login Successfull!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            setLoading(false);
            navigate("/chats");
        } catch (err) {
            toast({
                title: "Error Occurres!",
                description: err.response.data.message,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    }

    return (
        <div>
            <VStack
                spacing="5px"
                color="black"
            >
                <FormControl id="email" isRequired>
                    <FormLabel>
                        Email
                    </FormLabel>
                    <Input value={email} placeholder="user@gmail.com" onChange={(e) => setEmail(e.target.value)} />
                </FormControl>
                <FormControl id="password" isRequired>
                    <FormLabel>
                        Password
                    </FormLabel>
                    <Input value={password} placeholder="*****" onChange={(e) => setPassword(e.target.value)} type='password' />
                </FormControl>
                <Button
                    width="100%"
                    style={{ marginTop: 15, backgroundColor: "#247d9e", color: "white" }}
                    onClick={handleSubmit}
                    isLoading={loading}
                >
                    Login
                </Button>
                <Button
                    width="100%"
                    style={{ marginTop: 15, backgroundColor: "rgb(238, 77, 77)", color: "white" }}
                    onClick={() => {
                        setEmail("guest@example.com");
                        setPassword("123456")
                    }}
                >
                    Get Guest User Credentials
                </Button>
            </VStack>
        </div>
    )
};

export default Login;
