import { useEffect, useState } from 'react'
import './Session.css'
import { useParams } from 'react-router-dom'

function Session() {

    // Grab the current session of the User
    const {sessionid} = useParams();

    // Determine whether or not the current User is the Host, if Host do not play video, instead display an error where video would be
    const [Host, setHost] = useState<string>();

    // Grab all the current clients connected to the host
    const [Clients, setClients] = useState<any[]>();

    // Used to exclaim an error has occured
    const [error, seterror] = useState(false);

    // Used to display the error message
    const [ErrorMsg, setErrorMsg] = useState<string>();


    // Handle Errors
    async function HandleError(errorType: number) {
        seterror(true);

        switch (errorType) {
            case 0:
                setErrorMsg("Error in Attempt to find Session.");
                break;
        
            default:
                setErrorMsg("Default unaccounted Error, please notify owners.");
                break;
        }
    }
    // Attempt to grab the session media from the host/api
    const FetchSession = async () => {
        try {
            const response = await fetch(`http://localhost:9999/api/find/${sessionid}`, {
                method: 'GET',
            });
    
            const data = await response.json();
    
            if (!data) {
                throw new Error();
            }

            setHost(data.host);
            setClients(data.clients);
        } catch (error) {
            HandleError(0);
        }
    }

    // Where we'll start to load up video and any other important details when page is first loaded
    useEffect(() => {
        FetchSession();
    })

    return (
    <>
        <div>
            {
                error ? <p>{ErrorMsg}</p> : 
                <p> Session Video Player Would be here, for now we'll just display the SessionID you're currently in. {sessionid}</p>
            }

        </div>
    </>
    )
}

export default Session
