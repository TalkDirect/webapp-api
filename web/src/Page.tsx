import { FormEvent, useState } from 'react'
import './Page.css'
import playDirectLogo from '/svg icon.svg'
import { useNavigate } from 'react-router-dom';

function Page() {
  // Grab a Possible Session from the Session ID, checked against API/backend
  const [sessionId, setSessionId] = useState<string>();

  // Boolean to Check if button is pressed or not for joining session
  const [Error, setError] = useState(false);

  const [ErrorMsg, setErrorMsg] = useState<string>();

  // Allow for us to navigate from page
  const navigate = useNavigate();

  async function HandleError(errorType:number) {
    setError(true);

    switch (errorType) {
      case 0:
        setErrorMsg("Session Does not exist, please try again!")
        break;
    
      default:
        setErrorMsg("RANDOM ERROR CONTACT OWNERS")
        break;
    }
  }

  // Grabs SessionID from form and sends it off to the API
  async function HandleSubmit(e:FormEvent) {
    e.preventDefault();

    // Grab SessionID from form
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const formJson = Object.fromEntries(formData.entries());

    // Send a GET Request to attempt to join the session via the ID, if returns a valid code, join it
    const sessionAttempt = formJson['sessionid'] as string;
    const response = await fetch(`http://localhost:9999/api/join/${sessionAttempt}`, {
        method: 'GET',
    });

    // Return and for now save sessionid to session and console print it out
    const data = await response.json();
    setSessionId(data['sessionid']);
    console.log(data);

    // Route to the session page if all checks have worked and nothing is wrong
    if (response.status == 202) {
      navigate(`/session/${sessionId}`, { replace: true});
    } else {
      console.log("Undefined SessionID")
    }
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
