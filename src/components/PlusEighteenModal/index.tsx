import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
} from '@chakra-ui/react';
import { useState } from 'react';

const key = 'tawbacaria-app-plus-eighteen';

export default function PlusEighteenModal() {
    const [isOpen, setIsOpen] = useState(localStorage.getItem(key) !== 'yes');
    return (
        <Modal isOpen={isOpen} onClose={() => {}} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent maxW='80%' minW='30%' width='unset'>
                <ModalHeader>Verificação de idade</ModalHeader>
                <ModalBody>
                    <Text>Loja disponível apenas para maiores de 18 anos.</Text>
                    <Text>Você tem 18 anos ou mais?</Text>
                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme='red'
                        mr={3}
                        onClick={() => {
                            location.href = 'https://www.google.com';
                        }}
                    >
                        Não
                    </Button>
                    <Button
                        colorScheme='green'
                        onClick={() => {
                            localStorage.setItem(key, 'yes');
                            setIsOpen(false);
                        }}
                    >
                        Sim
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
