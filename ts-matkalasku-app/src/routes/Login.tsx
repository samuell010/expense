import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
//import { useAuth0 } from "@auth0/auth0-react";

// import {Link} from 'react-router-dom'

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  //const { loginWithRedirect } = useAuth0();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-login-bg bg-cover bg-center">
      {/* Logo and title */}
      <div className="mb-4 flex items-center gap-2">
        <img className="h-10" src={logo} alt="Logo" />
        <h3 className="font-robotoTitle text-3xl text-white">MatkaLasku</h3>
      </div>

      {/* Login container */}
      <div className="relative m-6 flex flex-col space-y-8 rounded-2xl bg-white shadow-2xl md:flex-row md:space-y-0">
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-center text-4xl font-bold text-blue-dark-950">
            Log in
          </span>
          {/* Enter your email */}
          <div className="py-3">
            <input
              className="w-full rounded-md bg-blue-dark-300 p-2 placeholder:font-light placeholder:text-gray-500"
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          {/* password */}
          <div className="py-3">
            <input
              className="w-full rounded-md bg-blue-dark-300 p-2 placeholder:font-light placeholder:text-gray-500"
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            {/* log in button */}
            <button
              className="mb-6 mt-6 w-full rounded-lg border border-transparent bg-blue-dark-900 p-2 text-white hover:bg-blue-dark-800"
              //onClick={() => navigate("/")}
              //onClick={()=> loginWithRedirect()}
            >
              Log in
            </button>
            <div className="text-center text-gray-400">
              Don't have an account?
              {/* sign up button */}
              <span
                className="cursor-pointer font-bold text-blue-dark-800"
                onClick={() => navigate("/signup")}
              >
                {" "}
                Sign up here
                {/* <Link to={"/register"}>Sign up here</Link> */}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
