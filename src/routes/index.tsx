import {
    createHashRouter,
    Outlet,
    RouterProvider,
    useLocation,
} from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Navbar from '../components/Navbar';
import Products from '../pages/Products';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import ShoppingCartDrawer from '../components/ShoppingCartDrawer';
import Cart from '../pages/Cart';
import Contact from '../pages/Contact';
import ViewProduct from '../pages/ViewProduct';
import useCurrentTimeContext from '../hooks/useCurrentTime';
import PlusEighteenModal from '../components/PlusEighteenModal';

const WrapperTemplate = () => {
    const location = useLocation();
    const { isAvailable, loading, error } = useCurrentTimeContext();

    return (
        <>
            {/* <PlusEighteenModal /> */}
            <Navbar />
            <Box pt='8' pb='16'>
                <ErrorBoundary
                    key={location.pathname}
                    fallbackRender={({ error }) => {
                        return (
                            <Box px='8'>
                                <p>Erro inesperado na aplicação:</p>
                                <pre style={{ color: 'red' }}>
                                    {error.message}
                                </pre>
                            </Box>
                        );
                    }}
                >
                    {!loading ? (
                        error ? (
                            <Text
                                textAlign='center'
                                color='red.300'
                                fontWeight='bold'
                            >
                                Ocorreu um erro inesperado
                            </Text>
                        ) : (
                            <>
                                {!isAvailable && (
                                    <Text
                                        textAlign='center'
                                        color='red.300'
                                        fontWeight='bold'
                                    >
                                        Loja fechada! Horário de atendimento:
                                        11:00 - 22:00
                                    </Text>
                                )}
                                <Outlet />
                            </>
                        )
                    ) : (
                        <Flex justifyContent='center' gap='2'>
                            <Text>Carregando...</Text>
                            <Spinner />
                        </Flex>
                    )}
                </ErrorBoundary>
            </Box>
            <ShoppingCartDrawer />
        </>
    );
};

const router = createHashRouter(
    [
        {
            path: '/',
            element: <WrapperTemplate />,
            children: [
                {
                    index: true,
                    element: <Home />,
                },
                {
                    path: 'contato',
                    element: <Contact />,
                },
                {
                    path: 'produtos',
                    element: <Products />,
                },
                {
                    path: 'carrinho',
                    element: <Cart />,
                },
                {
                    path: 'produto/:code',
                    element: <ViewProduct />,
                },
                {
                    path: '*',
                    element: <NotFound />,
                },
            ],
        },
    ],
    {}
);

function Routes() {
    return <RouterProvider router={router} />;
}

export default Routes;
