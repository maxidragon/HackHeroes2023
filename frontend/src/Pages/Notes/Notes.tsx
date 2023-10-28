import { motion, useIsPresent } from "framer-motion";
import { t } from "i18next";
import { useEffect, useState } from "react";
import Search from "./Components/Search";
import toast from "react-hot-toast";
import Loader from "../../Components/Loader";
import MarkdownComponent from "./Components/MarkdownComponent";

interface Note {
  id: number;
  title: string;
  content: string;
  user: {
    id: number;
    username: string;
  };
  category: string;
  createdAt: string;
}

export default function Notes() {
  const isPresent = useIsPresent();
  const [publicity, setPublicity] = useState<string>("Public");
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>();

  useEffect(() => {
    let queryString = "";

    if (category && search) {
      queryString = `?category=${category}&&search=${search}`;
    } else if (category) {
      queryString = `?category=${category}`;
    } else if (search) {
      queryString = `?search=${search}`;
    }

    fetch(
      `${
        import.meta.env.VITE_API_URL
      }/notes/${publicity.toLowerCase()}${queryString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => {
        toast.error("Couldn't fetch notes");
        console.log(err);
      });
  }, [category, publicity, search]);

  const markdownStyling = "flex-1 box-border overflow-y-auto";

  return (
    <div className="flex-1 relative flex flex-col items-center gap-8">
      <h1 className="text-center text-4xl roboto text-white mt-4">
        {t("notesTitle")}
      </h1>
      <Search
        setCategory={setCategory}
        setPublicity={setPublicity}
        setSearch={setSearch}
      />
      {!search && !category && publicity === "Public" && (
        <div className="w-3/5 flex flex-col items-center gap-8 mb-10">
          <h2 className="text-3xl roboto text-white border-b-gray-500 border-b-2 mr-auto">
            The newest notes
          </h2>
          {notes && notes?.length > 0 ? (
            <div className="container w-full h-screen grid grid-cols-5 grid-rows-6 gap-2">
              <div className="col-span-3 row-start-1 gap-8 row-end-5 flex flex-col border-purple-400 border-4 rounded-xl p-4">
                <p className="text-2xl quicksand text-white">{notes[0].title}</p>
                <MarkdownComponent
                  className={markdownStyling}
                  value={notes[0].content}
                />
              </div>
              <div className="col-span-2 row-start-1 row-end-4 gap-8 flex flex-col border-purple-400 border-4 rounded-xl p-4">
                <p className="text-2xl quicksand text-white">{notes[1].title}</p>
                <MarkdownComponent
                  className={markdownStyling}
                  value={notes[1].content}
                />
              </div>
              <div className="col-span-2 row-start-4 row-end-7 gap-8 flex flex-col border-purple-400 border-4 rounded-xl p-4">
                <p className="text-2xl quicksand text-white">{notes[2].title}</p>
                <MarkdownComponent
                  className={markdownStyling}
                  value={notes[2].content}
                />
              </div>
              <div className="col-span-3 row-start-5 row-end-7 gap-8 flex flex-col border-purple-400 border-4 rounded-xl p-4">
                <p className="text-2xl quicksand text-white">{notes[3].title}</p>
                <MarkdownComponent
                  className={markdownStyling}
                  value={notes[3].content}
                />
              </div>
            </div>
          ) : (
            <Loader width="200" />
          )}
        </div>
      )}
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
