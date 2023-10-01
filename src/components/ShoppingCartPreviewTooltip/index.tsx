import { Container, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import useShoppingCart from '../../hooks/useShoppingCart';

const ShoppingCartPreviewTooltip = () => {
    const { items } = useShoppingCart();

    const backgroundColor = useColorModeValue('gray.100', 'gray.900');
    const textColor = useColorModeValue('gray.600', 'gray.400');

    const itemsArray = Object.values(items);
    const max = 8;
    const diff = itemsArray.length - max;

    return (
        <Container
            position='absolute'
            bottom='14'
            left='2'
            py='2'
            width='auto'
            borderRadius='8'
            background={backgroundColor}
        >
            <Flex direction='column' gap='4'>
                {itemsArray
                    .sort((item, prevItem) =>
                        item.label > prevItem.label
                            ? 1
                            : item.label < prevItem.label
                            ? -1
                            : 0
                    )
                    .slice(0, max)
                    .map((item) => (
                        <Text key={item.code} color={textColor}>
                            {item.label} x{item.count}
                        </Text>
                    ))}

                {diff > 0 && (
                    <Text color={textColor}>
                        ...mais {diff} {diff === 1 ? 'item' : 'itens'}
                    </Text>
                )}
            </Flex>
        </Container>
    );
};

export default ShoppingCartPreviewTooltip;
