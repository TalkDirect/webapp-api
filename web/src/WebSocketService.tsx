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

    onMessage(callback:any) {
        if (this.socket == null) return;
        this.socket.onmessage = (Event) => {
            // If data is string just print it out on the console for now
            const data = Event.data
			if (typeof data === 'string') {
				if (data[0] === 'error:') {
					throw new Error('Error on the Frontend Side');
				} else {
					console.log(data);
				}
			} else {
				// If Data not string, treat it as a file containing data
				const filereader = new FileReader();
				filereader.onload = (Event) => {
					const buffer = Event.target!.result;
					if (typeof buffer === 'string' || buffer === null) return;
					console.log('Received Data');
                    callback(buffer);
				}
			}
        }
    }

    sendMessage(data:any) {
        if (this.socket == null) return;
        // Check to see if string
        if (typeof data === 'string') {
            this.socket.send(data);
            console.log('Sent String Message to Socket');
            return;
        }
        // Else, open up a fileReader to translate into an ArrayBuffer then send it over to the server
        const fileReader = new FileReader();
        const buffer = fileReader.result;
        if ( buffer && typeof buffer !== 'string' ) {
            this.socket.send(buffer);
        }
    }
}