import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import ProductsQueryProvider from './hooks/useProductsQuery/provider';
import ShoppingCartProvider from './hooks/useShoppingCart/provider.tsx';

const components = {
    // Drawer variant to allow pointer events to the underlying content
    Drawer: {
        variants: {
            clickThrough: {
                overlay: {
                    pointerEvents: 'none',
                    background: 'transparent',
                },
                dialogContainer: {
                    pointerEvents: 'none',
                    background: 'transparent',
                },
                dialog: {
                    pointerEvents: 'auto',
                },
            },
        },
    },
};
const colors = {
    purple: {
        100: '#FFF7FE',
        900: '#220E25',
    },
};
const styles = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global: (props: any) => ({
        body: {
            bg: mode('purple.100', 'purple.900')(props),
        },
    }),
};
const config = {
    initialColorMode: 'system',
    useSystemColorMode: true,
}


export const theme = extendTheme({
    components,
    styles,
    colors,
    config,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <ProductsQueryProvider>
                <ShoppingCartProvider>
                    <App />
                </ShoppingCartProvider>
            </ProductsQueryProvider>
        </ChakraProvider>
    </React.StrictMode>
);
