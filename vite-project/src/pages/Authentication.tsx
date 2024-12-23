import { useState } from "react";
import axios from "axios";
type authProp = {
  pageType: string;
};

const Authentication = (prop: authProp) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    func();
  }

  if (prop.pageType == "login") {
    return (
      <div>
        <h1 className="text-5xl font-semibold text-red-800">Login</h1>
        <form method="post">
          <label htmlFor="email">
            <input
              type="text"
              value={email}
              id="name"
              name="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-200 rounded-xl p-2 text-black"
            />
          </label>
          <label htmlFor="password">
            <input
              type="text"
              value={password}
              className="border"
              onChange={(e) => setPassword(e.target.value)}
              id="name"
              name="password"
            />
          </label>
          <button type="submit" className="border">
            Log In
          </button>
        </form>
        <div>
          {username} {email} {password}
        </div>
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
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              name="username"
            />
          </label>
          <label htmlFor="email">
            <input
              type="text"
              className="bg-blue-200"
              id="name"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name="email"
            />
          </label>
          <label htmlFor="password">
            <input
              type="text"
              className="bg-blue-200 border"
              id="name"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name="password"
            />
          </label>
          <button type="submit" className="border p-2">
            Sign Up
          </button>
        </form>
        <div>
          {username} {email} {password}
        </div>
      </div>
    );
  }
};
export default Authentication;
