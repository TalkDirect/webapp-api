import { useEffect, useState } from 'react'
import './Web.css'
import playDirectLogo from '/svg icon.svg'

function Page() {
  // Grab a Possible Session from the Session ID, checked against API/backend
  const [session, setSession] = useState(null);

  // Whenver 'Go' is clicked, start a search to find a Session
  async function onGoClick(sessionID: string) {

  }

  const FetchSession = async (apiURL:string) => {
    try {
       // Return a proper video connection

    } catch(error: any) {
       // Catch if sessionID null/invalid 

    }
  }

  useEffect(() => {
    FetchSession('test')
  }, [])

  return (
    <>
      <div>
          <a href="https://github.com/Chieffz/PlayDirect" target="_blank">
              <img src={playDirectLogo} className="logo" alt="PlayerDirect logo" />
          </a>
      </div>
      <h1> PlayDirect</h1>
      <div className='session-card'>
        <p> Enter your Session ID Here!</p>
          <form className='session-card-form'>
            <label htmlFor="sessionid">Session ID:</label>
            <input type='text' name='sessionid' id='sessionid'/><br/>
            <input type='submit' className='submit-button' value='Go'
            onClick={() =>  onGoClick}/>
          </form>
      </div>
    </>
  )
}

export default Page
