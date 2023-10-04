import { useEffect, useState } from 'react';
import { getSessionStorageObjectSafely, isWithinDateRange } from '../../utils';
import ShoppingCartContext from './context';
import useProductsQueryContext from '../useProductsQuery';

const key = 'tawbacaria-app-cart';

type SessionStorageCart = {
    code: string;
    count: number;
}[];

const ShoppingCartProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const { getProduct } = useProductsQueryContext();

    const [cartItems, setCartItems] = useState<Cart>(() => {
        const items = getSessionStorageObjectSafely<SessionStorageCart>(key);
        if (!items) return {};
        const newCart: Cart = {};
        items.forEach((item) => {
            const product = getProduct(item.code);
            if (!product) return;
            newCart[item.code] = {
                ...product,
                count: item.count,
            };
        });
        return newCart;
    });

    const addItem = (item: TawbacariaApp.ProductItem) => {
        setCartItems((old) => {
            const foundItem = old[item.code];
            if (!foundItem) {
                return {
                    ...old,
                    [item.code]: { ...item, count: 1 },
                };
            }
            if (foundItem.count >= 999) return old;
            return {
                ...old,
                [item.code]: {
                    ...foundItem,
                    count: foundItem.count + 1,
                },
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

    const setCount = (
        item: TawbacariaApp.ProductItem | string,
        count: number
    ) => {
        setCartItems((old) => {
            const code = typeof item === 'string' ? item : item.code;
            const foundItem = old[code];
            if (!foundItem) return old;
            return {
                ...old,
                [code]: { ...foundItem, count },
            };
        });
    };

    function isCartInSync(date: Date) {
        let isOk = true;
        const newCart: Cart = {};
        Object.entries(cartItems).forEach(([key, item]) => {
            if (
                item.availability_period &&
                !isWithinDateRange(date, item.availability_period)
            )
                isOk = false;
            else newCart[key] = { ...item };

            if (
                item.discount &&
                !isWithinDateRange(date, item.discount.period) &&
                item.originalPrice
            ) {
                isOk = false;
            }
            setCartItems(newCart);
        });
        if (!isOk)
            sessionStorage.setItem(
                key,
                JSON.stringify(
                    Object.values(newCart).map((item) => ({
                        code: item.code,
                        count: item.count,
                    }))
                )
            );
        return isOk;
    }

    const clearCart = () => {
        setCartItems({});
    };

    useEffect(() => {
        sessionStorage.setItem(
            key,
            JSON.stringify(
                Object.values(cartItems).map((item) => ({
                    code: item.code,
                    count: item.count,
                }))
            )
        );
    }, [cartItems]);

    return (
        <ShoppingCartContext.Provider
            value={{
                items: cartItems,
                addItem,
                removeItem,
                clearItem,
                clearCart,
                setCount,
                isCartInSync,
            }}
        >
            {children}
        </ShoppingCartContext.Provider>
    );
};

export default ShoppingCartProvider;
