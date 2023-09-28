'use client';

import {
    Flex,
    Box,
    Image,
    useColorModeValue,
    Icon,
    Tooltip,
} from '@chakra-ui/react';
import { FiPlusCircle } from 'react-icons/fi';
import { AiOutlinePlus } from 'react-icons/ai';

import useShoppingCart from '../../hooks/useShoppingCart';

import FallbackProductImage from '../../assets/fallback-product.jpg';
import { formatToCurrency } from '../../utils';
import { StarIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

type ProductCardProps = {
    product: TawbacariaApp.ProductItem;
};

function ProductCard(props: ProductCardProps) {
    const { product } = props;
    const { addItem } = useShoppingCart();
    const navigate = useNavigate();
    return (
        <Box
            bg={useColorModeValue('white', 'gray.800')}
            borderWidth='1px'
            rounded='lg'
            shadow='lg'
            position='relative'
            display='flex'
            h={['90px', '100px', '120px']}
        >
            <Image
                src={product.image_url ?? FallbackProductImage}
                alt={`Imagem de ${product.label}`}
                roundedLeft='lg'
                objectFit='cover'
                maxW={['60px', '100px', '120px']}
                _hover={{
                    cursor: 'pointer',
                }}
                onClick={() => navigate(`/produto/${product.code}`)}
            />
            <Tooltip
                label='Adicionar ao carrinho'
                bg='white'
                placement={'left-start'}
                color={'gray.800'}
                fontSize={'1.2em'}
                top='3'
            >
                <Box
                    display={['none', 'none', 'flex']}
                    position='absolute'
                    bottom='2'
                    right='2'
                    p={1}
                    _hover={{
                        cursor: 'pointer',
                    }}
                >
                    <Icon
                        as={FiPlusCircle}
                        h={[6, null, 10]}
                        w={[6, null, 10]}
                        alignSelf={'center'}
                        color={useColorModeValue('grey.300', 'grey.300')}
                        onClick={() => addItem(product)}
                    />
                </Box>
            </Tooltip>
            <Box
                p={['2', null, '4']}
                _hover={{
                    cursor: 'pointer',
                }}
                onClick={() => navigate(`/produto/${product.code}`)}
            >
                <Flex direction='row' alignItems='center' gap='2'>
                    {product.is_highlight && <StarIcon />}
                    <Box
                        fontSize={['xs', 'md', '2xl']}
                        fontWeight='semibold'
                        as='h4'
                        textAlign='initial'
                    >
                        {product.label}
                    </Box>
                </Flex>
                <Flex
                    direction='column'
                    justifyContent='space-between'
                    alignContent='flex-start'
                    textAlign='initial'
                >
                    <Box
                        fontSize={['2xs', null, 'xs']}
                        as='h5'
                        color={useColorModeValue('gray.600', 'gray.400')}
                    >
                        {`    ${product.category}`}
                    </Box>
                </Flex>
                <Flex justifyContent='space-between' alignContent='center'>
                    <Box
                        fontSize={['md', 'xl', '2xl']}
                        fontWeight='semibold'
                        color={useColorModeValue('purple.500', 'purple.300')}
                    >
                        <Box
                            as='span'
                            color={useColorModeValue(
                                'purple.500',
                                'purple.300'
                            )}
                            fontSize='md'
                            pr={['1', null, '2']}
                        >
                            R$
                        </Box>
                        {formatToCurrency(product.price / 100)}
                        <Box as='span' fontSize='sm'>
                            {' '}
                            un.
                        </Box>
                    </Box>
                </Flex>
            </Box>
            <Box
                display={['flex', 'flex', 'none']}
                ml='auto'
                px='3'
                bg='purple.300'
                roundedRight='lg'
                justifyContent='center'
                flexDirection='column'
                onClick={() => addItem(product)}
            >
                <AiOutlinePlus />
            </Box>
        </Box>
    );
}

export default ProductCard;
