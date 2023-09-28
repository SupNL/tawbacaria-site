import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerOverlay,
    Flex,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import ShoppingCartPreviewTooltip from '../ShoppingCartPreviewTooltip';
import { useState } from 'react';
import useShoppingCart from '../../hooks/useShoppingCart';
import { Link } from 'react-router-dom';

const ShoppingCartDrawer = () => {
    const { items, clearCart } = useShoppingCart();

    const count = Object.values(items).reduce(
        (prev, curr) => prev + curr.count,
        0
    );
    const backgroundColor = useColorModeValue('gray.100', 'gray.900');

    const [tooltipVisible, setTooltipVisible] = useState(false);

    return (
        <Drawer
            isOpen={Object.keys(items).length > 0}
            placement='bottom'
            onClose={() => {}}
            trapFocus={false}
            variant='clickThrough'
            blockScrollOnMount={false}
        >
            <DrawerOverlay overflow='scroll' />
            <DrawerContent backgroundColor={backgroundColor}>
                <DrawerBody>
                    {tooltipVisible && <ShoppingCartPreviewTooltip />}
                    <Flex align='center' justifyContent='space-between'>
                        <Text
                            onClick={() => setTooltipVisible(true)}
                            onMouseLeave={() => setTooltipVisible(false)}
                            onBlur={() => setTooltipVisible(false)}
                            onPointerEnter={() => setTooltipVisible(true)}
                            onPointerLeave={() => setTooltipVisible(false)}
                            _hover={{
                                cursor: 'pointer',
                            }}
                            size='2xs'
                        >
                            {count} {count === 1 ? 'item' : 'itens'}
                        </Text>

                        <Flex gap='2'>
                            <Link to='carrinho'>
                                <Button
                                    backgroundColor='purple.300'
                                    color='black'
                                    _hover={{
                                        textDecoration: 'none',
                                        bg: 'purple.400',
                                    }}
                                    size='sm'
                                >
                                    Carrinho
                                </Button>
                            </Link>
                            <Button size='sm' onClick={clearCart}>
                                Limpar
                            </Button>
                        </Flex>
                    </Flex>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default ShoppingCartDrawer;
