/* eslint-disable @typescript-eslint/no-unused-vars */
namespace TawbacariaApp {
    type ItemJsonData = {
        code: string;
        label: string;
        in_stock: boolean;
        price: number;

        description?: string | null;
        is_highlight?: boolean | null;
        image_url?: string | null;
    };
    type ProductItem = ItemJsonData & {
        category: string;
    };
}


type AddressInfo = {
    address: string;
    number: string;
    district: string;
};