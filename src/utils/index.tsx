import { latinCharacters } from './latin';

const formatter = new Intl.NumberFormat('pt-br', {
    style: 'currency',
    currency: 'BRL',
});

export function getLocalStorageObjectSafely<T>(key: string) {
    try {
        const value = localStorage.getItem(key);
        if (value == null) return null;
        const item = JSON.parse(value) as T;
        return item;
    } catch {
        localStorage.removeItem(key);
    }
    return null;
}

export function getSessionStorageObjectSafely<T>(key: string) {
    try {
        const value = sessionStorage.getItem(key);
        if (value == null) return null;
        const item = JSON.parse(value) as T;
        return item;
    } catch {
        sessionStorage.removeItem(key);
    }
    return null;
}

export function formatToCurrency(value: number) {
    return formatter.format(value).slice(3);
}

export function parseCurrency(value: string) {
    return value.replace('.', '').replace(',', '').replace('R$', '').trim();
}

export function buildAndEncodeMessage({
    name,
    paymentMethod,
    fullAddress,
    deliveryFee,
    totalPrice,
    shoppingCart,
    changeValue,
}: {
    name: string;
    paymentMethod: string;
    totalPrice: number;
    shoppingCart: Cart;
    fullAddress?: string | null;
    deliveryFee?: number | null;
    changeValue?: number | null;
}) {
    const message = `*Pedido Tawbacaria*
-----------------------------
*Informações*
*Nome*: ${name}
*Forma de pagamento*: ${paymentMethod}${
        fullAddress ? `\n*Endereço*: ${fullAddress}` : '\n*RETIRADA NO LOCAL*'
    }${
        deliveryFee
            ? `\nFrete: R$ ${formatToCurrency((deliveryFee ?? 0) / 100)}`
            : ''
    }
-----------------------------
*Produtos*
${Object.values(shoppingCart).map(
    (item) =>
        `${item.label} x${item.count}, total R$ ${formatToCurrency(
            (item.price * item.count) / 100
        )}\n`
)}-----------------------------
TOTAL DO PEDIDO: R$ *${formatToCurrency(totalPrice / 100)}*${
        changeValue
            ? `\n\nTroco para R$ ${formatToCurrency(
                  changeValue / 100
              )} (R$ ${formatToCurrency((changeValue - totalPrice) / 100)})`
            : ''
    }`;
    const encodedMessage = encodeURI(message);
    return encodedMessage;
}

function latinize(value: string) {
    return value.replace(/[^A-Za-z0-9[\] ]/g, function (a) {
        return latinCharacters[a] || a;
    });
}

export function normalizeString(value: string) {
    const lowerCase = value.toLowerCase();
    const latinizedString = latinize(lowerCase);
    const normalized = latinizedString.normalize();
    return normalized;
}
