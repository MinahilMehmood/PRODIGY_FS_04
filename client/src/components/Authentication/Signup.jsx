import { Button, FormControl, FormLabel, Input, useToast, VStack } from '@chakra-ui/react'
import { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [pic, setPic] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const postDetails = (pic) => {
        setLoading(true);
        if (pic === undefined) {
            toast({
                title: "Please select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "ChatApp");
            data.append("cloud_name", "dac8kfwhe");

            fetch("https://api.cloudinary.com/v1_1/dac8kfwhe/image/upload", {
                method: "POST",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.url) {
                        setPic(data.url.toString());
                    } else {
                        throw new Error("Failed to upload image");
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    toast({
                        title: "Image upload failed!",
                        description: err.message,
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom",
                    });
                    setLoading(false);
                });
        } else {
            toast({
                title: "Please select a valid Image (JPEG/PNG)!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPass) {
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
        if (password !== confirmPass) {
            toast({
                title: "Passwords do not match!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/auth/register", { name, email, password, pic });
            toast({
                title: "Registration Successfull!",
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
                <FormControl id="username" isRequired>
                    <FormLabel>
                        Username
                    </FormLabel>
                    <Input placeholder="Username" onChange={(e) => setName(e.target.value)} />
                </FormControl>
                <FormControl id="email" isRequired>
                    <FormLabel>
                        Email
                    </FormLabel>
                    <Input placeholder="user@gmail.com" onChange={(e) => setEmail(e.target.value)} />
                </FormControl>
                <FormControl id="password" isRequired>
                    <FormLabel>
                        Password
                    </FormLabel>
                    <Input placeholder="*****" onChange={(e) => setPassword(e.target.value)} type='password' />
                </FormControl>
                <FormControl id="confirm_pass" isRequired>
                    <FormLabel>
                        Confirm Password
                    </FormLabel>
                    <Input placeholder="*****" onChange={(e) => setConfirmPass(e.target.value)} type='password' />
                </FormControl>
                <FormControl id="pic" isRequired>
                    <FormLabel>
                        Upload Picture
                    </FormLabel>
                    <Input accept="image/*" onChange={(e) => postDetails(e.target.files[0])} type='file' p={1.5} />
                </FormControl>
                <Button
                    width="100%"
                    style={{ marginTop: 15, backgroundColor: "#247d9e", color: "white" }}
                    onClick={handleSubmit}
                    isLoading={loading}
                >
                    Sign Up
                </Button>
            </VStack>
        </div>
    )
};

export default Signup;
