import {
    Container,
    Button,
    Image,
    Flex,
    Heading,
    Text,
    Divider,
    useColorModeValue,
} from '@chakra-ui/react';

import { Link, useParams } from 'react-router-dom';
import useProductsQueryContext from '../../hooks/useProductsQuery';
import NotFound from '../NotFound';
import { formatToCurrency } from '../../utils';
import { ArrowBackIcon, StarIcon } from '@chakra-ui/icons';
import { FaPlusCircle } from 'react-icons/fa';
import useShoppingCart from '../../hooks/useShoppingCart';

export default function ViewProduct() {
    const { code } = useParams() as { code: string };
    const { getProduct } = useProductsQueryContext();
    const { addItem } = useShoppingCart();

    const product = getProduct(code);

    const colorMode = useColorModeValue('purple.600', 'purple.300');
    const bgColorMode = useColorModeValue('purple.300', 'purple.600');

    if (!product) return <NotFound />;

    return (
        <Container maxW={'4xl'}>
            <Link to='/produtos'>
                <Button leftIcon={<ArrowBackIcon />} mb='2'>
                    Voltar
                </Button>
            </Link>
            <Flex gap='2' w='100%' direction={['column', 'column', 'row']}>
                <Flex direction='column' gap='2' grow='1' minH='160px'>
                    <Flex gap='4'>
                        <Heading fontSize={['2xl', '2xl', '3xl']}>
                            {product.is_highlight && <StarIcon fontSize='lg' mr='2' />}
                            {product.label}
                        </Heading>
                    </Flex>
                    <Flex align={['initial', 'initial', 'center']} gap='4' direction={['column', 'column', 'row']}>
                        <Text
                            fontSize='2xl'
                            fontWeight='bold'
                            color={colorMode}
                        >
                            R$ {formatToCurrency(product.price / 100)}
                        </Text>
                        <Text fontSize='xs' fontWeight='light'>
                            {product.category} - {product.code}
                        </Text>
                    </Flex>
                    <Divider />
                    <Text>{product.description}</Text>
                </Flex>
                {product.image_url && (
                    <Image
                        src={product.image_url}
                        maxW={['100%', '100%', '160px']}
                        mb={['8', '8', 'unset']}
                        borderRadius='2xl'
                    />
                )}
            </Flex>
            <Button
                bg={bgColorMode}
                leftIcon={<FaPlusCircle />}
                onClick={() => addItem(product)}
            >
                Adicionar
            </Button>
        </Container>
    );
}
