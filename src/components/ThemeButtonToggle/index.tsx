import { IconButton, useColorMode } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

function ThemeButtonToggle() {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <header>
            <IconButton
                aria-label='Mudar tema'
                onClick={toggleColorMode}
                icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            />
        </header>
    );
}

export default ThemeButtonToggle;
