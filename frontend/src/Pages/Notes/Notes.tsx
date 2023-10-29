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
import { Note } from "../../lib/interfaces";


export default function Notes() {
  const isPresent = useIsPresent();
  const user = useAtomValue(userAtom);
  const [publicity, setPublicity] = useState<string>("Public");
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [totalNotes, setTotalNotes] = useState<number>(0);

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
      `${import.meta.env.VITE_API_URL
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
        setNotes(data.data);
        setTotalNotes(data.count);
        setIsFetching(false);
      })
      .catch((err) => {
        toast.error(t('errorNotes'));
        console.log(err);
        setIsFetching(false);
      });
  }, [category, publicity, search]);

  function deleteNote(id: number) {
    if (!confirm(t('deleteNoteConfirm'))) return;

    fetch(`${import.meta.env.VITE_API_URL}/notes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then(() => {
        setNotes((prev) => prev?.filter((note) => note.id !== id));
        toast.success(t('noteDeleted'));
      })
      .catch((err) => {
        toast.error(t('errorDeleteNote'));
        console.log(err);
      });
  }

  const handleFetchMoreNotes = () => {
    setIsFetching(true);
    fetch(
      `${import.meta.env.VITE_API_URL
      }/notes/${publicity.toLowerCase()}?offset=${notes?.length}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    ).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setNotes((prev) => [...prev!, ...data.data]);
          setTotalNotes(data.count);
          setIsFetching(false);
        });
      } else {
        toast.error(t('errorNotes'));
        setIsFetching(false);
      }
    });
  };

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
            {t("latestNotes")}
          </h2>
          {notes && notes?.length > 3 ? (
            <div className="container w-full h-screen grid grid-cols-5 grid-rows-6 gap-2">
              <div className="shadow-xl col-span-3 row-start-1 gap-4 row-end-5 flex flex-col border-purple-400 border-4 rounded-xl p-4">
                <p className="text-2xl roboto text-white">
                  {notes[0].category}
                </p>
                <h2 className="w-full text-left text-white break-words">
                  {t('title')}: "{notes[0].title}"
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
                  {t('title')}: "{notes[1].title}"
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
                  {t('title')}: "{notes[2].title}"
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
                  {t('title')}: "{notes[3].title}"
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
            <p className="text-2xl text-white roboto">{t('noNotes')}</p>
          )}
        </div>
      )}
      <h2 className="text-3xl roboto text-white lg:flex hidden">{t('allNotes')}</h2>
      <div className="xl:w-3/5 w-full px-4 flex justify-evenly flex-wrap items-center gap-8 mb-10">
        {notes && notes.length > 0 ? (
          <>
            {notes.map((note: Note) => (
              <div
                key={note.id}
                className="md:w-2/5 w-2/3 max-[500px]:w-full flex flex-col items-center gap-2 border-2 shadow-xl lg:border-gray-400 border-purple-400 h-[30rem] rounded-xl p-4"
              >
                <h2 className="text-3xl roboto text-white text-center break-words">
                  {note.category}
                </h2>
                <h2 className="w-full text-center text-white break-words">
                  {t('title')}: "{note.title}"
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
                      {t('edit')}
                    </Button>
                    <Button
                      type="alt"
                      className="ml-4"
                      onClick={() => deleteNote(note.id)}
                    >
                      <TbTrash />
                      {t('delete')}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </>
        ) : isFetching ? (
          <Loader width="200" />
        ) : (
          <p className="text-2xl text-white roboto">{t('noNotes')}</p>
        )}
      </div>
      <div className="flex flex-col items-center gap-4 mb-3">
        {notes && notes.length < totalNotes && (
          <Button type="default" onClick={handleFetchMoreNotes}>
            {t('moreNotes')}
          </Button>
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
