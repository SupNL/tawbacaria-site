import {
    Box,
    Container,
    FormControl,
    FormLabel,
    Input,
    Select,
    Spinner,
    Stack,
} from '@chakra-ui/react';
import ProductCard from '../../components/ProductCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import useProductsQueryContext from '../../hooks/useProductsQuery/';
import { useCallback, useEffect, useState } from 'react';

import './style.css';

const PAGE_LIMIT = 10;

export default function Products() {
    const { getProducts, categories } = useProductsQueryContext();

    const [products, setProducts] = useState<
        TawbacariaApp.ProductItem[] | null
    >(null);
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
                            <ProductCard key={p.code + p.label} product={p} />
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
