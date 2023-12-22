import './Web.css'
import playDirectLogo from '/svg icon.svg'

function Page() {

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
            <input type='submit' className='submit-button' value='Go'/>
          </form>
      </div>
    </>
  )
}

export default Page
