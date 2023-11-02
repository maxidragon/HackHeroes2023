interface ProgressBarProps {
  progress: number;
  display: boolean;
  className?: string;
}

export default function ProgressBar({ progress, className, display }: ProgressBarProps) {

  const styleWidthArr = [
    {
      percentage: 33.3,
      style: "w-1/3"
    },
    {
      percentage: 25,
      style: "w-1/4"
    },
    {
      percentage: 50,
      style: "w-1/2"
    },
    {
      percentage: 75,
      style: "w-3/4"
    },
    {
      percentage: 100,
      style: "w-full"
    },
    {
      percentage: 20,
      style: "w-1/5"
    },
    {
      percentage: 40,
      style: "w-2/5"
    },
    {
      percentage: 60,
      style: "w-3/5"
    },
    {
      percentage: 80,
      style: "w-4/5"
    },
    {
      percentage: 16.6,
      style: "w-1/6"
    },
    {
      percentage: 66.6,
      style: "w-4/6"
    },
    {
      percentage: 83.3,
      style: "w-5/6"
    },
    {
      percentage: 8.3,
      style: "w-1/12"
    },
    {
      percentage: 41.3,
      style: "w-5/12"
    },
    {
      percentage: 58.3,
      style: "w-7/12"
    },
    {
      percentage: 91.6,
      style: "w-11/12"
    }
  ];

  const findNearestPercentage = (percentage: number) => {

    let smallestDiffIndex = 0;
    let smallestDiff = Math.abs(styleWidthArr[0].percentage - percentage);

    styleWidthArr.forEach((el, index) => {
      if (Math.abs(el.percentage - percentage) < smallestDiff) {
        smallestDiff = Math.abs(el.percentage - percentage);
        smallestDiffIndex = index;
      }
    });

    return smallestDiffIndex;
  };

  const width = styleWidthArr[findNearestPercentage(progress)].style;

  const defaultStyle = `${width} text-center rounded-full font-bold p-1 bg-violet-500 shadow`;

  return (
    <div className="w-full p-2 rounded-full bg-blue-950 shadow-2xl">
      <p className={`${defaultStyle} ${className}`}>{display ? `${progress}%` : ""}</p>
    </div>
  );
}