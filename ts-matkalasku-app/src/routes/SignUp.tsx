import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";

// import {Link} from 'react-router-dom'


const SignUp: React.FC = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [name, setName] = useState<string>("");
    const navigate = useNavigate();

    return (
<div className="flex flex-col items-center justify-center min-h-screen bg-login-bg bg-cover bg-center">

        {/* Logo and title */}
        <div className="flex items-center gap-2 mb-4">
            <img className="h-10" src={logo} alt="Logo" />
          <h3 className="text-3xl text-white font-robotoTitle">MatkaLasku</h3>
        </div>

         {/* SignUp container */}

    <div className="relative flex flex-col m-6 space-y-8 rounded-2xl md:flex-row md:space-y-0 bg-white">
        <div className="flex flex-col justify-center p-8 md:p-14">
            <span className="mb-3 text-4xl font-bold text-center text-blue-dark-950">Sign up</span>
            <div className="py-3">
                <input
                className="w-full p-2 rounded-md bg-blue-dark-300 placeholder:font-light placeholder:text-gray-500" 
                type="text"
                value={name} 
                placeholder="Enter your name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setName(e.target.value)}
                />
            </div>
            <div className="py-3">
                <input
                className="w-full p-2 rounded-md bg-blue-dark-300 placeholder:font-light placeholder:text-gray-500" 
                type="email"
                value={email} 
                placeholder="Enter your email"
                onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setEmail(e.target.value)}
                />
            </div>
            <div className="py-3">
                <input className="w-full p-2 rounded-md bg-blue-dark-300 placeholder:font-light placeholder:text-gray-500" 
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)} />

                <button className="mt-6 w-full border border-transparent bg-blue-dark-900 text-white p-2 rounded-lg mb-6 hover:bg-blue-dark-800 shadow-2xl">Sign up</button>
            <div className="text-center text-gray-400">
                Already have an account?
                <span className="cursor-pointer font-bold text-blue-dark-800"
                    onClick={() => navigate('/login')}> Log in
                    {/* <Link to={"/register"}>Sign up here</Link> */}
                    </span>
            </div>
            </div>

        </div>

    </div>

</div>
    )
}

export default SignUp;