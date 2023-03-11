import {extendTheme, type ThemeConfig} from '@chakra-ui/react'

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: true
};

export const gradationColor = {
    styles: {
        global: {
            body: {},
            html: {
                height: '100%'
            }
        }
    }
};

export const theme = extendTheme({
    config
});
