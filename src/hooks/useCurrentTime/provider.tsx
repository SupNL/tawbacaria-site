import { useEffect, useState } from 'react';
import CurrentTimeContext from './context';

const CurrentTimeProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const [date, setDate] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function getCurrentDate() {
        const res = await fetch(
            'https://worldtimeapi.org/api/timezone/America/Sao_Paulo'
        );
        if (!res.ok) throw 'Erro ao consultar horário';
        const data = await res.json();
        const date = new Date(data.utc_datetime);
        return date;
    }

    useEffect(() => {
        getCurrentDate()
            .then((date) => {
                setDate(date);
            })
            .catch((err) => {
                if (typeof err === 'string') setError(err);
                else if (err instanceof Error) setError(err.message);
                else setError('Erro inesperado ao consultar');
            });
    }, []);

    if (error) return <>{error}</>;
    if (!date) return <></>;

    return (
        <CurrentTimeContext.Provider
            value={{
                date,
                getCurrentDate,
            }}
        >
            {children}
        </CurrentTimeContext.Provider>
    );
};

export default CurrentTimeProvider;
