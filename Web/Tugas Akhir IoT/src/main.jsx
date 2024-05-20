import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
// import './index.css';
import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import './Styles/globalstyle.css'

import LoginPage from './Pages/LoginPage.jsx';
import Beranda from './Pages/Beranda.jsx';
import Monitoring from './Pages/Monitoring.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage/>
  },
  {
    path: '/home',
    element: <Beranda/>
  },
  {
    path: '/monitoring',
    element: <Monitoring/> 

  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
