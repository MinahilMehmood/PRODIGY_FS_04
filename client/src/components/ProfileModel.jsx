import React from 'react';
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
    Image,
    Text,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons';

const ProfileModel = ({ user, children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {children ?
                <span onClick={onOpen}>{children}</span> :
                <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            }
            <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent height="410px">
                    <ModalHeader fontSize="40px" fontWeight="400" fontFamily="Work Sans" display="flex" justifyContent="center">{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
                        <Image borderRadius="full" boxSize="150px" src={user.pic || user.profilePic} alt={user.email} />
                        <Text fontSize="24px" color="lightgrey">Email: {user.email}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
};

export default ProfileModel;
