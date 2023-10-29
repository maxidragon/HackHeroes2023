import { Grade } from "./interfaces";

export const calculateWeightedAverage = (grades: Grade[]) => {
  let sumWeights = 0;
  let weightedSum = 0;

  for (const grade of grades) {
    const numericGrade = parseFloat(grade.grade);
    if (!isNaN(numericGrade)) {
      weightedSum += numericGrade * grade.weight;
      sumWeights += grade.weight;
    }
  }

  if (sumWeights === 0) {
    return 0;
  }

  const weightedAverage = weightedSum / sumWeights;
  return weightedAverage;
};
