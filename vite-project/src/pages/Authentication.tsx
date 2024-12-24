import { useState } from "react";
import axios from "axios";
import Logo from "../static/Logo.png";
import Footer from "../Components/Footer";
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
      <div className="bg-loginBg h-screen bg-cover flex justify-end font-Poppins">
        <div className="bg-white/50 h-full w-2/5 flex-col flex justify-between items-center">
          <div className="flex gap-8 flex-col w-full p-12">
            <nav className="w-full h-16 items-center text-2xl flex">
              <img src={Logo} alt="Logo" className="h-full object-contain" />
              Jhyape
            </nav>
            <h1 className="text-3xl font-semibold text-red-800">Login</h1>
            <form method="post" className="flex flex-col gap-6">
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
                  onChange={(e) => setPassword(e.target.value)}
                  id="name"
                  name="password"
                  placeholder="Password"
                  className="bg-gray-200 rounded-xl p-2 text-black"
                />
              </label>
              <div className="w-full flex justify-between">
                <label htmlFor="remember" className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="checked:text-yellow-600 checked:bg-yellow-600 checked:border-black rounded cursor-pointer w-4 h-4 border bg-white border-black appearance-none"
                  />
                  Remember Me
                </label>
                <button
                  type="submit"
                  className="border border-yellow-700 hover:bg-transparent hover:text-black bg-yellow-400 text-white rounded-xl py-1 font-semibold px-2 w-1/3"
                >
                  Log In
                </button>
              </div>
            </form>
          </div>
          <Footer size="sm" />
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
