import { useContext } from 'react';
import ProductsQueryContext from './context';

const useProductsQueryContext = () => {
    const contextValue = useContext(ProductsQueryContext);
    if (contextValue === null)
        throw new Error(
            'ProductsQueryContext must be used inside a ProductsQueryContext.Provider'
        );
    return contextValue;
};

export default useProductsQueryContext;
