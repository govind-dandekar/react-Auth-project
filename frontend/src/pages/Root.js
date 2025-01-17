import { useEffect } from 'react';

import { Outlet, useLoaderData, useSubmit } from 'react-router-dom';

import MainNavigation from '../components/MainNavigation';
import { getTokenDuration } from '../util/auth';

function RootLayout() {
  // const navigation = useNavigation();

  // root component renders first
  const token = useLoaderData();
  
  // provides submit fx to submit Form
  const submit = useSubmit();
  
  // will execute when RootLayout renders, when token changes,
  // or when submit fx changes (submit won't change)
  useEffect(() => {
    if (!token){
      return;
    } 

    if (token === 'EXPIRED'){
      submit(null, {action: '/logout', method: 'post'});
      return;
    }

    const tokenDuration = getTokenDuration();
    console.log(tokenDuration);

    setTimeout(() => {
      // no data, target logout action
      submit(null, {action: '/logout', method: 'post'})
    }, tokenDuration)
  }, [token, submit])

  return (
    <>
      <MainNavigation />
      <main>
        {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
