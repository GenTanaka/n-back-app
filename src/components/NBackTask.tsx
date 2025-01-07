// src/components/NBackTask.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { TrialResult } from "@/types";
import { generateNBackSequence, getCorrectAnswer } from "@/utils/nback";

const DISPLAY_TIME = 5000;
const FEEDBACK_TIME = 500;
const BLANK_TIME = 500;

type Phase = "countdown" | "showing" | "finished";
type SubPhase = "warmupDisplay" | "displaying" | "feedback" | "blank";

export interface NBackTaskProps {
    title: string;
    nValue: number;
    trialCount: number;
    participantName: string;
    targetRate?: number;
    localStorageKey: string;
    countdownStart?: number;
    onFinish?: (results: TrialResult[]) => void;
}

export const NBackTask: React.FC<NBackTaskProps> = ({
    title,
    nValue,
    trialCount,
    participantName,
    targetRate = 0.3,
    localStorageKey,
    countdownStart = 3,
    onFinish,
}) => {
    const [phase, setPhase] = useState<Phase>("countdown");
    const [countdown, setCountdown] = useState(countdownStart);

    const totalLength = nValue + trialCount;
    const [digits, setDigits] = useState<number[]>([]);
    const [digitIndex, setDigitIndex] = useState(0);
    const [trialIndex, setTrialIndex] = useState(0);

    const [currentDigit, setCurrentDigit] = useState<number | null>(null);
    const [digitColor, setDigitColor] = useState("black");

    const [subPhase, setSubPhase] = useState<SubPhase>("warmupDisplay");
    const [results, setResults] = useState<TrialResult[]>([]);
    const stimulusStartRef = useRef<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (phase === "countdown") {
            setCountdown(countdownStart);
            const id = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(id);
                        startTask();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(id);
        }
    }, [phase, countdownStart]);

    const startTask = () => {
        const arr = generateNBackSequence(nValue, totalLength, targetRate);
        setDigits(arr);
        setDigitIndex(0);
        setTrialIndex(0);
        setPhase("showing");
    };

    useEffect(() => {
        if (phase !== "showing") return;
        if (digitIndex < totalLength) {
            showDigit();
        } else {
            setPhase("finished");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, digitIndex]);

    const showDigit = () => {
        if (digitIndex < nValue) {
            // ウォーミングアップ
            setSubPhase("warmupDisplay");
            setCurrentDigit(digits[digitIndex]);
            setDigitColor("black");

            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setSubPhase("blank");
                timerRef.current = setTimeout(() => {
                    setDigitIndex((prev) => prev + 1);
                }, BLANK_TIME);
            }, DISPLAY_TIME);
        } else {
            // 本番
            if (trialIndex === 0) {
                setTrialIndex(1);
            }
            setSubPhase("displaying");
            setCurrentDigit(digits[digitIndex]);
            setDigitColor("black");
            stimulusStartRef.current = Date.now();

            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                handleTimeout();
            }, DISPLAY_TIME);
        }
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (subPhase !== "displaying") return;
            if (e.key.toLowerCase() === "l") handleAnswer(true);
            if (e.key.toLowerCase() === "a") handleAnswer(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [subPhase]);

    const handleAnswerClick = (val: boolean) => {
        if (subPhase === "displaying") {
            handleAnswer(val);
        }
    };

    const handleTimeout = () => {
        recordAnswer(null, true);
    };

    const handleAnswer = (userSaysSame: boolean) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        recordAnswer(userSaysSame, false);
    };

    const recordAnswer = (userAnswer: boolean | null, isTimeout: boolean) => {
        if (currentDigit === null) return;
        if (trialIndex < 1) return;

        const reactionTime = isTimeout
            ? -1
            : Date.now() - stimulusStartRef.current;

        const correctAns = getCorrectAnswer(nValue, digitIndex, digits);

        let isCorrect = false;
        if (correctAns !== null && userAnswer !== null) {
            isCorrect = userAnswer === correctAns;
        }

        const newResult: TrialResult = {
            answerDateTime: new Date().toISOString(),
            participantName,
            nValue,
            trialNumber: trialIndex,
            reactionTime,
            isCorrect,
            displayedDigit: currentDigit,
            correctAnswer: correctAns,
            userAnswer,
        };
        setResults((prev) => [...prev, newResult]);

        setDigitColor(isCorrect ? "lightgreen" : "red");
        setSubPhase("feedback");
        timerRef.current = setTimeout(() => {
            setSubPhase("blank");
            timerRef.current = setTimeout(() => {
                setDigitIndex((prev) => prev + 1);
                setTrialIndex((prev) => prev + 1);
            }, BLANK_TIME);
        }, FEEDBACK_TIME);
    };

    useEffect(() => {
        if (phase === "finished") {
            localStorage.setItem(localStorageKey, JSON.stringify(results));
            if (onFinish) {
                onFinish(results);
            }
        }
    }, [phase, results, localStorageKey, onFinish]);

    // ---- Tailwindでの色設定を処理するために変換 ----
    const digitStyle = {
        color: digitColor,
    };

    // ===================================
    // レンダリング
    // ===================================
    if (phase === "countdown") {
        return (
            <div className="text-center mt-8 space-y-4">
                <h1 className="text-2xl font-bold">{title} 開始まで</h1>
                <h2 className="text-6xl font-extrabold text-indigo-600">
                    {countdown}
                </h2>
            </div>
        );
    }

    if (phase === "showing") {
        const totalTrials = trialCount;
        const showButtons = subPhase === "displaying";
        const trialText =
            trialIndex >= 1
                ? `試行 ${trialIndex} / ${totalTrials}`
                : `試行前 (${digitIndex + 1}/${nValue})`;

        return (
            <div className="text-center mt-8 space-y-6">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-lg text-gray-700">{trialText}</p>
                <div className="text-7xl font-semibold" style={digitStyle}>
                    {currentDigit !== null ? currentDigit : ""}
                </div>

                {/* {showButtons && ( */}
                <div className="flex justify-center gap-8 mt-4">
                    <button
                        onClick={() => handleAnswerClick(false)}
                        className={`px-6 py-3  text-white font-semibold rounded transition ${
                            showButtons
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-gray-600"
                        }`}
                        disabled={!showButtons}
                    >
                        違う (A)
                    </button>
                    <button
                        onClick={() => handleAnswerClick(true)}
                        className={`px-6 py-3  text-white font-semibold rounded transition ${
                            showButtons
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-600"
                        }`}
                        disabled={!showButtons}
                    >
                        同じ (L)
                    </button>
                </div>
                {/* )} */}
            </div>
        );
    }

    if (phase === "finished") {
        return null; // onFinishで画面遷移するならここでは空
    }

    return null;
};
