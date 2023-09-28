import {
    Box,
    Heading,
    Container,
    Text,
    Image,
    Flex,
    useColorMode,
} from '@chakra-ui/react';
import { Divider } from '@chakra-ui/react';
import { AiFillInstagram } from 'react-icons/ai';
import { FaWhatsapp } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';

import TawSvg from '../../assets/taw.svg';
import TawSvgDark from '../../assets/taw_dark.svg';
import React from 'react';

export default function Contact() {
    const { colorMode } = useColorMode();

    const CardInfoText: React.FC<React.PropsWithChildren> = ({ children }) => {
        return <Text lineHeight='16px' fontSize='sm'>{children}</Text>;
    };

    const IconWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
        return (
            <Box background='#9900FF' p='2' borderRadius='2xl' color='white'>
                {children}
            </Box>
        );
    };

    return (
        <>
            <Container maxW={'4xl'}>
                <Flex justify='center'>
                    <Box py={['1', '8']} px='4'>
                        <Flex
                            align='center'
                            direction={['column-reverse', 'row']}
                        >
                            <Box>
                                <Flex direction='column' gap='4'>
                                    <Heading fontSize='2xl'>
                                        Tawbacaria Hookah Shop
                                    </Heading>
                                    <Divider />
                                    <Box>
                                        <Flex align='center' gap='2'>
                                            <IconWrapper>
                                                <FaWhatsapp />
                                            </IconWrapper>
                                            <Flex
                                                direction='column'
                                                justify='center'
                                            >
                                                <CardInfoText>
                                                    +55 18 99694-6870
                                                </CardInfoText>
                                            </Flex>
                                        </Flex>
                                    </Box>
                                    <Box>
                                        <Flex align='center' gap='2'>
                                            <IconWrapper>
                                                <AiFillInstagram />
                                            </IconWrapper>
                                            <Flex
                                                direction='column'
                                                justify='center'
                                            >
                                                <CardInfoText>
                                                    @tawbacaria
                                                </CardInfoText>
                                            </Flex>
                                        </Flex>
                                    </Box>
                                    <Box>
                                        <Flex align='center' gap='2'>
                                            <IconWrapper>
                                                <FaLocationDot />
                                            </IconWrapper>
                                            <Flex
                                                direction='column'
                                                justify='center'
                                            >
                                                <CardInfoText>
                                                    Rua São Luis, n° 10-52,
                                                    Centro
                                                </CardInfoText>
                                                <CardInfoText>
                                                    Presidente Epitácio - SP
                                                </CardInfoText>
                                            </Flex>
                                        </Flex>
                                    </Box>
                                </Flex>
                            </Box>
                            <Image
                                src={
                                    colorMode === 'light' ? TawSvgDark : TawSvg
                                }
                                maxW='200px'
                            />
                        </Flex>
                    </Box>
                </Flex>
            </Container>
        </>
    );
}
