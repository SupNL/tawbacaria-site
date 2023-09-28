import { useContext } from 'react';
import ShoppingCartContext from './context';

const useShoppingCart = () => {
    const contextValue = useContext(ShoppingCartContext);
    if (contextValue === null)
        throw new Error(
            'ShoppingCartContext must be used inside a ShoppingCartContext.Provider'
        );
    return contextValue;
};

export default useShoppingCart;
