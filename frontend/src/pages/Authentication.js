import { redirect } from 'react-router-dom';

import AuthForm from '../components/AuthForm';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

// will be triggered when AuthForm is submitted
export async function action({request}){
  // access query params
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('mode') || 'login';
  
  if (mode !== 'login' && mode !== 'signup'){
    throw new Response(JSON.stringify(
      { message: 'Unsupported mode' },
      {
        // 422 = invalid user input
        status: 422,
      }
    ))
  }

  // get email and password
  const data = await request.formData();
  const authData = {
    email: data.get('email'),
    password: data.get('password')
  }

  // send request to backend
  const response = await fetch('http://localhost:8080/' + mode, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(authData)
  })

  if (response.status === 422 || response.status === 401){
    return response;
  } 

  if (!response.ok){
    throw new Response(JSON.stringify({message: 'Could not authenticate user'}, {status: 500}))
  }

  // TODO: ...manage token received from backend
  const resData = await response.json();
  const token = resData.token;

  localStorage.setItem('token', token);
  const expiration = new Date();
  // create Date object one hour in the future
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem('expiration', expiration.toISOString());
  
  return redirect('/')

}
