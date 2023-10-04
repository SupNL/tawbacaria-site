import { useState } from 'react';
import productsData from '../../assets/products.json';
import { isWithinDateRange, normalizeString } from '../../utils';
import useCurrentTimeContext from '../useCurrentTime';
import ProductsQueryContext from './context';

const normalizedItems: TawbacariaApp.ProductItem[] = [];
const categories: string[] = [];

function instantiateDateWithTimezone(
    strDate: string,
    itemMeta: TawbacariaApp.ItemJsonData
) {
    if (!strDate.endsWith('-03:00')) {
        strDate += '-03:00';
    }
    const date = new Date(strDate);
    if (isNaN(date.getTime()))
        throw new Error('Invalid date for ' + itemMeta.label);
    return date;
}

function parseProduct(
    item: TawbacariaApp.ItemJsonData,
    category: string
): TawbacariaApp.ProductItem {
    const data: TawbacariaApp.ProductItem = {
        ...item,
        category,
        availability_period: undefined,
        discount: undefined,
    };
    if (item.availability_period)
        data['availability_period'] = {
            start: instantiateDateWithTimezone(
                item.availability_period.start,
                item
            ),
            end: instantiateDateWithTimezone(
                item.availability_period.end,
                item
            ),
        };
    if (item.discount)
        data['discount'] = {
            discount: item.discount.discount,
            period: {
                start: instantiateDateWithTimezone(
                    item.discount.period.start,
                    item
                ),
                end: instantiateDateWithTimezone(
                    item.discount.period.end,
                    item
                ),
            },
        };
    return data;
}

Object.entries(productsData).forEach(([key, value]) => {
    categories.push(key);
    value
        .filter((item) => item.in_stock)
        .sort((item, prevItem) =>
            item.label > prevItem.label
                ? 1
                : item.label < prevItem.label
                ? -1
                : 0
        )
        .map((item) => normalizedItems.push(parseProduct(item, key)));
});

const ProductsQueryProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const { date } = useCurrentTimeContext();

    const [products] = useState(() => {
        return normalizedItems
            .filter((i) => {
                if (
                    i.availability_period &&
                    !isWithinDateRange(date, i.availability_period)
                )
                    return false;
                return true;
            })
            .map((i) => {
                if (i.discount && isWithinDateRange(date, i.discount.period)) {
                    const newItem = { ...i };
                    newItem.originalPrice = newItem.price;
                    newItem.price = newItem.price - i.discount.discount;
                    return newItem;
                }
                return i;
            });
    });

    const getProducts = (query?: QueryOptions) => {
        let filteredProducts = [...products];
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
        return products.find((i) => i.code === productCode) ?? null;
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
