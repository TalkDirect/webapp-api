import React from 'react'
import ReactDOM from 'react-dom/client'
import Web from './Web.tsx'
import Page from './Page.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div>
      <Page/>
    </div>
    <div>
      <p> Example Text.</p>
    </div>
  </React.StrictMode>,
)
