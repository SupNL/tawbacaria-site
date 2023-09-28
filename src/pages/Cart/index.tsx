import { useEffect, useState } from 'react';
import {
    Heading,
    Container,
    Text,
    Button,
    Stack,
    Flex,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Image,
    Select,
    Input,
    FormLabel,
    FormControl,
    FormErrorMessage,
    RadioGroup,
    Radio,
    NumberInput,
    NumberInputField,
    IconButton,
    Box,
} from '@chakra-ui/react';
import useShoppingCart from '../../hooks/useShoppingCart';
import {
    buildAndEncodeMessage,
    formatToCurrency,
    getLocalStorageObjectSafely,
    getSessionStorageObjectSafely,
    parseCurrency,
} from '../../utils';
import {
    AiOutlineMinus,
    AiOutlinePlus,
    AiOutlineWhatsApp,
} from 'react-icons/ai';
import { FaTimesCircle } from 'react-icons/fa';

import deliveryFeeData from '../../assets/delivery_free.json';
import SetAddressModal from '../../components/SetAddressModal';

const storageKeyName = 'tawbacaria-app-user-name';
const storageKeyPayment = 'tawbacaria-app-user-payment';
const storageKeyAddress = 'tawbacaria-app-address';
const storageKeyRetire = 'tawbacaria-app-retire';

function opentoNewTab(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
}

const buildAddressText = (data: AddressInfo | null) => {
    return data
        ? `${data.address} ${data.number}, ${data.district}, Presidente Epitácio - SP`
        : null;
};

const getAddress: () => AddressInfo | null = () => {
    return getLocalStorageObjectSafely<AddressInfo>(storageKeyAddress);
};

type PaymentMethod = {
    method: string;
    change: boolean | null;
    changeValue: string;
};

export default function Cart() {
    const { items, addItem, removeItem, clearItem } = useShoppingCart();

    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
        getSessionStorageObjectSafely<PaymentMethod>(storageKeyPayment) ?? {
            method: '',
            change: null,
            changeValue: '',
        }
    );
    const [userName, setUserName] = useState(
        localStorage.getItem(storageKeyName) ?? ''
    );
    const [toRetire, setToRetire] = useState(
        localStorage.getItem(storageKeyRetire) ?? ''
    );

    useEffect(() => {
        sessionStorage.setItem(
            storageKeyPayment,
            JSON.stringify(paymentMethod)
        );
    }, [paymentMethod]);

    useEffect(() => {
        localStorage.setItem(storageKeyName, userName);
    }, [userName]);

    useEffect(() => {
        localStorage.setItem(storageKeyRetire, toRetire);
    }, [toRetire]);

    const seeItensButton = (
        <Button variant={'link'} colorScheme={'blue'} size={'sm'}>
            Ver produtos
        </Button>
    );

    const savedAddress = getAddress();
    const textAddress =
        toRetire === 'no' ? buildAddressText(savedAddress) : null;
    const deliveryFee =
        savedAddress && savedAddress?.district !== '' && toRetire === 'no'
            ? deliveryFeeData[
                  savedAddress.district as keyof typeof deliveryFeeData
              ].price
            : null;
    const totalPrice =
        Object.values(items).reduce(
            (prev, curr) => prev + curr.price * curr.count,
            0
        ) + (deliveryFee ?? 0);
    const changeNumeric =
        paymentMethod.change && paymentMethod.changeValue
            ? Number(paymentMethod.changeValue)
            : null;
    const neededChange =
        totalPrice && changeNumeric ? changeNumeric - totalPrice : 0;

    const handleNewRequest = () => {
        const baseUri = `https://wa.me/5518996946870/?text=`;
        const message = buildAndEncodeMessage({
            name: userName,
            paymentMethod: paymentMethod.method,
            shoppingCart: items,
            totalPrice: totalPrice,
            deliveryFee: deliveryFee,
            changeValue: changeNumeric,
            fullAddress: textAddress,
        });
        opentoNewTab(`${baseUri}${message}`);
    };

    const formatToValue = (value: string) => {
        const numeric = Number(value);
        return `${formatToCurrency(numeric / 100)}`;
    };

    return (
        <Container maxW={'4xl'}>
            <SetAddressModal
                isOpen={isAddressModalVisible}
                onClose={() => setIsAddressModalVisible(false)}
            />
            <Heading
                fontWeight={600}
                fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                lineHeight={'110%'}
            >
                Seu carrinho
            </Heading>
            <Stack
                direction={'column'}
                spacing={3}
                align={'center'}
                alignSelf={'center'}
                position={'relative'}
            >
                {Object.keys(items).length <= 0 ? (
                    <>
                        <Heading
                            mt='8'
                            fontWeight={600}
                            fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
                        >
                            Carrinho vazio!
                        </Heading>
                        {seeItensButton}
                    </>
                ) : (
                    <>
                        <TableContainer>
                            <Table variant='simple'>
                                <Thead>
                                    <Tr>
                                        <Th>Seus itens</Th>
                                        <Th>Preço unitário</Th>
                                        <Th isNumeric>Quantia</Th>
                                        <Th isNumeric>Total</Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {Object.values(items).map((item) => (
                                        <Tr
                                            key={item.code}
                                            alignItems='center'
                                            position='relative'
                                            overflow='visible'
                                        >
                                            <Td>
                                                <Flex align='center' gap='2'>
                                                    {item.image_url && (
                                                        <Image
                                                            src={item.image_url}
                                                            alt={item.label}
                                                            rounded='lg'
                                                            maxW='52px'
                                                        />
                                                    )}
                                                    {item.label}
                                                </Flex>
                                            </Td>
                                            <Td>
                                                R${' '}
                                                {formatToCurrency(
                                                    item.price / 100
                                                )}
                                            </Td>
                                            <Td isNumeric>
                                                <Flex align='center' gap='2'>
                                                    <IconButton
                                                        aria-label='Decrementar item'
                                                        icon={
                                                            <AiOutlineMinus />
                                                        }
                                                        isDisabled={
                                                            item.count <= 1
                                                        }
                                                        onClick={() =>
                                                            removeItem(item)
                                                        }
                                                    />
                                                    <Box minW='auto' px='3'>
                                                        {item.count}
                                                    </Box>
                                                    <IconButton
                                                        aria-label='Incrementar item'
                                                        icon={<AiOutlinePlus />}
                                                        onClick={() =>
                                                            addItem(item)
                                                        }
                                                    />
                                                </Flex>
                                            </Td>
                                            <Td isNumeric position='relative'>
                                                R${' '}
                                                {formatToCurrency(
                                                    (item.price / 100) *
                                                        item.count
                                                )}
                                            </Td>
                                            <Td>
                                                <IconButton
                                                    aria-label='Remover item'
                                                    icon={<FaTimesCircle />}
                                                    onClick={() =>
                                                        clearItem(item)
                                                    }
                                                    size='sm'
                                                />
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        <Flex>
                            <FormControl isRequired isInvalid={toRetire == ''}>
                                <FormLabel>Retirar produto no local?</FormLabel>
                                <RadioGroup
                                    onChange={(value) => setToRetire(value)}
                                    value={toRetire}
                                >
                                    <Stack direction='row'>
                                        <Radio value='yes'>Sim</Radio>
                                        <Radio value='no'>Não</Radio>
                                    </Stack>
                                </RadioGroup>
                                <FormErrorMessage>Obrigatório</FormErrorMessage>
                            </FormControl>
                        </Flex>
                        <Flex
                            direction='column'
                            align='center'
                            justifyContent='center'
                        >
                            {toRetire === 'no' && (
                                <FormControl
                                    isRequired
                                    isInvalid={savedAddress == null}
                                >
                                    <Flex gap='4' align='center'>
                                        <Text>
                                            {textAddress ??
                                                'Endereço de entrega ainda não definido'}
                                        </Text>
                                        <Button
                                            colorScheme={'blue'}
                                            bg={'blue.400'}
                                            onClick={() =>
                                                setIsAddressModalVisible(true)
                                            }
                                            size='sm'
                                        >
                                            {savedAddress
                                                ? 'Alterar'
                                                : 'Definir'}
                                        </Button>
                                    </Flex>
                                    <FormErrorMessage>
                                        Obrigatório
                                    </FormErrorMessage>
                                </FormControl>
                            )}
                        </Flex>
                        <Text fontSize='3xl'>
                            Total:{' '}
                            <span style={{ fontWeight: 'bold' }}>
                                R$ {formatToCurrency(totalPrice / 100)}
                            </span>
                        </Text>
                        {deliveryFee && (
                            <Text fontSize='md'>
                                (Inclui frete:{' '}
                                <span style={{ fontWeight: 'bold' }}>
                                    R$ {formatToCurrency(deliveryFee / 100)}
                                </span>
                                )
                            </Text>
                        )}
                        <Flex gap='4' direction='column'>
                            <FormControl isRequired isInvalid={userName === ''}>
                                <FormLabel>Seu nome/apelido</FormLabel>
                                <Input
                                    value={userName}
                                    onChange={(e) =>
                                        setUserName(e.target.value)
                                    }
                                />
                                <FormErrorMessage>Obrigatório</FormErrorMessage>
                            </FormControl>
                            <FormControl
                                isRequired
                                isInvalid={paymentMethod.method === ''}
                            >
                                <FormLabel>Forma de pagamento</FormLabel>
                                <Select
                                    value={paymentMethod.method}
                                    onChange={(e) =>
                                        setPaymentMethod((old) => ({
                                            ...old,
                                            method: e.target.value,
                                        }))
                                    }
                                >
                                    <option hidden disabled value=''>
                                        Selecione a forma de pagamento
                                    </option>
                                    <option value='Cartão (Crédito)'>
                                        Cartão (Crédito)
                                    </option>
                                    <option value='Cartão (Débito)'>
                                        Cartão (Débito)
                                    </option>
                                    <option value='Dinheiro'>Dinheiro</option>
                                    <option value='PIX'>PIX</option>
                                </Select>
                                <FormErrorMessage>Obrigatório</FormErrorMessage>
                            </FormControl>
                            {paymentMethod.method === 'PIX' && (
                                <Text maxW='280px' mx='auto' fontSize='xs'>
                                    O pagamento por PIX poderá ser efetuado após
                                    o pedido ser confirmado pelo estabelecimento
                                    no WhatsApp.
                                </Text>
                            )}
                            {paymentMethod.method === 'Dinheiro' && (
                                <>
                                    <FormControl
                                        isRequired
                                        isInvalid={paymentMethod.change == null}
                                    >
                                        <FormLabel>Precisa de troco?</FormLabel>
                                        <RadioGroup
                                            onChange={(value) =>
                                                setPaymentMethod((old) => ({
                                                    ...old,
                                                    change:
                                                        value === 'yes'
                                                            ? true
                                                            : false,
                                                }))
                                            }
                                            value={
                                                paymentMethod.change == null
                                                    ? ''
                                                    : paymentMethod.change
                                                    ? 'yes'
                                                    : 'no'
                                            }
                                        >
                                            <Stack direction='row'>
                                                <Radio value='yes'>Sim</Radio>
                                                <Radio value='no'>Não</Radio>
                                            </Stack>
                                        </RadioGroup>
                                        <FormErrorMessage>
                                            Obrigatório
                                        </FormErrorMessage>
                                    </FormControl>
                                    {paymentMethod.change === true && (
                                        <FormControl
                                            isRequired
                                            isInvalid={neededChange <= 0}
                                        >
                                            <FormLabel>Troco para</FormLabel>
                                            <NumberInput
                                                onChange={(valueString) =>
                                                    setPaymentMethod((old) => ({
                                                        ...old,
                                                        changeValue:
                                                            parseCurrency(
                                                                valueString
                                                            ),
                                                    }))
                                                }
                                                value={formatToValue(
                                                    paymentMethod.changeValue
                                                )}
                                            >
                                                <Flex align='center' gap='2'>
                                                    <Text>R$</Text>
                                                    <NumberInputField />
                                                </Flex>
                                            </NumberInput>
                                            {neededChange > 0 && (
                                                <Text>
                                                    Troco: R${' '}
                                                    {formatToCurrency(
                                                        neededChange / 100
                                                    )}
                                                </Text>
                                            )}
                                            <FormErrorMessage>
                                                Precisa ser superior ao total
                                            </FormErrorMessage>
                                        </FormControl>
                                    )}
                                </>
                            )}
                        </Flex>
                        <Flex gap='4'>
                            <Button
                                colorScheme={'green'}
                                color={'white'}
                                bg={'green.400'}
                                px={6}
                                _hover={{
                                    bg: 'green.500',
                                }}
                                isDisabled={
                                    toRetire === '' ||
                                    (toRetire === 'no' &&
                                        savedAddress == null) ||
                                    userName === '' ||
                                    paymentMethod.method === '' ||
                                    (paymentMethod.method === 'Dinheiro' &&
                                        (paymentMethod.change == null ||
                                            (paymentMethod.change === true &&
                                                neededChange <= 0)))
                                }
                                onClick={handleNewRequest}
                                leftIcon={<AiOutlineWhatsApp />}
                            >
                                Finalizar pedido pelo WhatsApp
                            </Button>
                        </Flex>
                    </>
                )}
            </Stack>
        </Container>
    );
}
