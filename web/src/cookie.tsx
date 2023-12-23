import {useEffect, useState} from 'react';

// Basically this uses built in cookies to save it to the browers cookies. Mainly used for websocketUrl for now
export function useCookie(key:string, initial:string) : [string, (value: string) => any] {
    const [value, setValue] = useState(
        document.cookie.split('; ').find(row => row.startsWith(`${key}=`))?.split('=')[1] ?? initial
    );

    function setCookie(value:string) {
        document.cookie = `${key}=${value}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=Lax;`;
    }

    useEffect(() => {
        setCookie(value);
    }, [value, key]);

    return [
        value,
        value => {
            setCookie(value);
            setValue(value);
        },
    ];
}