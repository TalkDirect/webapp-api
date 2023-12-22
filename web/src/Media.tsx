import { useEffect, useState } from 'react'
import './Media.css'
import { useParams } from 'react-router-dom'

function Media() {

    // Grab the current session of the User
    //const {session} = useParams;

    // Determine whether or not the current User is the Host, if Host do not play video, instead display an error where video would be
    const [Host, setHost] = useState<string>();

    // Where we'll start to load up video and any other important details when page is first loaded
    useEffect(() => {

    })

    return (
    <>
        <div>

        </div>
    </>
    )
}

export default Media
