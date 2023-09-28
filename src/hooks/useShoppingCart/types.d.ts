type CartItem = {
    count: number;
} & TawbacariaApp.ProductItem;

type Cart = {
    [key: string]: CartItem;
};

type ShoppingCartContextProps = {
    items: Cart;
    addItem: (item: TawbacariaApp.ProductItem) => void;
    removeItem: (item: TawbacariaApp.ProductItem | string) => void;
    clearItem: (item: TawbacariaApp.ProductItem | string) => void;
    setCount: (item: TawbacariaApp.ProductItem | string, count : number) => void;
    clearCart: () => void;
};