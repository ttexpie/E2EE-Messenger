import { Box, Button, Heading, HStack, Image, Text, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, 
    ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { useEffect, useState } from "react";
import React from "react";
import { app } from "../App";

function ContactBar(props) {
    const [contactList, setContactList] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const finalRef = React.useRef();

    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore(app);

        const addContact = (k, n, r) => {
            setContactList(contactList => [...contactList, {key: k, name: n, recent: r}]);
        }

        const getContacts = async () => {
            const q = query(collection(db, "users/" + auth.currentUser.uid + "/chats"));
            const snap = await getDocs(q);
            snap.forEach((doc) => {
                console.log(doc.id);
                addContact(doc.id, doc.get("name"), "recent message goes here");
            });
        }

        getContacts();
    }, []);

    const dynamicList = contactList.map((contact, index) => {
        return (
            <HStack 
                key={contact.key} 
                onClick={() => props.setSelContact(contact.name)} 
                border='2px'
                borderColor='gray.100'
                bg={contact.name === props.selContact ? 'gray.100' : 'white'}
                align='center'>
                <Image 
                    src='http://cdn.onlinewebfonts.com/svg/img_173956.png' 
                    alt='avatar'
                    borderRadius='full'
                    boxSize='100px'
                />
                <Box>
                    <Heading>{contact.name}</Heading>
                    <Text isTruncated>{contact.recent}</Text>
                </Box>
            </HStack>
        );
    });

    return (
        <Box>
            <Button onClick={onOpen}>New Contact</Button>
            <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>New Contact</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Enter email for contact</FormLabel>
                            <Input placeholder='Email' />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            
            {dynamicList}
        </Box>
    );
}

export default ContactBar;