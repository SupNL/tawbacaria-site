import { PropsWithChildren, useState } from 'react';
import {
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Modal,
    ModalContent,
    ModalOverlay,
    Select,
    Text,
} from '@chakra-ui/react';

import deliveryFeeData from '../../assets/delivery_free.json';
import { getLocalStorageObjectSafely } from '../../utils';

const storageKeyAddress = 'tawbacaria-app-address';

const SmallText: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <span
            style={{
                display: 'inline-block',
                fontSize: '10px',
                marginLeft: '4px',
                verticalAlign: 'top',
            }}
        >
            {children}
        </span>
    );
};

const SetAddressModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const [addressInfo, setAddressInfo] = useState<AddressInfo>(() => {
        const data =
            getLocalStorageObjectSafely<AddressInfo>(storageKeyAddress);
        return (
            data ?? {
                address: '',
                number: '',
                district: '',
            }
        );
    });

    const isAddressError = addressInfo.address === '';
    const isNumberError = addressInfo.number === '';
    const isDistrictError = addressInfo.district == '';

    const handleSave = () => {
        localStorage.setItem(storageKeyAddress, JSON.stringify(addressInfo));
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent gap='2' w={['90%', 'unset', 'unset']} p='3'>
                <FormControl isRequired isInvalid={isAddressError}>
                    <FormLabel>Logradouro</FormLabel>
                    <Input
                        value={addressInfo.address}
                        onChange={(e) =>
                            setAddressInfo((old) => ({
                                ...old,
                                address: e.target.value,
                            }))
                        }
                    />
                    <FormErrorMessage>Obrigatório</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={isNumberError}>
                    <FormLabel>Número</FormLabel>
                    <Input
                        value={addressInfo.number}
                        onChange={(e) =>
                            setAddressInfo((old) => ({
                                ...old,
                                number: e.target.value,
                            }))
                        }
                    />
                    <FormErrorMessage>Obrigatório</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={isDistrictError}>
                    <FormLabel>
                        Bairro
                        <SmallText>(1)</SmallText>
                    </FormLabel>
                    <Select
                        value={addressInfo.district as string}
                        onChange={(e) =>
                            setAddressInfo((old) => ({
                                ...old,
                                district: e.target
                                    .value as keyof typeof deliveryFeeData,
                            }))
                        }
                    >
                        <option hidden disabled value=''>
                            Selecione o bairro
                        </option>
                        {Object.entries(deliveryFeeData).map(([key, item]) => (
                            <option value={key} key={key}>
                                {item.label}
                            </option>
                        ))}
                    </Select>
                    <FormErrorMessage>Obrigatório</FormErrorMessage>
                </FormControl>
                <FormControl>
                    <FormLabel>
                        Cidade
                        <SmallText>(2)</SmallText>
                    </FormLabel>
                    <Input disabled value='Presidente Epitácio' />
                </FormControl>
                <FormControl>
                    <FormLabel>Estado</FormLabel>
                    <Input disabled value='São Paulo' />
                </FormControl>

                <Text>
                    <SmallText>(1)</SmallText> Valor do frete sujeito à
                    alteração se o local de entrega não corresponder ao bairro
                </Text>
                <Text>
                    <SmallText>(2)</SmallText> Entregas apenas em Presidente
                    Epitácio - SP
                </Text>
                <Flex gap='2'>
                    <Button
                        colorScheme={'green'}
                        bg={'green.400'}
                        isDisabled={
                            isAddressError || isDistrictError || isNumberError
                        }
                        onClick={handleSave}
                    >
                        Salvar
                    </Button>
                    <Button onClick={onClose}>Cancelar</Button>
                </Flex>
            </ModalContent>
        </Modal>
    );
};

export default SetAddressModal;
