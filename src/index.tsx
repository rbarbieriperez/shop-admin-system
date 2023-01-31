import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './global.scss';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider, useNavigate } from 'react-router';
import Login from './views/login/login';
import RecoverPassword from './views/recover-password/recover-password';
import Dashboard from './views/dashboard/dashboard';
import { Provider } from 'react-redux/es/exports';
import Products from './views/products/products';



window.addEventListener('popstate', () => {
  tokenValidations();
});

/**
 * Checks the login token when the page is reload calling at a centinel end point, 
 * if the code is valid, the user can navigate, else the user is redirected to the login
 */
window.addEventListener('load', async () => {
  tokenValidations();

  
})


const tokenValidations = async () => {
  const appurl = 'http://localhost:3001/';

  const validateToken = async (token: string, email: string) => {
      const result = await fetch('http://localhost:3000/api/login/test-token', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
        },
        body: JSON.stringify({
          token: token,
          email: email
        })
    }).then((data) => data.json()).catch((error) => error);

    return result;
  }


  const loginToken = sessionStorage.getItem('loginToken');
  const email = sessionStorage.getItem('userEmail');


  // if the session storage does not contains any data and the current location isnt login, redirect user to login

  if (!loginToken && !email && window.location.href !== appurl) {
    window.location.href = '/';
  } 

  //if the session storage does contains any data and the current location isnt login, validate if the token is correct, if not, redirect user to login

  if (loginToken && email && window.location.href !== appurl) {
   
    const tokenValidationResult = await validateToken(loginToken, email);

    if (!tokenValidationResult["validToken"] && tokenValidationResult["code"] === '400' && window.location.href !== appurl) {
      window.location.href = '/';
    } 
  }

  // if the session storage does contains any data and the current location is login, disable all tokens for that user and then clear storage

  if (loginToken && email && window.location.href === appurl) {
      await validateToken('1', email);
      sessionStorage.clear();
  }

}


const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>
  },
  {
    path: '/recovery-password',
    element: <RecoverPassword/>
  },
  {
    path: '/dashboard',
    element: <Dashboard/>
  },
  {
    path: '/dashboard/products',
    element: <Products/>
  }
]);


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>
);

