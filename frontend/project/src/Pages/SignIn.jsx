import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Fade } from "react-reveal";
import { ClipLoader } from "react-spinners";
import { AuthContext } from "../Context/AuthContext";
import WelcomePageBanner from "../images/WelcomePageBanner.jpg";
import axios from "axios";

function SignIn() {
  const { setAuthData, setSubscription } = useContext(AuthContext); // Access context
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" }}
      );

      const { token, username, isSubscribed } = response.data.user;
      // Save token & user in context & localStorage
      setAuthData(token, username);
      localStorage.setItem("authToken", token);

      console.log("Signin Successful:", response.data);
      setSubscription(isSubscribed)
      localStorage.setItem("subscribed", isSubscribed);

      navigate("/home");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong");
    }

    setLoader(false);
  };

  return (
    <section
      className="h-[100vh] bg-gray-50 dark:bg-gray-900"
      style={{
        background: `linear-gradient(0deg, hsl(0deg 0% 0% / 73%) 0%, hsl(0deg 0% 0% / 73%) 35%),url(${WelcomePageBanner})`,
      }}
    >
      <div className="h-[100vh] flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-[#000000a2] rounded-lg shadow sm:my-0 md:mt-0 sm:max-w-lg xl:p-0 border-2 border-stone-800 lg:border-0">
          <Fade>
            <div>
              <div className="p-6 space-y-4 md:space-y-6 sm:p-12">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl dark:text-white">
                  Sign in to your account
                </h1>
                <h1 className="text-white text-2xl p-3 text-center border-2 border-red-700 rounded-sm">
                  Rishabh's Netflix
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-white">Your email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="name@email.com"
                      required
                      className="bg-stone-700 text-white sm:text-sm rounded-sm block w-full p-2.5 placeholder:text-white"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-white">Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      required
                      className="bg-stone-700 text-white sm:text-sm rounded-sm block w-full p-2.5 placeholder:text-white"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {errorMessage && (
                    <div className="flex text-white font-bold p-4 bg-red-700 rounded text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                      {errorMessage}
                    </div>
                  )}
                  <button
                    type="submit"
                    className={`w-full text-white ${loader ? "bg-stone-700" : "bg-red-700 hover:bg-red-800"} font-medium rounded-sm text-sm px-5 py-2.5 text-center`}
                  >
                    {loader ? <ClipLoader color="#ff0000" /> : "Sign in"}
                  </button>
                  <p className="text-sm font-light text-gray-500">
                    Don’t have an account yet?{" "}
                    <Link className="font-medium text-white hover:underline" to={"/signup"}>
                      Sign up
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
}

export default SignIn;
