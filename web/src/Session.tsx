import { MouseEvent, useEffect, useState, useRef } from 'react'
import { Buffer } from 'buffer';
import Chat from './Chat.tsx'
import './Chat.css'
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

interface Message {
    id: string,
    message: string,
    time: string
}

enum DataIdentifier {
	VIDEO = 0,
	AUDIO = 1,
	STRING = 2,
	ERROR = 3,
};

var isFetchingSession = false;
var hasFetchedSession = false;
//FetchSession functionality
async function FetchSession(sessionid: string): Promise<FetchSessionResponse> {

    try {
        // Attempt to register the current user as a client on the session
        const response = await fetch(`https://talkdirect-api.onrender.com/api/join/${sessionid}`, {
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
    const [, setHost] = useState<string>();

    // Grab all the current clients connected to the host
    const [, setClients] = useState<any[]>();

    // Grab the websocket url from cookies
    const [WebsocketUrl,] = useCookie('Websocket-url', '');

    // Signifies a Valid Websocket Connection
    const [Connection, setConnection] = useState<boolean>(false);

    // Used to exclaim an error has occured
    const [, seterror] = useState(false);

    // Used to display the error message
    const [, setErrorMsg] = useState<string>();

    const [messageBuffer, setmessageBuffer] = useState<Message[]>([]);

    const socketRef = useRef(new useSocket());
    const sessionSocket = socketRef.current; // Use this variable everywhere

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

    // Chatbox Functionality
    function PushChatBuffer(message:string) {
        const msg: Message = {
            id: crypto.randomUUID(),
            message: message,
            time: new Date().toLocaleString()
        }
        messageBuffer.push(msg);
        setmessageBuffer(prev => [...prev, msg]);;
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
        sessionSocket.createSocket(WebsocketUrl);
    }

    function onMessage() {
        sessionSocket.onMessage(async (data:string) => {
            PushChatBuffer(data);
        });
    }

    const onStringSubmit = async (Event:MouseEvent) => {
        if (sessionid == undefined || Connection == false) return;

        /* 
        // Plans for a standard Mouse Message Bitfield:
        // 0-7         |      8-n
        // DATAID      |   Content
        */
       
        // Grab String from form
        const form  = Event.currentTarget.parentElement as HTMLFormElement;
        const formData = new FormData(form);

        const formJson = Object.fromEntries(formData.entries());
        const clientMessage = formJson['client-message'] as string;

        // First add this message as a new chat
        //PushChatBuffer(clientMessage);

        // Start to package together a buffer of bits to send off
        let headerBuffer:Buffer = Buffer.allocUnsafe(1);

        headerBuffer.writeUint8(DataIdentifier.STRING, 0);

        const contentBuffer = Buffer.from(clientMessage, 'utf-8');

        sessionSocket.sendMessage(Buffer.concat([headerBuffer, contentBuffer]));
    }

    useEffect(() => {
        FetchSessionState();

        onMessage();

        return () => {
            sessionSocket.closeSocket();
        }
    },[sessionSocket])

    return (
    <>
        <div className='chat-box'>
            <p> Chatroom</p>
            <div className="chat-container">
                {
                    messageBuffer.map((msg, index) => {
                        return (
                            <Chat
                            key={index}
                            id={msg.id}
                            message={msg.message}
                            time={msg.time}
                            />
                        )
                    })
                }
            </div>
            <form className='chat-form' id="chat-form">
                <label htmlFor="chat-form">Message:</label>
                <input type='text' name='client-message' id='client-message' /><br/>
                <input type='button' className='submit-button' id='submit-button' value='Send' onClick={e => onStringSubmit(e)}/>
            </form>
    </div>
    </>
    )
}

export default Session