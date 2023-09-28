import {
    Box,
    Container,
    Button,
    Stack,
    Image,
    Flex,
    useColorMode,
} from '@chakra-ui/react';

import TawSvg from '../../assets/taw.svg';
import TawSvgDark from '../../assets/taw_dark.svg';
import { Link } from 'react-router-dom';

export default function Home() {
    const { colorMode } = useColorMode();
    return (
        <>
            <Container maxW={'4xl'}>
                <Stack as={Box} textAlign={'center'} py={{ base: 10, md: 36 }}>
                    <Box>
                        <Flex justifyContent='center'>
                            <Image
                                src={colorMode === 'dark' ? TawSvg : TawSvgDark}
                            />
                        </Flex>
                    </Box>
                    <Stack
                        direction={'column'}
                        spacing={3}
                        align={'center'}
                        alignSelf={'center'}
                        position={'relative'}
                    >
                        <Link to='produtos'>
                            <Button
                                colorScheme={'blue'} 
                                bg={'purple.400'}
                                rounded={'full'}
                                px={6}
                                _hover={{
                                    bg: 'purple.500',
                                }}
                            >
                                Ver produtos
                            </Button>
                        </Link>
                        <Button
                            variant={'link'}
                            colorScheme={'blue'}
                            size={'sm'}
                        >
                            Contato
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </>
    );
}
