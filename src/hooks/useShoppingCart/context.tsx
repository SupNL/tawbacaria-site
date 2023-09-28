import { createContext } from 'react';

const ShoppingCartContext = createContext<ShoppingCartContextProps | null>(
    null
);

export default ShoppingCartContext;
