import {
    Box,
    Button,
    Container,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Image,
    Input,
    Modal,
    ModalContent,
    ModalOverlay,
    Select,
    Spinner,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import ProductCard from '../../components/ProductCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import useProductsQueryContext from '../../hooks/useProductsQuery/';
import { useCallback, useEffect, useState } from 'react';

import './style.css';
import { ArrowBackIcon, StarIcon } from '@chakra-ui/icons';
import { FaPlusCircle } from 'react-icons/fa';
import useShoppingCart from '../../hooks/useShoppingCart';
import { formatToCurrency } from '../../utils';

const PAGE_LIMIT = 10;

const ProductDisplay: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    product: TawbacariaApp.ProductItem | null;
}> = ({ isOpen, onClose, product }) => {
    const { addItem } = useShoppingCart();

    const colorMode = useColorModeValue('purple.600', 'purple.300');
    const bgColorMode = useColorModeValue('purple.300', 'purple.600');

    if (!product) return null;

    console.log(isOpen);

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
            <ModalOverlay />
            <ModalContent maxW='80%' minW='70%' width='unset' padding='1rem'>
                <Button leftIcon={<ArrowBackIcon />} mb='2' onClick={onClose}>
                    Voltar
                </Button>
                <Flex gap='2' w='100%' direction={['column', 'column', 'row']}>
                    <Flex direction='column' gap='2' grow='1' minH='160px'>
                        <Flex gap='4'>
                            <Heading fontSize={['2xl', '2xl', '3xl']}>
                                {product.is_highlight && (
                                    <StarIcon fontSize='lg' mr='2' />
                                )}
                                {product.label}
                            </Heading>
                        </Flex>
                        <Flex
                            align={['initial', 'initial', 'center']}
                            gap='2'
                            direction={['column', 'column', 'row']}
                        >
                            {product.originalPrice && (
                                <Text
                                    fontSize={['xs', 'md', 'md']}
                                    fontWeight='semibold'
                                    color={colorMode}
                                    textDecoration='line-through'
                                >
                                    {'R$ ' +
                                        formatToCurrency(
                                            product.originalPrice / 100
                                        )}
                                </Text>
                            )}
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
                    mt='2'
                >
                    Adicionar
                </Button>
            </ModalContent>
        </Modal>
    );
};

export default function Products() {
    const { getProducts, categories } = useProductsQueryContext();

    const [products, setProducts] = useState<
        TawbacariaApp.ProductItem[] | null
    >(null);
    const [selectedProduct, setSelectedProduct] =
        useState<TawbacariaApp.ProductItem | null>(null);

    console.log(selectedProduct);

    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);

    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchMore = useCallback(() => {
        const options: QueryOptions = {
            offset,
            limit: PAGE_LIMIT,
        };
        if (selectedCategory === 'Destaque') options['highlight'] = true;
        else if (selectedCategory !== 'Todos')
            options['categoryExact'] = selectedCategory;
        if (searchQuery) options['searchQuery'] = searchQuery;
        const data = getProducts(options);
        setTotal(data.total);
        setOffset((old) => old + PAGE_LIMIT);
        setProducts((old) =>
            old == null ? [...data.items] : [...old, ...data.items]
        );
    }, [getProducts, offset, searchQuery, selectedCategory]);

    const prepareFetch = useCallback(() => {
        setTotal(0);
        setProducts(null);
        setOffset(0);
    }, []);

    useEffect(prepareFetch, [prepareFetch, selectedCategory, searchQuery]);
    useEffect(() => {
        if (products != null || offset !== 0) return;
        fetchMore();
    }, [fetchMore, offset, products]);

    return (
        <Container maxW='4xl'>
            <ProductDisplay
                isOpen={!!selectedProduct}
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
            <Box fontSize='3xl' as='h1' mb='4'>
                {selectedCategory}
            </Box>
            <FormControl display={['initial', 'initial', 'none']}>
                <FormLabel>Categoria</FormLabel>
                <Select
                    mb='2'
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {['Todos', 'Destaque', ...categories].map((c) => (
                        <option key={c}>{c}</option>
                    ))}
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel>Pesquisar</FormLabel>
                <Input
                    mb='2'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </FormControl>
            <Box display='flex' flexDirection='row' gap={8}>
                <Box minW={'160'} display={['none', 'none', 'initial']}>
                    <Box as='h2' fontSize='xl' fontWeight='semibold' mb={2}>
                        Categorias
                    </Box>
                    <Stack display='flex' flexDirection='column' gap={2}>
                        {['Todos', 'Destaque', ...categories].map((c) => (
                            <button
                                className='category-button'
                                key={c}
                                onClick={() => setSelectedCategory(c)}
                                style={{
                                    fontWeight:
                                        c === selectedCategory
                                            ? 'bold'
                                            : 'lighter',
                                }}
                            >
                                {c}
                            </button>
                        ))}
                    </Stack>
                </Box>
                <div
                    style={{
                        width: '100%',
                    }}
                >
                    <InfiniteScroll
                        dataLength={products?.length ?? 0}
                        hasMore={(products?.length ?? 0) < total}
                        next={fetchMore}
                        loader={null}
                        scrollThreshold={0.8}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            width: '100%',
                        }}
                    >
                        {products?.map((p) => (
                            <ProductCard
                                key={p.code + p.label}
                                product={p}
                                onSelect={(p) => setSelectedProduct(p)}
                            />
                        ))}
                    </InfiniteScroll>
                    <Box
                        display={
                            products === null || products.length < total
                                ? 'inherit'
                                : 'none'
                        }
                    >
                        <Spinner /> Carregando...
                    </Box>
                </div>
            </Box>
        </Container>
    );
}
