import { useEffect, useState } from 'react';
import CurrentTimeContext from './context';
import { AbsoluteCenter, Box, Flex, Spinner } from '@chakra-ui/react';

const CurrentTimeProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const [date, setDate] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function getTimeApiIoDate() {
        try {
            const res = await fetch(
                'https://timeapi.io/api/time/current/zone?timeZone=America%2FSao_Paulo'
            );
            if (!res.ok) return null;
            const data = await res.json();
            const date = new Date(data.dateTime);
            return date;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async function getTimeDavidAyalasGithubApi() {
        try {
            const res = await fetch(
                'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLihq3L5kX9i8zr1qkgQQlQs7oC2sOM83cA9zrwgZ6sgoLBGi53VU4zZ5IpdvbDwHxeMgkpfDHuZRyPDzuGxExyjkLE70k4e-sBX-_ydMW_g3o7QPfZC3x2KpY2RCXPc2630h6qDFxVSDm-GbZSyhLmJcaxPciB8Ksm7LxyYuqLFdFyOZpmx_5Qw_cKpNxJbHA6N_YGPnwbi3DV0wpswKdmyIdzoJetjbRnjfwW86m75_H2QelL-hicONTBkkt6fu3kpBH17&lib=MwxUjRcLr2qLlnVOLh12wSNkqcO1Ikdrk'
            );
            if (!res.ok) return null;
            const data = await res.json();
            const nonBRDate = new Date(data.fulldate);
            // Subtract 3 hours (3 * 60 * 60 * 1000 milliseconds)
            const brazilDate = new Date(
                nonBRDate.getTime() - 3 * 60 * 60 * 1000
            );
            return brazilDate;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async function getCurrentDate() {
        const apisAttempt = [getTimeApiIoDate(), getTimeDavidAyalasGithubApi()];
        const results = await Promise.all(apisAttempt);
        console.log(results);

        let validResult: Date | null = results.find((date) => !!date) ?? null;
        if (!validResult) throw 'Erro ao consultar horário';
        return validResult;
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

    if (error)
        return (
            <Box h='100vh'>
                <AbsoluteCenter axis='both'>
                    <Flex direction='column'>
                        <span>Erro ao carregar o site</span>
                        <span>timeapi.io: {error}</span>
                    </Flex>
                </AbsoluteCenter>
            </Box>
        );
    if (!date)
        return (
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
