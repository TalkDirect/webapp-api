enum DataIdentifier {
	VIDEO = 0,
	AUDIO = 1,
	STRING = 2,
	ERROR = 3,
    INMSEUP = 4,
    INMSEDOWN = 5,
    INMSEMOVE = 6,
    INKBDUP = 7,
    INKBDDOWN = 8,
};

export class useSocket {

    socket: WebSocket | null = null;

    createSocket(socketUrl:string) {
        if (this.socket !== null) return;
        this.socket = new WebSocket(socketUrl);
        this.socket.binaryType = "arraybuffer";
    }

    closeSocket() {
        if (this.socket == null) return;
        this.socket.close();
    }

    onConnection() {
        if (this.socket == null) return;
        this.socket.onopen = (Event) => {
            console.log(Event.target);
        }
    }
    // When clientsocket recieves a message preform this function
    onMessage(callback:any) {
        if (this.socket == null) return;

        this.socket.onmessage = (Event) => {
            // Get the websocket's message and throw it into a 8bit array to be compared/used
            console.log('Frontend Webapp Recieved Message');
            const socketBuffer = new Uint8Array(Event.data);
            const dataID = socketBuffer[0];

            if (dataID == DataIdentifier.STRING || dataID == DataIdentifier.ERROR) {
                // Decode from 3rd byte onwards b/c first two bytes are headerbytes & just describe sent data
                const stringMessage = new TextDecoder().decode(socketBuffer.subarray(1));
                callback(stringMessage);
                return;
            }
            // If it's not a string, scale up the 8bit array to an 32bit array
            const VideoBuffer:Uint32Array = new Uint32Array(socketBuffer);
            // Else set callback for now to be more rawdata and let it be handled on React page
            callback(VideoBuffer);
        }
    }
    sendMessage(data:Buffer) {
        // First byte of data will ALWAYS be Data Identifier
        if (this.socket == null) return;
        const DataID = data.at(0);

        // If we're planning on sending over a string put it into a byte array; else throw it into a int array (32 bit array)
        if (DataID == DataIdentifier.STRING || DataID == DataIdentifier.ERROR) {
            this.socket.send(new Uint8Array(data));
            console.log("Webapp Sending Message to API");
            return;
        }
        const bufferArray = new Uint32Array(data);

        this.socket.send(bufferArray);
    }
}