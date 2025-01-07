// src/utils/downloadCsv.ts
import { TrialResult } from "@/types";

/**
 * N-backのTrialResult配列をCSVファイルとしてダウンロード
 * @param results N-backの試行データ
 * @param fileName ダウンロードするCSVファイル名
 */
export function downloadNBackCsv(results: TrialResult[], fileName = "nback_results.csv") {
  if (results.length === 0) return;

  const headers = [
    "answerDateTime",
    "participantName",
    "nValue",
    "trialNumber",
    "reactionTime",
    "displayedDigit",
    "correctAnswer",
    "userAnswer",
    "isCorrect",
  ];
  const csvRows = results.map((res) =>
    [
      res.answerDateTime,
      res.participantName,
      res.nValue.toString(),
      res.trialNumber.toString(),
      res.reactionTime.toString(),
      res.displayedDigit.toString(),
      res.correctAnswer === null ? "null" : res.correctAnswer.toString(),
      res.userAnswer === null ? "null" : res.userAnswer.toString(),
      res.isCorrect ? "true" : "false",
    ].join(",")
  );

  const csvContent = [headers.join(","), ...csvRows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
