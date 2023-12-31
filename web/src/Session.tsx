import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import './Session.css'
import { useParams } from 'react-router-dom'
import { useCookie } from './cookie';
import { useSocket } from './WebSocketService';
//import WebSocket from 'ws';

// Attempt to grab the session media from the host/api
interface FetchSessionResponse {
    host: string | undefined;
    clients: Array<any> | undefined;
    errorCode: string | undefined;
}

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

var isFetchingSession = false;
var hasFetchedSession = false;
var sessionSocket = new useSocket();
const HostData:any[] = [];


//FetchSession functionality
async function FetchSession(sessionid: string): Promise<FetchSessionResponse> {

    try {
        // Attempt to register the current user as a client on the session
        const response = await fetch(`http://localhost:9999/api/join/${sessionid}`, {
            method: 'GET',
        });

        const data = await response.json(); // Get json response from api endpoint

        if (!data) {
            throw new Error("JSON endpoint response not found.");
        }

        // Return response data w/ FetchSessionResponse
        return {host: data.host, clients: data.clients, errorCode: undefined}

    } catch (error) {
        return {host: undefined, clients: undefined, errorCode: '0'} // skill issue
    }

}

function Session() {
    // Grab the current session of the User
    const {sessionid} = useParams();

    // Determine whether or not the current User is the Host, if Host do not play video, instead display an error where video would be
    const [Host, setHost] = useState<string>();

    // Grab all the current clients connected to the host
    const [Clients, setClients] = useState<any[]>();

    // Grab the websocket url from cookies
    const [WebsocketUrl, setWebsocketUrl] = useCookie('Websocket-url', '');

    // Signifies a Valid Websocket Connection
    const [Connection, setConnection] = useState<boolean>(false);

    // Signifies that data has been sent
    const [recievedData, setRecievedData] = useState<boolean>(false);

    // Used to exclaim an error has occured
    const [error, seterror] = useState(false);

    // Used to display the error message
    const [ErrorMsg, setErrorMsg] = useState<string>();

    // Handle Errors
    async function HandleError(errorType: string) {
        seterror(true);

        switch (errorType) {
            case '0':
                setErrorMsg("Error in Attempt to find Session.");
                break;
        
            case '1':
                setErrorMsg("Error in Attempt to fetch Websocket.")
                break;
            default:
                setErrorMsg("Default unaccounted Error, please notify owners.");
                break;
        }
    }
    // Helper Function
    /*const HandleSocketData = async () => {
        if (recievedData == false || Connection == false || hasFetchedSession == false) return;
        setRecievedData(false);
        do {
            setProcessedData(processedData => [...processedData, HostData.pop()?.data]);
        } while(!HostData.isEmpty)
        console.log(processedData)
    }*/

    function ActivateSessionSocket(url: string) {
        //Create and hook onMessage with simple print statement
        sessionSocket.createSocket(url);
        sessionSocket.onMessage(async (data:any) => {
        // If our data is a string for now just print on console
        if (typeof data === "string") {
            console.log(data);
            setRecievedData(true);
            return;
        }
        // Else our data must be rawdata for now just push to HostData array
        
        HostData.push(data);
        setRecievedData(true);
        });
    }

    // Attempt to grab the session media from the host/api

    const FetchSessionState = async () => {
        if (isFetchingSession == true || hasFetchedSession == true || sessionid == undefined) return; //guard clause - only fetch session if we are not fetching a session and we arent currently in a valid session

        isFetchingSession = true; // make sure we cant fetch another session

        var fsr: FetchSessionResponse = await FetchSession(sessionid);
        isFetchingSession = false; // finished fetching, we are open to fetching another session if needed
        if (fsr.errorCode !== undefined) {
            HandleError(fsr.errorCode);
            return; //guard clause
        }

        hasFetchedSession = true; // we have valid session information, disable any future fetches
        setHost(fsr.host);
        setClients(fsr.clients);
        setConnection(true);
        ActivateSessionSocket(WebsocketUrl);
    }

    // Attempt to grab input if window is focused, then send it off to the host/api server
    const onKbdChange = async (Event: KeyboardEvent, EventType:string) => {
        if (sessionid == undefined || Connection == false) return;

        let bufferArray:Buffer[] = [];
        let buffer: Buffer | Buffer[] = [];
        let dataType: Buffer;

        switch (EventType) {
            case 'KEYUP':
                buffer = Buffer.alloc(1, Event.key);
                dataType = Buffer.alloc(1, DataIdentifier.INKBDUP);
                bufferArray = [dataType, buffer];
                break;
            case 'KEYDWN':
                buffer = Buffer.alloc(1, Event.key);
                dataType = Buffer.alloc(1, DataIdentifier.INKBDDOWN);
                bufferArray = [dataType, buffer];
                break;
            default:
                break;
        }
        sessionSocket.sendMessage(bufferArray);
    }

    // Attempt to grab input if window is focused, then send it off to the host/api server
    const onMseChange = async (Event: MouseEvent, EventType:string) => {
        if (sessionid == undefined || Connection == false) return;

        let bufferArray:Buffer[] = [];
        let buffer: Buffer | Buffer[] = [];
        let dataType: Buffer;

        switch (EventType) {
            case 'INMSEUP':
                dataType = Buffer.alloc(1, DataIdentifier.INMSEUP);
                buffer = Buffer.alloc(1, Event.buttons);
                bufferArray = [dataType, buffer];
                break;
            case 'INMSEDOWN':
                dataType = Buffer.alloc(1, DataIdentifier.INMSEDOWN);
                buffer = Buffer.alloc(1, Event.buttons);
                bufferArray = [dataType, buffer];
                break;
            case 'INMSEMOVE':
                dataType = Buffer.alloc(1, DataIdentifier.INMSEMOVE);
                buffer[0] = Buffer.alloc(4, Event.screenX);
                buffer[1] = Buffer.alloc(4, Event.screenY);
                bufferArray = [dataType, buffer[0], buffer[1]];
                break;
            default:
                break;
        }
        sessionSocket.sendMessage(bufferArray);
    }

    // Where we'll start to load up video and any other important details when page is first loaded
    useEffect(() => {
        FetchSessionState();
    },[])

    let dataList = HostData.map(data =>
        <li>{data}</li>)

    return (
    <>
        <div className='Capture-Div'
            onKeyDown={e => onKbdChange(e, 'KEYDWN')}
            onKeyUp={e => onKbdChange(e, 'KEYUP')}
            onMouseDown={e => onMseChange(e, 'INMSEDWN')}
            onMouseUp={e => onMseChange(e, 'INMSEUP')}
            onMouseMove={e => onMseChange(e, 'INMSEUP')}
            >
            {
                error ? <p>{ErrorMsg}</p> :
                <ul>{dataList}</ul>
            }

        </div>
    </>
    )
}

export default Session
