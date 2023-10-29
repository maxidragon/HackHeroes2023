import { motion, useIsPresent } from "framer-motion";
import { t } from "i18next";
import { useEffect, useState } from "react";
import Search from "./Components/Search";
import toast from "react-hot-toast";
import Loader from "../../Components/Loader";
import MarkdownComponent from "./Components/MarkdownComponent";
import { userAtom } from "../../Atoms";
import { useAtomValue } from "jotai";
import Button from "../../Components/Button";
import { TbEdit, TbTrash } from "react-icons/tb";

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
  const user = useAtomValue(userAtom);
  const [publicity, setPublicity] = useState<string>("Public");
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    setIsFetching(true);
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
      .then((data) => {
        setNotes(data);
        setIsFetching(false);
      })
      .catch((err) => {
        toast.error("Couldn't fetch notes");
        console.log(err);
        setIsFetching(false);
      });
  }, [category, publicity, search]);

  function deleteNote(id: number) {
    if (!confirm("Are you sure you want to delete this note?")) return;

    fetch(`${import.meta.env.VITE_API_URL}/notes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then(() => {
        setNotes((prev) => prev?.filter((note) => note.id !== id));
        toast.success("Note deleted");
      })
      .catch((err) => {
        toast.error("Couldn't delete note");
        console.log(err);
      });
  }

  const markdownStyling =
    "flex-1 w-full overflow-x-hidden box-border overflow-y-auto text-lg text-white break-words";

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
        <div className="xl:w-3/5 w-4/5 lg:flex hidden flex-col items-center gap-8 mb-10">
          <h2 className="text-3xl roboto text-white mr-auto">
            The newest notes
          </h2>
          {notes && notes?.length > 3 ? (
            <div className="container w-full h-screen grid grid-cols-5 grid-rows-6 gap-2">
              <div className="shadow-xl col-span-3 row-start-1 gap-4 row-end-5 flex flex-col border-purple-400 border-4 rounded-xl p-4">
                <p className="text-2xl roboto text-white">
                  {notes[0].category}
                </p>
                <h2 className="w-full text-left text-white break-words">
                  Title: "{notes[0].title}"
                </h2>
                <MarkdownComponent
                  className={markdownStyling}
                  value={notes[0].content}
                />
              </div>
              <div className="shadow-xl col-span-2 row-start-1 row-end-4 gap-4 flex flex-col border-purple-400 border-4 rounded-xl p-4">
                <p className="text-2xl roboto text-white">
                  {notes[1].category}
                </p>
                <h2 className="w-full text-left text-white break-words">
                  Title: "{notes[1].title}"
                </h2>
                <MarkdownComponent
                  className={markdownStyling}
                  value={notes[1].content}
                />
              </div>
              <div className="shadow-xl col-span-2 row-start-4 row-end-7 gap-4 flex flex-col border-purple-400 border-4 rounded-xl p-4">
                <p className="text-2xl roboto text-white">
                  {notes[2].category}
                </p>
                <h2 className="w-full text-left text-white break-words">
                  Title: "{notes[2].title}"
                </h2>
                <MarkdownComponent
                  className={markdownStyling}
                  value={notes[2].content}
                />
              </div>
              <div className="shadow-xl col-span-3 row-start-5 row-end-7 gap-4 flex flex-col border-purple-400 border-4 rounded-xl p-4">
                <p className="text-2xl roboto text-white">
                  {notes[3].category}
                </p>
                <h2 className="w-full text-left text-white break-words">
                  Title: "{notes[3].title}"
                </h2>
                <MarkdownComponent
                  className={markdownStyling}
                  value={notes[3].content}
                />
              </div>
            </div>
          ) : isFetching ? (
            <Loader width="200" />
          ) : (
            <p className="text-2xl text-white roboto">No notes to display</p>
          )}
        </div>
      )}
      <h2 className="text-3xl roboto text-white lg:flex hidden">All notes</h2>
      <div className="xl:w-3/5 w-full px-4 flex justify-evenly flex-wrap items-center gap-8 mb-10">
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              className="md:w-2/5 w-2/3 max-[500px]:w-full flex flex-col items-center gap-2 border-2 shadow-xl lg:border-gray-400 border-purple-400 h-[30rem] rounded-xl p-4"
            >
              <h2 className="text-3xl roboto text-white text-center break-words">
                {note.category}
              </h2>
              <h2 className="w-full text-center text-white break-words">
                Title: "{note.title}"
              </h2>
              <MarkdownComponent
                className={markdownStyling}
                value={note.content}
              />
              {user.id === note.user.id && (
                <div className="flex w-full justify-end">
                  <Button
                    type="alt"
                    isLink={true}
                    to={`/notes/edit/${note.id}`}
                  >
                    <TbEdit />
                    Edit
                  </Button>
                  <Button
                    type="alt"
                    className="ml-4"
                    onClick={() => deleteNote(note.id)}
                  >
                    <TbTrash />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : isFetching ? (
          <Loader width="200" />
        ) : (
          <p className="text-2xl text-white roboto">No notes to display</p>
        )}
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
