import { useEffect, useState } from 'react';
import CurrentTimeContext from './context';

const CurrentTimeProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://worldtimeapi.org/api/timezone/America/Sao_Paulo')
            .then((res) => {
                if (res.ok) return res.json();
                throw Error('Erro ao consultar horário');
            })
            .then((data: { utc_datetime: string }) => {
                const date = new Date(data.utc_datetime);
                const hours = date.getHours();
                setIsAvailable(hours >= 17 && hours < 22);
            })
            .catch((err) => {
                if (typeof err === 'string') setError(err);
                else if (err instanceof Error) setError(err.message);
                else setError('Erro inesperado ao consultar');
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <CurrentTimeContext.Provider
            value={{
                isAvailable,
                error,
                loading,
            }}
        >
            {children}
        </CurrentTimeContext.Provider>
    );
};

export default CurrentTimeProvider;
