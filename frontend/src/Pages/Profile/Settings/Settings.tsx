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
import { t } from "i18next";

interface userData {
  username?: string;
  email?: string;
  description?: string;
}

interface avatarOptions {
  scale?: number;
  rotate?: number;
}

interface vulcanTokens {
  token?: string;
  symbol?: string;
  pin?: string;
}

export default function Settings() {
  const [activatedVulcan, setActivatedVulcan] = useState<boolean>(false);
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
  const [vulcanTokens, setVulcanTokens] = useState<vulcanTokens>({
    token: "",
    symbol: "",
    pin: "",
  });

  const bannerRef = useRef<any>(null);

  useEffect(() => {
    if (!user.id) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      fetch(`${import.meta.env.VITE_API_URL}/user/settings/get`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status >= 400) {
            toast.error(t("somethingWentWrong"));
            navigate(`/profile/${user.id}`);
          } else {
            res.json().then((data) => {
              setUserData(data);
            });
          }
        })
        .catch((err) => {
          toast.error(t("somethingWentWrong"));
          navigate(`/profile/${user.id}`);
          console.log(err);
        });
    };

    const fetchBanner = async () => {
      fetch(
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
            toast.error(t("somethingWentWrong"));
            navigate(`/profile/${user.id}`);
          } else {
            res.blob().then((data) => {
              if (data.size === 0) return;
              setBanner(data);
            });
          }
        })
        .catch((err) => {
          toast.error(t("somethingWentWrong"));
          navigate(`/profile/${user.id}`);
          console.log(err);
        });
    };

    const fetchVulcan = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/vulcan/active`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      setActivatedVulcan(data.isActivated);
    };

    fetchVulcan();
    fetchData();
    fetchBanner();
  }, []);

  function setBannerUrl(e: any) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      toast.error(t("settingsErrorAvatarFormat"));
      return;
    }
    setBanner(file);
  }

  function uploadAvatar(e: any) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      toast.error(t("settingsErrorAvatarFormat"));
      return;
    }
    setAvatarBlob(file);
    setIsUserEditingAvatar(true);
  }

  function saveData() {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (userData?.username === "" || userData?.email === "") {
      toast.error(t("settingsErrorRequired"));
      return;
    } else if (!emailRegex.test(userData?.email || "")) {
      toast.error(t("registerErrorsInvalidEmail"));
    }

    let avatarFile;
    if (avatarBlob) {
      avatarFile = new File([avatarBlob], "avatar.png", {
        type: "image/png",
      });
    }

    const userDataCopy: any = { ...userData };

    if (banner && banner.size > 0) {
      userDataCopy.banner = banner;
    }
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
          toast.error(t("somethingWentWrong"));
          return;
        } else {
          toast.success(t("savedSuccessfully"));
        }
      })
      .catch((err) => {
        toast.error(t("somethingWentWrong"));
        console.log(err);
      });

    if (!vulcanTokens?.token || !vulcanTokens?.symbol || !vulcanTokens?.pin)
      return;
    fetch(`${import.meta.env.VITE_API_URL}/vulcan/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vulcanTokens),
    }).then((res) => {
      if (res.status >= 400) {
        toast.error(t("somethingWentWrong"));
        return;
      } else {
        toast.success(t("vulcanAdded"));
        setActivatedVulcan(true);
      }
    });
  }

  const removeVulcan = async () => {
    fetch(`${import.meta.env.VITE_API_URL}/vulcan/remove`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (res.status >= 400) {
          toast.error(t("somethingWentWrong"));
          return;
        } else {
          toast.success(t("vulcanRemoved"));
          setActivatedVulcan(false);
        }
      })
      .catch((err) => {
        toast.error(t("somethingWentWrong"));
        console.log(err);
      });
  };

  return (
    <div className="flex-1 flex justify-center overflow-x-auto py-8">
      {isUserEditingAvatar && (
        <AvatarEditorModal
          avatarEditingOptions={avatarEditingOptions}
          setIsUserEditingAvatar={setIsUserEditingAvatar}
          setAvatarEditingOptions={setAvatarEditingOptions}
          setAvatarBlob={setAvatarBlob}
          avatarBlob={avatarBlob}
        />
      )}
      <div className="flex w-4/5 xl:w-3/5 flex-col gap-8 box-border">
        <h1 className="text-center roboto text-gray-100 text-4xl mt-4">
          {t("settingsTitle")}
        </h1>
        <div className="flex gap-4 2xl:flex-row flex-col">
          <div className="flex flex-col 2xl:w-2/3 w-full gap-2">
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
            <div className="sm:flex-row flex-col flex items-center justify-around gap-4">
              <div className="w-full flex flex-col gap-2">
                <label
                  htmlFor="banner"
                  className="text-xl roboto text-gray-400"
                >
                  {t("settingsUploadBanner")}
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
                  {t("settingsUploadAvatar")}
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
            <div className="flex w-full md:flex-row flex-col gap-4">
              <div className="w-full flex flex-col md:justify-between gap-4">
                {activatedVulcan ? (
                  <>
                    <p className="text-lg text-center text-gray-400 roboto mt-8">
                      {t("youHaveVulcanAdded")}
                    </p>
                    <Button
                      type="alt"
                      width="2xl:flex hiddden w-full wb-8"
                      onClick={removeVulcan}
                    >
                      {t("removeVulcanButton")}
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-400 roboto">
                      {t("addYourVulcanData")}
                    </p>
                    <Input
                      placeholder="Token"
                      className="w-full"
                      value={vulcanTokens?.token}
                      onChange={(e) => {
                        setVulcanTokens({
                          ...vulcanTokens,
                          token: e.target.value,
                        });
                      }}
                    />
                    <Input
                      placeholder="Symbol"
                      className="w-full"
                      value={vulcanTokens?.symbol}
                      onChange={(e) => {
                        setVulcanTokens({
                          ...vulcanTokens,
                          symbol: e.target.value,
                        });
                      }}
                    />
                    <Input
                      placeholder="Pin"
                      className="w-full"
                      value={vulcanTokens?.pin}
                      onChange={(e) => {
                        setVulcanTokens({
                          ...vulcanTokens,
                          pin: e.target.value,
                        });
                      }}
                    />
                  </>
                )}
              </div>
              <div className="2xl:hidden w-full flex flex-col gap-4">
                <Input
                  placeholder={t("settingsUsername")}
                  value={userData?.username}
                  onChange={(e) => {
                    setUserData({ ...userData, username: e.target.value });
                  }}
                  className="w-full"
                />
                <Input
                  placeholder={t("settingsEmail")}
                  value={userData?.email}
                  type="email"
                  onChange={(e) => {
                    setUserData({ ...userData, email: e.target.value });
                  }}
                  className="w-full"
                />
                <textarea
                  placeholder={t("settingsDescription")}
                  defaultValue={userData?.description}
                  maxLength={300}
                  className="h-full max-h-72 block px-2.5 py-2.5 w-full text-lg text-white bg-transparent rounded-lg border-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600"
                  onChange={(e) => {
                    setUserData({ ...userData, description: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="2xl:flex w-1/2 hidden flex-col gap-4">
            <Input
              placeholder={t("settingsUsername")}
              value={userData?.username}
              onChange={(e) => {
                setUserData({ ...userData, username: e.target.value });
              }}
              className="w-full"
            />
            <Input
              placeholder={t("settingsEmail")}
              value={userData?.email}
              type="email"
              onChange={(e) => {
                setUserData({ ...userData, email: e.target.value });
              }}
              className="w-full"
            />
            <textarea
              placeholder={t("settingsDescription")}
              defaultValue={userData?.description}
              className="h-full block px-2.5 py-2.5 w-full text-lg text-white bg-transparent rounded-lg border-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600"
              onChange={(e) => {
                setUserData({ ...userData, description: e.target.value });
              }}
            />
          </div>
          <Button
            type="default"
            width="2xl:hidden sm:w-1/4 w-full mb-8"
            onClick={saveData}
          >
            <TbDeviceFloppy />
            {t("save")}
          </Button>
        </div>
        <div className="flex gap-4 flex-row">
          <Button
            type="default"
            width="2xl:flex hidden w-1/4 mb-8"
            onClick={saveData}
          >
            <TbDeviceFloppy />
            {t("save")}
          </Button>
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
