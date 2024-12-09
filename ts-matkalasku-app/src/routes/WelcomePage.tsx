import React from "react"
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import CookieConsent from "@/components/Cookies";

const WelcomePage: React.FC = () => {
    // Use const navigate to navigate to another page
    const navigate = useNavigate();
    const { loginWithRedirect } = useAuth0(); // Auth0:s own redirect function to the login
    
    return(
        <div>
            <CookieConsent />
            {/* Background image */}
            <div className="flex items-center justify-center min-h-screen bg-login-bg bg-cover bg-center">
                {/* Border box in the center */}
                <div className="max-w-4xl w-screen  place-content-center  border-0 md:border-2 text-white text-center pb-20">
                    {/* Title */}
                    <h3 className="text-4xl lg:text-6xl font-bold py-10 lg:py-16">
                        Welcome to MatkaLasku
                    </h3>
                    {/* Text */}
                    <p className="text-2xl lg:text-4xl px-44 pb-8 font-normal">
                        The app that tracks your business travel expenses and calculates all tax-exempt allowances for you
                    </p>
                    {/* Get started button */}
                    <button onClick={()=> loginWithRedirect()} // When button is pressed the user will be redirected to Auth0 login
                            className="w-36 h-12 bg-cyan-light-600 rounded">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    )
}

export default WelcomePage