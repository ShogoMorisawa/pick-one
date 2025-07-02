export interface Question {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionACount: number;
  optionBCount: number;
}

export const questions: Question[] = [
  {
    id: "2025-07-02", // 今日の日付に合わせておくとテストしやすい
    text: "朝ごはんは、パン？ごはん？",
    optionA: "パン 🍞",
    optionB: "ごはん 🍙",
    optionACount: 120,
    optionBCount: 130,
  },
  {
    id: "2025-07-03",
    text: "きのこの山とたけのこの里、どっちが好き？",
    optionA: "きのこの山 🍄",
    optionB: "たけのこの里🎍",
    optionACount: 120,
    optionBCount: 130,
  },
  {
    id: "2025-07-04",
    text: "休日の過ごし方、インドア派？アウトドア派？",
    optionA: "インドア派 🏠",
    optionB: "アウトドア派 🏕️",
    optionACount: 120,
    optionBCount: 130,
  },
];
