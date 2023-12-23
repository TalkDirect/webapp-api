import { useEffect, useState } from 'react'
import './Session.css'
import { useParams } from 'react-router-dom'
import { useCookie } from './cookie';
import { useSocket } from './WebSocketService';
//import WebSocket from 'ws';

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


    // Attempt to grab the session media from the host/api
    const FetchSession = async () => {
        try {
            // Attempt to register the current user as a client on the session
            const response = await fetch(`http://localhost:9999/api/join/${sessionid}`, {
                method: 'GET',
            });
    
            const data = await response.json();
    
            if (!data) {
                throw new Error();
            }

            // Set the host and clients states
            setHost(data.host);
            setClients(data.clients);
        } catch (error) {
            HandleError('0');
        }
    }

    // Where we'll start to load up video and any other important details when page is first loaded
    useEffect(() => {
        FetchSession();
        console.log(useSocket);
    })

    return (
    <>
        <div>
            {
                error ? <p>{ErrorMsg}</p> :
                Connection ? <p> Actual Message Would Go Here</p> : 
                <p>Connection is Loading!</p>
            }

        </div>
    </>
    )
}

export default Session
