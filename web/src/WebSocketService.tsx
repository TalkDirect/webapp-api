import { useEffect, useRef, useState } from "react";
/*

FEEL FREE TO DELETE THIS IF UNNEEDED

export const useSocket = () => {

    const socket: WebSocket | null = null; //useRef<WebSocket | null>(null);
    //const [Data, setData] = useState<any[]>([]);

    function createSocket(socketUrl:string) {
        if (socket !== null) return; //guard clause
        socket = new WebSocket(socketUrl);
    }

    function closeSocket() {
        if (socket == null) return; //guard clause
        socket.close()
    }

    function onConnection() {
        if (socket == null) return; //guard clause
        socket.onopen = (Event) => {
            console.log(Event.target);
        }
    }

    function onMessage() {
        if (socket == null) return; //guard clause
        socket.onmessage = (Event) => {
            setData(m => [...m, Event.data]);
        }
    }

    
    useEffect(() => {
        onConnection();
        onMessage();

        return () => socket.close();
    }, []);

    return Data;
}*/

export class useSocket {

    socket: Websocket | null = null;

    createSocket(socketUrl:string) {
        if (this.socket !== null) return;
        this.socket = new WebSocket(socketUrl);
    }

    closeSocket() {
        if (this.socket == null) return;
        this.socket.close()
    }

    onConnection() {
        if (this.socket == null) return;
        this.socket.onopen = (Event) => {
            console.log(Event.target);
        }
    }

    onMessage(callback) {
        if (this.socket == null) return;
        this.socket.onmessage = (Event) => {
            console.log("gotmessage")
            callback(Event)
        }
    }

}