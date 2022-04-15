import {
    Box, Button, FormControl, FormLabel, Heading, HStack, Image, Input, Modal, ModalBody, ModalCloseButton,
    ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure
} from "@chakra-ui/react";
import { getAuth, signOut } from 'firebase/auth';
import { collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { app } from "../App";
import { useCollectionData } from "react-firebase-hooks/firestore";

function ContactBar(props) {
    const [contactList, setContactList] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const finalRef = React.useRef();
    const auth = getAuth(app);
    const db = getFirestore(app);

    const contactRef = collection(db, "users/" + auth.currentUser.uid + "/chats");
    const q = query(contactRef);
    const [contacts] = useCollectionData(q);

    useEffect(() => {
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
    }, [auth, db]);

    const dynamicList = contactList.map((contact, index) => {
        return (
            <HStack 
                key={contact.key} 
                onClick={() => props.setSelContact(contact.key)} 
                border='2px'
                borderColor='gray.100'
                bg={contact.key === props.selContact ? 'gray.100' : 'white'}
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
            <Button onClick={() => signOut(auth)}>Sign Out</Button>
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