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
import { formatToCurrency, generateThumbnailUrl } from '../../utils';
import { StarIcon } from '@chakra-ui/icons';

type ProductCardProps = {
    product: TawbacariaApp.ProductItem;
    onSelect?: (product: TawbacariaApp.ProductItem) => void;
};

function ProductCard(props: ProductCardProps) {
    const { product } = props;
    const { addItem } = useShoppingCart();

    const discountPriceColor = useColorModeValue('purple.400', 'purple.200');

    const handleOnClick = () => {
        if (!props.onSelect) return;
        props.onSelect(product);
    };

    return (
        <Box
            bg={useColorModeValue('white', 'gray.800')}
            borderWidth='1px'
            rounded='lg'
            shadow='lg'
            position='relative'
            display='flex'
            minH={['90px', '100px', '120px']}
        >
            <Image
                src={
                    product.image_url
                        ? generateThumbnailUrl(product.image_url, 'small')
                        : FallbackProductImage
                }
                alt={`Imagem de ${product.label}`}
                roundedLeft='lg'
                objectFit='cover'
                maxW={['60px', '100px', '120px']}
                _hover={{
                    cursor: 'pointer',
                }}
                onClick={handleOnClick}
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
                onClick={handleOnClick}
            >
                <Flex direction='row' alignItems='center' gap='2'>
                    {product.is_highlight && <StarIcon />}
                    <Box
                        fontSize={['xs', 'md', 'xl']}
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
                <Flex alignContent='center'>
                    <Flex direction='column'>
                        {product.originalPrice && (
                            <Box
                                fontSize={['3xs', '2xs', 'sm']}
                                fontWeight='semibold'
                                color={discountPriceColor}
                                textDecoration='line-through'
                                lineHeight='0.3'
                                mt='1'
                            >
                                {'R$ ' +
                                    formatToCurrency(
                                        product.originalPrice / 100
                                    )}
                            </Box>
                        )}
                        <Box
                            fontSize={['md', 'xl', '2xl']}
                            fontWeight='semibold'
                            color={useColorModeValue(
                                'purple.500',
                                'purple.300'
                            )}
                        >
                            <Box as='span' fontSize='md' pr='1'>
                                R$
                            </Box>
                            {formatToCurrency(product.price / 100)}
                            {/* <Box as='span' fontSize='sm'>
                                {' '}
                                un.
                            </Box> */}
                        </Box>
                    </Flex>
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
