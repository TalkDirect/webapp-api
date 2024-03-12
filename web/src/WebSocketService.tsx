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
            console.log('recievedmessage');
            // Retrieve the raw data & decode the data identifier
            const buffer:Uint32Array = Event.data;
            const dataID = buffer[0];
            // We might need to decode this
            // Just set the callback to a string if identifier says string or error
            if (dataID === DataIdentifier.STRING || dataID === DataIdentifier.ERROR) {
                const stringMessage = new TextDecoder().decode(buffer.subarray(1));
                callback(stringMessage);
                return;
            }
            // Else set callback for now to be more rawdata and let it be handled on React page
            //const dataMessage = buffer.subarray(1);
            callback(buffer);
        }
    }
    // Will have to be remade so that every 32 bits in buffer is made into it's own element for video
    sendMessage(data:Buffer) {
        // First byte of data will ALWAYS be Data Identifier
        if (this.socket == null) return;
        const bufferArray = new Uint32Array(data);

        console.log(bufferArray);
        this.socket.send(bufferArray);
    }
}