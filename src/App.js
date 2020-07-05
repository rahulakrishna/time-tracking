import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateTask from './components/CreateTask';
import List from './components/List';
import Authenticate from 'components/Authenticate';
import { AppContainer } from 'styles';

function App() {
  const [authenticated, setAuthenticated] = useState(true);
  return (
    <>
      <AppContainer>
        {authenticated ? (
          <div>
            <CreateTask />
            <List setAuthenticated={setAuthenticated} />
          </div>
        ) : (
          <Authenticate />
        )}
      </AppContainer>
      <ToastContainer />
    </>
  );
}

export default App;
