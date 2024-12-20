import { useState } from "react";
import axios from "axios";
type authProp = {
  pageType: string;
};

const Authentication = (prop: authProp) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // const { setUser } = useUser();
  // useEffect(() => {
  //   setUser({
  //     id: 2,
  //     name: "WOWWO",
  //     email: "wwwww@gmail.com",
  //   });
  // }, []);

  const func = async () => {
    try {
      console.log(username);
      await axios.post(`http://localhost:3000/signup`, {
        username: username,
        password: password,
      });
      console.log(username, password);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  function handleUser(e: React.ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
  }
  function handlePass(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    func();
  }

  if (prop.pageType == "login") {
    return (
      <div>
        <h1 className="text-5xl font-semibold text-red-800">Login</h1>
        <form method="post">
          <label htmlFor="username">
            <input type="text" value={username} id="name" name="username" />
          </label>
          <label htmlFor="password">
            <input type="text" value={password} id="name" name="password" />
          </label>
          <button type="submit" className="border">
            Log In
          </button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <h1 className="text-5xl font-semibold text-red-800">Sign Up</h1>
        <form method="post" onSubmit={handleSubmit}>
          <label htmlFor="username">
            <input
              type="text"
              className="bg-red-500"
              id="name"
              onChange={handleUser}
              value={username}
              name="username"
            />
          </label>
          <label htmlFor="password">
            <input
              type="text"
              className="bg-blue-200"
              id="name"
              onChange={handlePass}
              value={password}
              name="password"
            />
          </label>
          <button type="submit" className="border">
            Sign Up
          </button>
        </form>
      </div>
    );
  }
};
export default Authentication;
