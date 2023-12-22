import { useEffect, useState } from 'react'
import './Session.css'
import { useParams } from 'react-router-dom'

function Session() {

    // Grab the current session of the User
    const {session} = useParams();

    // Determine whether or not the current User is the Host, if Host do not play video, instead display an error where video would be
    const [Host, setHost] = useState<string>();

    const FetchSession = async () => {
        console.log("Session Would be retrieved here.")
    }

    // Where we'll start to load up video and any other important details when page is first loaded
    useEffect(() => {

    })

    return (
    <>
        <div>
            <p> Session Video Player Would be here, for now we'll just display the SessionID you're currently in. {session}</p>
        </div>
    </>
    )
}

export default Session
