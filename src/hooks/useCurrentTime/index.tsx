import { useContext } from 'react';
import CurrentTimeContext from './context';

const useCurrentTimeContext = () => {
    const contextValue = useContext(CurrentTimeContext);
    if (contextValue === null)
        throw new Error(
            'CurrentTimeContext must be used inside a CurrentTimeContext.Provider'
        );
    return contextValue;
};

export default useCurrentTimeContext;
