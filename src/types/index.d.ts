/* eslint-disable @typescript-eslint/no-unused-vars */
namespace TawbacariaApp {
    type ItemJsonData = {
        code: string;
        label: string;
        in_stock: boolean;
        price?: number;

        description?: string | null;
        is_highlight?: boolean | null;
        image_url?: string | null;

        // only available through a limited time
        availability_period?: StringDateRange;
        discount?: {
            discount: number;
            period: StringDateRange;
        };
    };
    type CategoryJsonData = {
        price?: number;
        availability_period?: StringDateRange;
        discount?: {
            discount: number;
            period: StringDateRange;
        };
    }
    type ProductItem = Omit<
        ItemJsonData,
        'availability_period' | 'discount' | 'price'
    > & {
        price : number;
        category: string;
        availability_period?: DateRange;
        discount?: {
            discount: number;
            period: DateRange;
        };
        originalPrice?: number;
    };
}

type DateRange = {
    start: Date;
    end: Date;
};

type StringDateRange = {
    start: string;
    end: string;
};

type AddressInfo = {
    address: string;
    number: string;
    district: string;
};
