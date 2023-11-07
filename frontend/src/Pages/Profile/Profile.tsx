import { motion, useIsPresent } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AvatarComponent from "../../Components/AvatarComponent";
import { TbSettingsFilled } from "react-icons/tb";
import toast from "react-hot-toast";
import { useAtomValue } from "jotai";
import { userAtom } from "../../Atoms";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/navigation";
import { Note } from "../../lib/interfaces";
import Loader from "../../Components/Loader";
import MarkdownComponent from "../Notes/Components/MarkdownComponent";
import { t } from "i18next";

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
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    const fetchBanner = async () => {
      fetch(`${import.meta.env.VITE_API_URL}/user/settings/banner/${userId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status >= 400) {
            toast.error("Something went wrong!");
            navigate(`/profile/${userId}`);
          } else {
            res.blob().then((data) => {
              if (data.size === 0) return;
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
      fetch(`${import.meta.env.VITE_API_URL}/user/${userId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
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

    const fetchNotes = async () => {
      setIsFetching(true);
      fetch(`${import.meta.env.VITE_API_URL}/notes/user/${userId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status >= 400) {
            toast.error("Something went wrong!");
          } else {
            res.json().then((data) => {
              setUserNotes(data);
            });
          }
        })
        .catch((err) => {
          toast.error("Something went wrong!");
          console.log(err);
          navigate("/");
        });
      setIsFetching(false);
    };

    fetchBanner();
    fetchData();
    fetchNotes();
  }, []);

  return (
    <div className="flex-1">
      <div
        className={`flex items-center justify-center relative p-4 h-2/5`}
        style={{
          background: banner
            ? `url('${banner}') no-repeat center center, linear-gradient(45deg, #7100db 0%, #ba64cf 60%)`
            : "linear-gradient(45deg, #7100db 0%, #ba64cf 60%)",
        }}
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
            <TbSettingsFilled className="absolute right-4 top-4 cursor-pointer text-gray-100 drop-shadow-[0px_0px_8px_rgba(0,0,0,1)] hover:text-purple-400 hover:rotate-90 text-2xl transition-all" />
          </Link>
        )}
      </div>
      <div className="h-3/5 flex items-center md:flex-row flex-col">
        <div className="h-full md:w-1/2 w-full xl:text-2xl md:text-xl quicksand box-border p-8 text-gray-400">
          <p className="text-4xl capitalize text-gray-100">
            {userData?.firstName} {userData?.lastName}
          </p>
          <p className="mt-4">
            {userData?.description || t("noDescriptionYet")}
          </p>
        </div>
        <div className="hidden md:block w-1 h-[90%] bg-bgLght rounded-full" />
        <div className="h-full md:w-1/2 w-full p-4 box-border items-center justify-center flex flex-col gap-4">
          <p className="text-2xl text-white text-center">{t("topNotes")}</p>
          {isFetching ? (
            <Loader width="200" />
          ) : userNotes.length > 0 ? (
            <Swiper
              className="h-full w-full mySwiper relative"
              grabCursor={true}
              navigation={true}
              effect={"creative"}
              creativeEffect={{
                prev: {
                  shadow: true,
                  origin: "left center",
                  translate: ["-5%", 0, -200],
                  rotate: [0, 100, 0],
                },
                next: {
                  origin: "right center",
                  translate: ["5%", 0, -200],
                  rotate: [0, -100, 0],
                },
              }}
              modules={[EffectCreative, Navigation]}
            >
              {userNotes.map((note) => (
                <SwiperSlide
                  key={note.id}
                  className="w-full h-full flex flex-col items-center gap-2 border-2 shadow-xl border-purple-400 bg-bgClr rounded-xl p-4"
                >
                  <h2 className="text-3xl roboto text-white text-center break-words">
                    {note.category}
                  </h2>
                  <h2 className="w-full text-center text-white break-words">
                    {t("title")}: "{note.title}"
                  </h2>
                  <MarkdownComponent
                    value={note.content}
                    className="overflow-y-auto text-lg text-white break-words"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-2xl text-white">{t("noNotes")}</p>
          )}
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
