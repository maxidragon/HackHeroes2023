import { motion, useIsPresent } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AvatarComponent from "../../Components/AvatarComponent";
import { TbSettingsFilled } from "react-icons/tb";

export default function Profile() {
  const isPresent = useIsPresent();
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    //made this only to shot the warning of not using setUserData
    setUserData({
      id: 1,
      username: "username",
      email: "email@email.com",
      name: "name",
      lastname: "lastname",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. A fugit beatae eum accusantium eveniet possimus molestias praesentium voluptatibus, non veritatis.",
    });
  }, []);

  return (
    <div className="flex-1">
      <div
        className={`h-2/5 flex items-center justify-center relative ${
          userData?.banner
            ? `bg-[url('${userData.banner}')]`
            : "bg-gradient-to-r from-violet-500 to-fuchsia-500"
        }`}
      >
        <div className="flex items-center flex-col gap-4 text-4xl roboto text-gray-100">
          <AvatarComponent
            userId={+(userId || -10)}
            userName={userData?.username}
            size="10rem"
          />
          {userData?.username}
        </div>
        {userData?.id === +(userId || -10) && (
          <Link to="/settings">
            <TbSettingsFilled className="absolute right-4 top-4 cursor-pointer text-bgClr hover:text-gray-100 hover:rotate-90 text-2xl transition-all" />
          </Link>
        )}
      </div>
      <div className="h-3/5 flex items-center md:flex-row flex-col">
        <div className="h-full md:w-1/2 w-full xl:text-2xl md:text-xl quicksand box-border p-8 text-gray-400">
          <p className="text-4xl capitalize text-gray-100">
            {userData?.name} {userData?.lastname}
          </p>
          <p>{userData?.email}</p>
          <p className="mt-8">
            {userData?.description || "This user has no description yet!"}
          </p>
        </div>
        <div className="hidden md:block w-1 h-[90%] bg-purple-400 rounded-full" />
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
