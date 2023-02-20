import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [showCancelNotification, setShowCancelNotification] = useState(false);
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const socket = new WebSocket("ws://localhost:5002");
  socket.addEventListener("open", function (event) {
    console.log("Connected to WS Server");
  });

  const getUsers = () => {
    setUsers([]);
    axios
      .get("users", {
        cancelToken: source.token,
      })
      .then((res) => {
        console.log("recieved res is :", res);
        setUsers(res.data);
      })
      .catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log("Request canceled", thrown.message);
        } else {
          let errorResponseMessage = thrown.response.data;
          console.log(
            errorResponseMessage ? errorResponseMessage : thrown.message
          );
        }
      });
  };
  const abortAPICall = () => {
    source.cancel("Operation canceled by the user.");
    socket.send("Abort");
    setShowCancelNotification(true);
    setTimeout(function () {
      setShowCancelNotification(false);
    }, 2000);
  };
  return (
    <div className="App">
      <div className="Main">
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
      {showCancelNotification && (
        <div className="Notification">User Request/Operation Canceled</div>
      )}
    </div>
  );
}

export default App;
