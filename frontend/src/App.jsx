import { useEffect } from "react";
import "./App.css";
import { io } from "socket.io-client";
import { useState } from "react";

const socket = io("http://localhost:9000");

function App() {
  const [socketID, setSocketID] = useState("");
  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
      setSocketID(socket.id);
    });
  }, []);

  return (
    <>
      {socketID}
      hello
    </>
  );
}

export default App;
