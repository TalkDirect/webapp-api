import { useEffect, useRef, useState } from "react";

export const useSocket = (socketUrl:string) => {

    const socket = useRef<WebSocket | null>(null);
    const [Data, setData] = useState<any[]>([]);

    function onConnection() {
        socket.current = new WebSocket(socketUrl);

        socket.current.onopen = (Event) => {
            console.log(Event.target);
        }
    }

    function onMessage() {
        socket.current!.onmessage = (Event) => {
            setData(m => [...m, Event.data]);
        }
    }

    useEffect(() => {
        onConnection();
        onMessage();

        return () => socket.current!.close();
    }, []);

    return Data;
}