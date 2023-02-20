import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);

  const socket = new WebSocket("ws://localhost:5002");
  socket.addEventListener("open", function (event) {
    console.log("Connected to WS Server");
  });

  const getUsers = () => {
    axios
      .get("users")
      .then((res) => {
        console.log("recieved res is :", res);
        setUsers(res.data);
      })
      .catch(function (thrown) {
        let errorResponseMessage = thrown.response.data;
        console.log(
          errorResponseMessage ? errorResponseMessage : thrown.message
        );
      });
  };
  const abortAPICall = () => {
    socket.send("Abort");
  };
  return (
    <div className="App">
      <button onClick={getUsers}>GET USERS</button>
      <button onClick={abortAPICall}>CANCEL USERS API</button>
      <div className="DataContainer">
        {users && (
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
