import { motion, useIsPresent } from "framer-motion";
import { userAtom } from "../../../Atoms";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AvatarComponent from "../../../Components/AvatarComponent";
import Input from "../../../Components/Input";
import toast from "react-hot-toast";
import Button from "../../../Components/Button";
import { TbDeviceFloppy } from "react-icons/tb";
import AvatarEditorModal from "./Components/AvatarEditorModal";

interface userData {
  username?: string;
  email?: string;
  description?: string;
}

interface avatarOptions {
  scale?: number;
  rotate?: number;
}

export default function Settings() {
  const isPresent = useIsPresent();
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<userData>();
  const [banner, setBanner] = useState<Blob>();
  const [avatarBlob, setAvatarBlob] = useState<Blob>();
  const [isUserEditingAvatar, setIsUserEditingAvatar] =
    useState<boolean>(false);
  const [avatarEditingOptions, setAvatarEditingOptions] =
    useState<avatarOptions>();

  const bannerRef = useRef<any>(null);

  useEffect(() => {
    if (!user.id) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      await fetch(`${import.meta.env.VITE_API_URL}/user/settings/get`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status >= 400) {
            toast.error("Something went wrong!");
            navigate(`/profile/${user.id}`);
          } else {
            res.json().then((data) => {
              setUserData(data);
            });
          }
        })
        .catch((err) => {
          toast.error("Something went wrong!");
          navigate(`/profile/${user.id}`);
          console.log(err);
        });
    };

    const fetchBanner = async () => {
      await fetch(
        `${import.meta.env.VITE_API_URL}/user/settings/banner/${user.id}`,
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
            navigate(`/profile/${user.id}`);
          } else {
            res.blob().then((data) => {
              setBanner(data);
            });
          }
        })
        .catch((err) => {
          toast.error("Something went wrong!");
          navigate(`/profile/${user.id}`);
          console.log(err);
        });
    };

    fetchData();
    fetchBanner();
  }, []);

  function setBannerUrl(e: any) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      toast.error("Only .png and .jpeg files are allowed!");
      return;
    }
    setBanner(file);
  }

  function uploadAvatar(e: any) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      toast.error("Only .png and .jpeg files are allowed!");
      return;
    }
    setAvatarBlob(file);
    setIsUserEditingAvatar(true);
  }

  function saveData() {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (userData?.username === "" || userData?.email === "") {
      toast.error("Username and email are required!");
      return;
    } else if (!emailRegex.test(userData?.email || "")) {
      toast.error("Provide correct email!");
    }

    let avatarFile;
    if (avatarBlob) {
      avatarFile = new File([avatarBlob], "avatar.png", {
        type: "image/png",
      });
    }

    const userDataCopy: any = { ...userData };
    userDataCopy.banner = banner;
    userDataCopy.avatar = avatarFile;

    const correctFormdata = new FormData();

    for (const key in userDataCopy) {
      correctFormdata.append(key, userDataCopy[key]);
    }

    fetch(`${import.meta.env.VITE_API_URL}/user/settings`, {
      method: "PATCH",
      credentials: "include",
      body: correctFormdata,
    })
      .then((res) => {
        if (res.status >= 400) {
          toast.error("Something went wrong!");
          return;
        } else {
          toast.success("Saved successfully!");
        }
      })
      .catch((err) => {
        toast.error("Something went wrong!");
        console.log(err);
      });
  }

  return (
    <div className="flex-1 flex justify-center">
      {isUserEditingAvatar && (
        <AvatarEditorModal
          avatarEditingOptions={avatarEditingOptions}
          setIsUserEditingAvatar={setIsUserEditingAvatar}
          setAvatarEditingOptions={setAvatarEditingOptions}
          setAvatarBlob={setAvatarBlob}
          avatarBlob={avatarBlob}
        />
      )}
      <div className="flex w-3/5 flex-col gap-8">
        <h1 className="text-center roboto text-gray-100 text-4xl mt-4">
          Settings
        </h1>
        <div className="flex gap-4">
          <div className="flex flex-col w-2/3 gap-2">
            <div
              className={`flex items-center justify-center relative p-4 rounded-xl ${
                !banner && "bg-gradient-to-r from-violet-500 to-fuchsia-500"
              }`}
              style={
                banner
                  ? {
                      background: `url('${URL.createObjectURL(
                        banner
                      )}') no-repeat center center`,
                    }
                  : {}
              }
            >
              <div className="flex items-center flex-col gap-4 text-4xl roboto text-gray-100 drop-shadow-[0px_0px_8px_rgba(0,0,0,1)]">
                {!isUserEditingAvatar && avatarBlob ? (
                  <img
                    src={URL.createObjectURL(avatarBlob)}
                    alt="Img"
                    className="w-40 h-40 rounded-full"
                  />
                ) : (
                  <AvatarComponent
                    userId={+(user?.id || -10)}
                    userName={userData?.username || ""}
                    size="10rem"
                  />
                )}
                {userData?.username}
              </div>
            </div>
            <div className="flex items-center justify-around gap-4">
              <div className="w-full flex flex-col gap-2">
                <label
                  htmlFor="banner"
                  className="text-xl roboto text-gray-400"
                >
                  Upload banner
                </label>
                <input
                  type="file"
                  className="quicksand block px-2.5 py-2.5 w-full text-lg text-white bg-transparent rounded-lg border-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600"
                  title="Upload banner"
                  accept="image/png, image/jpeg"
                  name="banner"
                  onChange={setBannerUrl}
                  defaultValue={banner ? URL.createObjectURL(banner) : ""}
                  ref={bannerRef}
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <label
                  htmlFor="avatar"
                  className="text-xl roboto text-gray-400"
                >
                  Upload avatar
                </label>
                <input
                  type="file"
                  className="quicksand block px-2.5 py-2.5 w-full text-lg text-white bg-transparent rounded-lg border-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600"
                  title="Upload banner"
                  accept="image/png, image/jpeg"
                  name="avatar"
                  onChange={uploadAvatar}
                />
              </div>
            </div>
          </div>
          <div className="w-1/3 flex flex-col gap-4">
            <Input
              placeholder="Username"
              value={userData?.username}
              onChange={(e) => {
                setUserData({ ...userData, username: e.target.value });
              }}
            />
            <Input
              placeholder="Email"
              value={userData?.email}
              type="email"
              onChange={(e) => {
                setUserData({ ...userData, email: e.target.value });
              }}
            />
            <textarea
              placeholder="Description"
              defaultValue={userData?.description}
              className="h-full block px-2.5 py-2.5 sm:w-96 w-72 text-lg text-white bg-transparent rounded-lg border-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600"
              onChange={(e) => {
                setUserData({ ...userData, description: e.target.value });
              }}
            />
          </div>
        </div>
        <Button type="default" width="w-1/4" onClick={saveData}>
          <TbDeviceFloppy />
          Save
        </Button>
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
