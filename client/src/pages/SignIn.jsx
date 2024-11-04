import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { setAuthUser } from "@/redux/auth-slice";

const SignUp = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    userId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/auth/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        toast.success(res.data.msg);
        navigate("/");
        setInput({
          userId: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <div className="flex items-center max-w-screen h-screen justify-center">
      <form
        onSubmit={signupHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">UK INSTA</h1>
          <p className="text-sm text-center">
            Login to your account to see photos & videos from your friends
          </p>
        </div>

        <div>
          <span className="font-medium">Username or Email</span>
          <Input
            type="text"
            name="userId"
            placeholder="uzair@dev.com"
            value={input.userId}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent border border-gray-400 my-2"
          />
        </div>
        <div>
          <span className="font-medium">Password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent border border-gray-400 my-2"
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit">Login</Button>
        )}

        <span className="text-center">
          Dosent have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Signup
          </Link>
        </span>
      </form>
    </div>
  );
};

export default SignUp;
