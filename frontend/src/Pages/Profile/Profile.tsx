import { motion, useIsPresent } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AvatarComponent from "../../Components/AvatarComponent";
import { TbSettingsFilled } from "react-icons/tb";
import toast from "react-hot-toast";
import { useAtomValue } from "jotai";
import { userAtom } from "../../Atoms";

interface userData {
  username: string;
  firstName?: string;
  lastName?: string;
  description?: string;
}

export default function Profile() {
  const isPresent = useIsPresent();
  const loggedUser = useAtomValue(userAtom);
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<userData>();
  const navigate = useNavigate();
  const [banner, setBanner] = useState<string>();

  useEffect(() => {
    const fetchBanner = async () => {
      await fetch(
        `${import.meta.env.VITE_API_URL}/user/settings/banner/${userId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (res.status >= 400) {
            toast.error("Something went wrong!");
            navigate(`/profile/${userId}`);
          } else {
            res.blob().then((data) => {
              setBanner(URL.createObjectURL(data));
            });
          }
        })
        .catch((err) => {
          toast.error("Something went wrong!");
          console.log(err);
        });
    };

    const fetchData = async () => {
      await fetch(
        `${import.meta.env.VITE_API_URL}/user/${userId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (res.status >= 400) {
            toast.error("Something went wrong!");
            navigate(`/`);
          } else {
            res.json().then((data) => {
              setUserData(data);
            });
          }
        })
        .catch((err) => {
          toast.error("Something went wrong!");
          console.log(err);
          navigate("/");
        });
    };

    fetchBanner();
    fetchData();
  }, []);

  return (
    <div className="flex-1">
      <div
        className={`flex items-center justify-center relative p-4 rounded-xl h-2/5 ${
          !banner && "bg-gradient-to-r from-violet-500 to-fuchsia-500"
        }`}
        style={
          banner
            ? {
                background: `url('${banner}') no-repeat center center`,
              }
            : {}
        }
      >
        <div className="flex items-center flex-col gap-4 text-4xl roboto text-gray-200 drop-shadow-[0px_0px_8px_rgba(0,0,0,1)]">
          <AvatarComponent
            userId={+(userId || -10)}
            userName={userData?.username || ""}
            size="10rem"
          />
          {userData?.username}
        </div>
        {loggedUser.id === +(userId || -10) && (
          <Link to="/settings">
            <TbSettingsFilled className="absolute right-4 top-4 cursor-pointer text-gray-100 hover:text-purple-400 hover:rotate-90 text-2xl transition-all" />
          </Link>
        )}
      </div>
      <div className="h-3/5 flex items-center md:flex-row flex-col">
        <div className="h-full md:w-1/2 w-full xl:text-2xl md:text-xl quicksand box-border p-8 text-gray-400">
          <p className="text-4xl capitalize text-gray-100">
            {userData?.firstName} {userData?.lastName}
          </p>
          <p className="mt-8">
            {userData?.description || "This user has no description yet!"}
          </p>
        </div>
        <div className="hidden md:block w-1 h-[90%] bg-bgLght rounded-full" />
        <div className="h-full md:w-1/2 w-full">
          {
            //TODO: Add user's notes
          }
        </div>
      </div>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{
          scaleX: 0,
          transition: { duration: 0.6, ease: "circOut" },
        }}
        exit={{ scaleX: 1, transition: { duration: 0.6, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="privacy-screen z-50"
      />
    </div>
  );
}
