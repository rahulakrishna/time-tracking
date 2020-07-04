import React from 'react';
import './App.css';

function App() {
  console.log({ process: process.env });
  return (
    <div>
      <p>{process.env.REACT_APP_AUTH_TOKEN}</p>
    </div>
  );
}

export default App;
