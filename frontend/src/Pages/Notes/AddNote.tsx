import { motion, useIsPresent } from "framer-motion";
import Input from "../../Components/Input";
import { useRef, useState } from "react";
import Markdown from "markdown-to-jsx";
import remarkGfm from "remark-gfm";
import Button from "../../Components/Button";
import { TbDeviceFloppy } from "react-icons/tb";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddNote() {
  const isPresent = useIsPresent();
  const [isMd, setIsMd] = useState(false);
  const [md, setMd] = useState("# Preview");
  const [category, setCategory] = useState("");
  const [publicity, setPublicity] = useState("PUBLIC");
  const categories = [
    "MATH",
    "ENGLISH",
    "GERMAN",
    "FRENCH",
    "BIOLOGY",
    "CHEMISTRY",
    "PHYSICS",
    "HISTORY",
    "GEOGRAPHY",
    "POLITICS",
    "ECONOMICS",
    "PHILOSOPHY",
    "RELIGION",
    "SPORT",
    "MUSIC",
    "ART",
    "COMPUTER_SCIENCE",
    "OTHER",
  ];
  const navigate = useNavigate();
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  function addNote() {
    if (!titleRef.current?.value || !contentRef.current?.value) {
      toast.error("Please fill all fields");
      return;
    } else if (contentRef.current.value.length < 50) {
      toast.error("Content of the note is too short!");
      return;
    } else if (category === "") {
      toast.error("Please select category");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/notes`, {
      method: "POST",
      body: JSON.stringify({
        title: titleRef.current.value,
        content: contentRef.current.value,
        category: category,
        publicity: publicity,
        isMd: isMd,
      }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 201) {
        toast.success("Note added successfully!");
        setTimeout(() => {
          navigate("/notes");
        }, 750);
      } else {
        toast.error("Something went wrong!");
      }
    });
  }

  return (
    <div className="flex-1 flex flex-col items-center gap-4">
      <h1 className="text-center text-4xl roboto text-white mt-4">New Note</h1>
      <Input
        type="text"
        placeholder="Note title"
        containerClassName="xl:w-1/3 md:w-1/2 w-4/5"
        ref={titleRef}
        max={50}
      />
      <div className="flex items-center 2xl:w-1/5 lg:w-2/5 md:w-3/5 w-4/5 border-2 border-purple-500 rounded-full text-xl text-white roboto overflow-hidden cursor-pointer">
        <p
          className={`w-full text-center ${
            !isMd && "bg-purple-500"
          } transition-all`}
          onClick={() => {
            setIsMd(false);
          }}
        >
          Plain text
        </p>
        <p
          className={`w-full text-center ${
            isMd && "bg-purple-500"
          } transition-all`}
          onClick={() => {
            setIsMd(true);
          }}
        >
          Markdown
        </p>
      </div>
      <div
        className={`h-auto ${
          isMd
            ? "md:w-4/5 w-full px-4 lg:flex-row flex-col"
            : "md:w-3/5 xl:w-2/5 w-full px-4"
        } flex items-center gap-4`}
      >
        <textarea
          placeholder="Note content"
          onChange={(e) => setMd(e.target.value)}
          ref={contentRef}
          className="h-full min-h-[400px] w-full block px-2.5 py-2.5 text-lg text-white bg-transparent rounded-lg border-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600"
        />
        {isMd && (
          <Markdown
            className="h-full min-h-[400px] w-full overflow-y-auto text-left p-2 border-2 rounded-xl border-gray-500"
            remarkPlugins={[remarkGfm]}
            options={{
              overrides: {
                h1: {
                  props: {
                    className:
                      "text-4xl roboto text-white mb-4 border-b-2 border-gray-500",
                  },
                },
                h2: {
                  props: {
                    className:
                      "text-3xl roboto text-white mb-4 border-b-2 border-gray-500",
                  },
                },
                h3: {
                  props: {
                    className:
                      "text-2xl roboto text-white mb-4 border-b-2 border-gray-500",
                  },
                },
                a: {
                  props: {
                    className: "text-blue-500",
                  },
                },
                p: {
                  props: {
                    className: "text-lg text-white",
                  },
                },
                code: {
                  props: {
                    className: "text-lg text-white bg-gray-500 p-1 rounded-lg",
                  },
                },
                ol: {
                  props: {
                    className: "list-decimal list-inside",
                  },
                },
                ul: {
                  props: {
                    className: "list-disc list-inside",
                  },
                },
                li: {
                  props: {
                    className: "text-lg text-white",
                  },
                },
              },
            }}
          >
            {md}
          </Markdown>
        )}
      </div>
      {isMd && (
        <a
          target="_blank"
          href="https://markdownguide.offshoot.io/basic-syntax/"
        >
          How to use markdown?
        </a>
      )}
      <div className="flex items-center flex-col gap-4">
        <p>Select category & publicity</p>
        <div className="flex items-center gap-4">
          <select
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            defaultValue={category}
            className="w-56 capitalize text-center border-2 border-purple-500 bg-bgClr rounded-lg text-xl text-white roboto overflow-hidden cursor-pointer"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() +
                  category.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <select
            defaultValue={publicity}
            onChange={(e) => {
              setPublicity(e.target.value);
            }}
            className="w-56 text-center border-2 border-purple-500 bg-bgClr rounded-xl text-lg text-white roboto overflow-hidden cursor-pointer"
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
            <option value="CLASS">Class</option>
          </select>
        </div>
      </div>
      <Button type="default" className="!text-xl !w-48" onClick={addNote}>
        <TbDeviceFloppy />
        Save
      </Button>
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
