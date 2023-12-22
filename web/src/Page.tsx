import { FormEvent, useState } from 'react'
import './Web.css'
import playDirectLogo from '/svg icon.svg'

function Page() {
  // Grab a Possible Session from the Session ID, checked against API/backend
  const [session, setSession] = useState<string>();

  // Boolean to Check if Host or Not, if Host do not go to session page, throw an error instead
  const [isHost, setIsHost] = useState(false);

  // Grabs SessionID from form and sends it off to the API
  async function HandleSubmit(e:FormEvent) {
    e.preventDefault();

    // Grab SessionID from form
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const formJson = Object.fromEntries(formData.entries());

    // Send a GET Request to attempt to join the session via the ID, if returns a valid code, join it
    const session = formJson['sessionid'] as string;

    const response = await fetch(`http://localhost:9999/api/join/${session}`, {
        method: 'GET',
    });

    // Return and for now save sessionid to session and console print it out
    const data = await response.json();
    setSession(data.sessionid);
    console.log(data);

    // Route to the session page with the correct ID
    


  }

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
          <form className='session-card-form' method='GET' onSubmit={HandleSubmit}>
            <label htmlFor="sessionid">Session ID:</label>
            <input type='text' name='sessionid' id='sessionid'/><br/>
            <input type='submit' className='submit-button' value='Go'/>
          </form>
      </div>
    </>
  )
}

export default Page
