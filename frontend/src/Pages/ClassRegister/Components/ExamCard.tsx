import { useState } from "react";
import ReactCardFlip from "react-card-flip";
import { TbClick } from "react-icons/tb";
import { Exam } from "../../../lib/interfaces";
import { motion } from "framer-motion";

export default function ExamCard({ exam, index }: { exam: Exam; index: number }) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  function handleClick() {
    setIsFlipped(!isFlipped);
  }

  return (
    <motion.div
      initial={{ opacity: 0, bottom: "-5px" }}
      animate={{
        opacity: 1,
        bottom: 0,
        transition: { duration: 0.2, delay: index * .1 },
      }}
      className="2xl:w-1/5 xl:w-1/4 md:w-1/3 w-full h-72 cursor-pointer"
      onClick={handleClick}
    >
      <ReactCardFlip
        isFlipped={isFlipped}
        flipDirection="horizontal"
        containerClassName="w-full h-full roboto shadow-lg"
      >
        <div className="w-full h-full px-8 grad rounded-lg flex flex-col justify-around items-center">
          <TbClick className="text-2xl absolute top-2 left-2" />
          <p className="text-xl text-center">{exam.subject}</p>
          <p className="text-md">{exam.type}</p>
          <p className="text-sm">{exam.deadline}</p>
        </div>
        <div className="w-full h-full px-8 grad rounded-lg flex flex-col justify-around items-center">
          <TbClick className="text-2xl absolute top-2 left-2" />
          <p className="text-lg text-center">{exam.teacherName}</p>
          <p className="text-lg text-center">
            {exam.description || "Brak opisu"}
          </p>
        </div>
      </ReactCardFlip>
    </motion.div>
  );
}
