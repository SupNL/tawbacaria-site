import { useEffect, useState } from 'react';
import CurrentTimeContext from './context';
import { AbsoluteCenter, Box, Flex, Spinner } from '@chakra-ui/react';

const CurrentTimeProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const [date, setDate] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function getCurrentDate() {
        const res = await fetch(
            'https://timeapi.io/api/time/current/zone?timeZone=America%2FSao_Paulo'
        );
        if (!res.ok) throw 'Erro ao consultar horário';
        const data = await res.json();
        const date = new Date(data.dateTime);
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
    if (!date) return (
        <Box h='100vh'>
            <AbsoluteCenter axis='both'>
                <Flex gap='8px'>
                    <Spinner />
                    <h1>Carregando, aguarde!</h1>
                </Flex>
            </AbsoluteCenter>
        </Box>
    );

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
