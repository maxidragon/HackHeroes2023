import { useState } from "react";
import ReactCardFlip from "react-card-flip";
import { TbClick } from "react-icons/tb";

export default function ExamCard({ exam }: any) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  function handleClick() {
    setIsFlipped(!isFlipped);
  }

  return (
    <div className="w-1/5 h-96" key={exam.id} onClick={handleClick}>
      <ReactCardFlip
        isFlipped={isFlipped}
        flipDirection="horizontal"
        containerClassName="w-full h-full roboto shadow-lg"
      >
        <div className="w-full h-full px-8 grad rounded-lg flex flex-col justify-around items-center p-2">
          <TbClick className="text-2xl absolute top-2 left-2" />
          <p className="text-xl text-center">{exam.subject}</p>
          <p className="text-md">{exam.type}</p>
          <p className="text-sm">{exam.deadline}</p>
        </div>
        <div className="w-full h-full px-8 grad rounded-lg flex flex-col justify-around items-center p-2">
          <TbClick className="text-2xl absolute top-2 left-2" />
          <p className="text-lg">{exam.teacherName}</p>
          <p className="text-lg text-center">{exam.description || "Brak opisu"}</p>
        </div>
      </ReactCardFlip>
    </div>
  );
}
