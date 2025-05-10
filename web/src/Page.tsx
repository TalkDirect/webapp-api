import { FormEvent, useState } from 'react'
import './Page.css'
import talkDirectLogo from '/svg icon.svg'
import { useNavigate } from 'react-router-dom';
import { useCookie } from './cookie';

function Page() {

  // The state that'll be saved to cookies
  const [WebsocketUrl, setWebsocketUrl] = useCookie('Websocket-url', '');

  // Boolean to Check if button is pressed or not for joining session
  const [error, seterror] = useState(false);

  const [ErrorMsg, setErrorMsg] = useState<string>();

  // Allow for us to navigate from page
  const navigate = useNavigate();

  async function HandleError(errorType:number) {
    // Handle all Errors, if unknown throw an urgent one.
    seterror(true);

    switch (errorType) {
      case 0:
        setErrorMsg("Session Does not exist, please try again!");
        break;
    
      default:
        setErrorMsg("RANDOM ERROR CONTACT OWNERS");
        break;
    }
  }


  // Grabs SessionID from form and sends it off to the API
  async function HandleSubmit(e:FormEvent) {
   try {
      e.preventDefault();

      // Grab SessionID from form
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const formJson = Object.fromEntries(formData.entries());

      // Send a GET Request to attempt to see if a valid session exists with that ID, if not throw an error
      const sessionAttempt = formJson['sessionid'] as string;
      const response:Response = await fetch(`https://localhost:9999/api/find/${sessionAttempt}`, {
          method: 'GET',
      });

      //
      if (response.status !== 202) {
        throw new Error();
      }

      // Now, save that websocket to be used on the next page
      const data = await response.json();
      setWebsocketUrl(data['socketinfo']);

      navigate(`/session/${formJson['sessionid']}`, { replace: true});

   } catch (error) {
      // Throw a no SessionID Error
      HandleError(0);
   }
  }

  return (
    <>
      <div>
          <a href="https://github.com/TalkDirect" target="_blank">
              <img src={talkDirectLogo} className="logo" id="logo" alt="PlayerDirect logo" />
          </a>
      </div>
      <h1> TalkDirect </h1>
      <div className='session-card'>
        <p> Enter your Session ID Here!</p>
          <form className='session-card-form' id="session-form" method='GET' onSubmit={HandleSubmit}>
            <label htmlFor="sessionid">Session ID:</label>
            <input type='text' name='sessionid' id='sessionid'/><br/>
            <input type='submit' className='submit-button' id='submit-button' value='Go'/>
          </form>
      </div>
      <div>
        {error ? <p>{ErrorMsg}</p> : <p> All Clear!</p>}
      </div>
    </>
  )
}

export default Page
