import { useEffect } from "react";
import axios from "axios";
import { setSuggestedUsers } from "@/redux/auth-slice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/user/suggested",
          { withCredentials: true }
        );
        if (res.data.success) {
          console.log(res.data);

          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        toast.error(error.response.data.msg);
      }
    };
    fetchSuggestedUsers();
  }, []);
};
export default useGetSuggestedUsers;
