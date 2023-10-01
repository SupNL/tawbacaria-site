import productsData from '../../assets/products.json';
import { normalizeString } from '../../utils';
import ProductsQueryContext from './context';

const normalizedItems: TawbacariaApp.ProductItem[] = [];
const categories: string[] = [];

Object.entries(productsData).forEach(([key, value]) => {
    categories.push(key);
    value
        .filter(item => item.in_stock)
        .sort((item, prevItem) =>
            item.label > prevItem.label
                ? 1
                : item.label < prevItem.label
                ? -1
                : 0
        )
        .forEach((item) =>
            normalizedItems.push({
                ...item,
                category: key,
            })
        );
});

const ProductsQueryProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const getProducts = (query?: QueryOptions) => {
        let filteredProducts = [...normalizedItems];
        if (query?.categoryExact)
            filteredProducts = filteredProducts.filter(
                (item) => item.category === query.categoryExact
            );
        if (query?.highlight)
            filteredProducts = filteredProducts.filter(
                (item) => item.is_highlight
            );
        if (query?.searchQuery) {
            const search = query.searchQuery.toLowerCase();
            filteredProducts = filteredProducts.filter((item) => {
                if (normalizeString(item.label).includes(search)) return true;
                if (normalizeString(item.category).includes(search))
                    return true;
                if (
                    item.description &&
                    normalizeString(item.description).includes(search)
                )
                    return true;
                if (normalizeString(item.code).includes(search)) return true;
                return false;
            });
        }

        const limit = query?.limit ?? 10;
        const offset = query?.offset ?? 0;
        const total = filteredProducts.length;

        filteredProducts = filteredProducts.slice(offset, offset + limit);
        return {
            items: filteredProducts,
            total,
        };
    };

    const getProduct = (productCode: string) => {
        return normalizedItems.find((i) => i.code === productCode) ?? null;
    };

    return (
        <ProductsQueryContext.Provider
            value={{
                getProducts,
                getProduct,
                categories,
            }}
        >
            {children}
        </ProductsQueryContext.Provider>
    );
};

export default ProductsQueryProvider;
