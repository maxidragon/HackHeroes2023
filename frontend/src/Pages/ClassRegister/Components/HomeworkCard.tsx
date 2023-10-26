export default function HomeworkCard({ homework }: any) {
  return (
    <div className="w-1/4 h-96" key={homework.id}>
      <div className="w-full h-full px-8 bg-purple-500 rounded-lg flex flex-col justify-between items-center p-2">
        <p className="text-xl">{homework.subject}</p>
        <p className="text-md">{homework.teacher}</p>
        <p className="text-md">{homework.content}</p>
        <p className="text-xs">{"Deadline: " + homework.deadline}</p>
      </div>
    </div>
  );
}
