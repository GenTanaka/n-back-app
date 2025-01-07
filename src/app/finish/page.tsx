"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrialResult } from "@/types";
import { downloadNBackCsv } from "@/utils/downloadCsv";
// ↑ CSVダウンロードのユーティリティを作ってある想定

export default function FinishPage() {
    const router = useRouter();
    const [results, setResults] = useState<TrialResult[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("NBACK_RESULTS");
        if (stored) {
            setResults(JSON.parse(stored) as TrialResult[]);
        }
    }, []);

    const handleDownloadCSV = () => {
        if (!results.length) return;
        downloadNBackCsv(results, "nback_results.csv");
    };

    return (
        <div className="mt-8 text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">テスト終了</h1>
            <p className="text-gray-600">お疲れさまでした！</p>

            <button
                onClick={handleDownloadCSV}
                className="px-5 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
                CSV ダウンロード
            </button>

            <div>
                <button
                    onClick={() => router.push("/")}
                    className="mt-4 px-5 py-2 rounded bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition"
                >
                    トップへ戻る
                </button>
            </div>
        </div>
    );
}
