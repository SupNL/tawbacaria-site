type QueryOptions = {
    limit?: number;
    offset?: number;
    categoryExact?: string;
    highlight?: boolean;
    searchQuery?: string;
};

type ProductsQueryProps = {
    getProducts: (query?: QueryOptions) => {
        items: TawbacariaApp.ProductItem[];
        total: number;
    };
    getProduct: (code: string) => TawbacariaApp.ProductItem | null;
    categories: string[];
};
