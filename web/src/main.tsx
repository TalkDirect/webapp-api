import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// React Componants to be Routed
import Page from './Page.tsx'
import Media from './Media.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Page />}/>
          <Route path="/session/*" element={<Media />}/>
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>,
)
