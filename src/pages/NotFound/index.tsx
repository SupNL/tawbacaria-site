import { Box, Heading, Container, Stack } from '@chakra-ui/react';

export default function NotFound() {
    return (
        <Container maxW={'4xl'}>
            <Stack
                as={Box}
                textAlign={'center'}
                spacing={{ base: 8, md: 14 }}
                py={{ base: 20, md: 36 }}
            >
                <Heading
                    fontWeight={600}
                    fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                >
                    404 - Página não encontrada
                </Heading>
            </Stack>
        </Container>
    );
}
