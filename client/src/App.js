import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
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
  return (
    <div className="App">
      <button onClick={getUsers}>GET USERS</button>
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
