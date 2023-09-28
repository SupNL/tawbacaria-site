import {
    Box,
    Flex,
    HStack,
    IconButton,
    Button,
    useDisclosure,
    useColorModeValue,
    Stack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import ThemeButtonToggle from '../ThemeButtonToggle';
import { Link } from 'react-router-dom';

interface Props {
    children: React.ReactNode;
    to: string;
}

const Links = [
    {
        label: 'Página inicial',
        path: '/',
    },
    {
        label: 'Produtos',
        path: '/produtos',
    },
    {
        label: 'Contato',
        path: '/contato',
    },
];

const NavLink = (props: Props) => {
    const { children } = props;
    return (
        <Link to={props.to}>
            <Box
                px={2}
                py={1}
                rounded={'md'}
                _hover={{
                    textDecoration: 'none',
                    bg: useColorModeValue('gray.200', 'gray.700'),
                }}
            >
                {children}
            </Box>
        </Link>
    );
};

export default function WithAction() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex
                    h={16}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Abrir menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{ base: 'none', md: 'flex' }}
                        >
                            {Links.map((item) => (
                                <NavLink key={item.path} to={item.path}>
                                    {item.label}
                                </NavLink>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'} mr='2'>
                        <Link to='carrinho'>
                            <Button
                                backgroundColor='purple.300'
                                color='black'
                                _hover={{
                                    textDecoration: 'none',
                                    bg: 'purple.400',
                                }}
                                mr={4}
                                leftIcon={<AiOutlineShoppingCart />}
                            >
                                Carrinho
                            </Button>
                        </Link>
                        <ThemeButtonToggle />
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map((item) => (
                                <NavLink key={item.path} to={item.path}>
                                    {item.label}
                                </NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    );
}
