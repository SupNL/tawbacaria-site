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
import { Box, Text } from '@chakra-ui/react';
import ShoppingCartDrawer from '../components/ShoppingCartDrawer';
import Cart from '../pages/Cart';
import Contact from '../pages/Contact';
import useCurrentTimeContext from '../hooks/useCurrentTime';
import PlusEighteenModal from '../components/PlusEighteenModal';
import { isInWorkingTime } from '../utils';
import Finalize from '../pages/Finalize';

const WrapperTemplate = () => {
    const location = useLocation();
    const { date } = useCurrentTimeContext();
    const isShopOpen = isInWorkingTime(date);

    return (
        <>
            <PlusEighteenModal />
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
                    <>
                        {!isShopOpen && (
                            <Text
                                textAlign='center'
                                color='red.300'
                                fontWeight='bold'
                            >
                                Loja fechada! Horário de atendimento: 11:00 -
                                22:00
                            </Text>
                        )}
                        <Outlet />
                    </>
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
                    path: 'finalizar',
                    element: <Finalize />,
                },
                // {
                //     path: 'produto/:code',
                //     element: <ViewProduct />,
                // },
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
