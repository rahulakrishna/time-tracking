import React, { useState } from 'react';

const Authenticate = () => {
  const [token, setToken] = useState('');
  return (
    <div>
      <br />
      <br />
      <br />
      Go to{' '}
      <a href="https://test-323-c4fca.web.app/">
        https://test-323-c4fca.web.app/
      </a>{' '}
      and copy your_token
      <br />
      <br />
      <br />
      <textarea value={token} onChange={e => setToken(e.target.value)} />
      <br />
      <br />
      <button
        onClick={() => {
          localStorage.setItem('token', token);
          window.location.href = '';
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default Authenticate;
