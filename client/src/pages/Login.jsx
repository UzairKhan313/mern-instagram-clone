import React, { useState } from "react";
import TextField from "@mui/material/TextField";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // dispatch(loginUser(email, password));
  };

  return (
    <>
      {false && <BackdropLoader />}
      <Auth>
        <div className="bg-white border flex flex-col gap-2 p-4 pt-10">
          <img
            draggable="false"
            className="mx-auto h-30 w-36 object-contain"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />
          <form
            onSubmit={handleLogin}
            className="flex flex-col justify-center items-center gap-3 m-3 md:m-8"
          >
            <TextField
              label="Email/Username"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="small"
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              size="small"
              fullWidth
            />
            <button
              type="submit"
              className="bg-primary-blue font-medium py-2 rounded text-white w-full"
            >
              Log In
            </button>
            <span className="my-3 text-gray-500">OR</span>
            <Link
              to="/password/forgot"
              className="text-sm font-medium text-blue-800"
            >
              Forgot password?
            </Link>
          </form>
        </div>

        <div className="bg-white border p-5 text-center">
          <span>
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-blue">
              Sign up
            </Link>
          </span>
        </div>
      </Auth>
    </>
  );
};

export default LoginPage;
