import { Heading, Container, Button, Flex } from '@chakra-ui/react';
import { AiOutlineWhatsApp } from 'react-icons/ai';
import { Link, useSearchParams } from 'react-router-dom';

export default function Finalize() {
    const [searchParams] = useSearchParams();
    const baseUri = `https://wa.me/5518996946870/?text=`;
    const wappMessage = searchParams.get('wappmessage');
    const uri = baseUri + wappMessage;

    return (
        <Container maxW={'5xl'}>
            <Flex align='center' direction='column'>
                <Heading
                    fontWeight={600}
                    fontSize={{ base: '2xl', sm: '4xl', md: '4xl' }}
                    lineHeight={'110%'}
                    mb={8}
                >
                    Seu pedido abaixo
                </Heading>
                <pre style={{ marginBottom: '8px', fontSize: '1rem' }}>
                    {wappMessage?.replaceAll('*', '')}
                </pre>
                <a href={uri} target='_blank'>
                    <Button
                        colorScheme={'green'}
                        color={'white'}
                        bg={'green.400'}
                        px={6}
                        _hover={{
                            bg: 'green.500',
                        }}
                        leftIcon={<AiOutlineWhatsApp />}
                    >
                        Finalizar pedido pelo WhatsApp
                    </Button>
                </a>
                <Link to='/carrinho'>
                    <Button mt='4'>Voltar para o carrinho</Button>
                </Link>
            </Flex>
        </Container>
    );
}
