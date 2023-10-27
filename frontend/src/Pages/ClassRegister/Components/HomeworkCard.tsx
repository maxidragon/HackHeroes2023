import { useState } from "react";
import ReactCardFlip from "react-card-flip";
import { TbClick } from "react-icons/tb";

export default function HomeworkCard({ homework }: any) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  function handleClick() {
    setIsFlipped(!isFlipped);
  }

  return (
    <div className="w-1/5 h-96" key={homework.id} onClick={handleClick}>
      <ReactCardFlip
        isFlipped={isFlipped}
        flipDirection="horizontal"
        containerClassName="w-full h-full roboto"
      >
        <div className="w-full h-full px-8 rounded-lg flex flex-col justify-around items-center grad shadow-lg">
          <TbClick className="text-2xl absolute top-2 left-2"/>
          <p className="text-xl text-center">{homework.subject}</p>
          <p className="text-sm">{"Deadline: " + homework.deadline}</p>
        </div>
        <div className="w-full h-full px-8 rounded-lg flex flex-col justify-around items-center grad shadow-lg">
        <TbClick className="text-2xl absolute top-2 left-2"/>
          <p className="text-lg">{homework.teacher}</p>
          <p className="text-lg text-center">{homework.content}</p>
        </div>
      </ReactCardFlip>
    </div>
  );
}
