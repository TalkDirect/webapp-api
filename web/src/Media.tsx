import { useEffect, useState } from 'react'
import './Media.css'

function Media(Data:any) {
    
    // Use Websocket to send info out when button clicked
    function HandleButtonClick() {

    }

    useEffect(() => {

    })

  return (
    <>
        <div>
            <h1> Chat </h1>
            <div className='Chat Feed'>

            </div>
            <div className='Chat Extras'>
                <label htmlFor='Chat-Box'>Chat</label>
                <input type='text' id='Chat-Box'></input>
                <button className='Chat-Button' onClick={HandleButtonClick}>Send</button>
            </div>
        </div>
    </>
  )
}

export default Media
