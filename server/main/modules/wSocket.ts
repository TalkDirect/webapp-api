import { RawData } from "ws";

export interface wSocket {

    // Fields
    SocketData: RawData;
    // Type of Data being trasmitted
    DataType: string;
    // Denotes Socket's state
    ReadyState: number;
    // Denotes if Socket is transmitting or not
    SocketTransmitting: number;

    // Public Methods
    getSocketData(): RawData;
    setEvent(): Event; 
    dismissEvent(): string;
    disconnect(): void;

    // Private Methods
    
    sendData(): RawData;
    recieveData(): RawData;
    // Called whenever disconnect() is called
    dumpData(): RawData & string;

    inspectConnection(): JSON;
}