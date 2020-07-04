import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTask from "./components/CreateTask";
import List from "./components/List";
import { AppContainer } from "styles";

function App() {
  console.log({ process: process.env });
  return (
    <>
      <AppContainer>
        <div>
          <CreateTask />
          <List />
        </div>
      </AppContainer>
      <ToastContainer />
    </>
  );
}

export default App;
