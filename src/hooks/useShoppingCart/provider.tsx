import { useEffect, useState } from 'react';
import { getSessionStorageObjectSafely } from '../../utils';
import ShoppingCartContext from './context';

const key = 'tawbacaria-app-cart';

const ShoppingCartProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const [cartItems, setCartItems] = useState<Cart>(() => {
        const items = getSessionStorageObjectSafely<Cart>(key);
        return items ?? {};
    });

    const addItem = (item: TawbacariaApp.ProductItem) => {
        console.log('Add item called');
        setCartItems((old) => {
            const foundItem = old[item.code];
            if (!foundItem) {
                return {
                    ...old,
                    [item.code]: { ...item, count: 1 },
                };
            }
            return {
                ...old,
                [item.code]: { ...foundItem, count: foundItem.count + 1 },
            };
        });
    };

    const removeItem = (item: TawbacariaApp.ProductItem | string) => {
        setCartItems((old) => {
            const code = typeof item === 'string' ? item : item.code;
            const foundItem = old[code];
            if (!foundItem) return old;
            const newCart = { 
                ...old,
                [code]: { ...foundItem, count: foundItem.count - 1 },
            };
            if (foundItem.count <= 1) delete newCart[code];
            return newCart;
        });
    };

    const clearItem = (item: TawbacariaApp.ProductItem | string) => {
        setCartItems((old) => {
            const code = typeof item === 'string' ? item : item.code;
            const foundItem = old[code];
            if (!foundItem) return old;
            const newCart = { ...old };
            delete newCart[code];
            return newCart;
        });
    };

    const clearCart = () => {
        setCartItems({});
    };

    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <ShoppingCartContext.Provider
            value={{
                items: cartItems,
                addItem,
                removeItem,
                clearItem,
                clearCart,
            }}
        >
            {children}
        </ShoppingCartContext.Provider>
    );
};

export default ShoppingCartProvider;
