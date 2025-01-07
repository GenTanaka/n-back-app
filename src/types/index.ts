// src/types/index.ts

export type TrialResult = {
    answerDateTime: string;
    participantName: string;
    nValue: number;
    trialNumber: number;
    reactionTime: number;
    isCorrect: boolean;

    displayedDigit: number;
    correctAnswer: boolean | null;
    userAnswer: boolean | null;
};
