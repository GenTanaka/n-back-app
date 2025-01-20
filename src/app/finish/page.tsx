"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrialResult } from "@/types";
import { downloadNBackCsv } from "@/utils/downloadCsv";
// ↑ CSVダウンロードのユーティリティを作ってある想定

export default function FinishPage() {
    const router = useRouter();
    const [results, setResults] = useState<TrialResult[]>([]);
    const [analytics, setAnalytics] = useState<{corr_num:number | null, corr_per:number | null}>({corr_num:null,corr_per:null});

    useEffect(() => {
        const stored = localStorage.getItem("NBACK_RESULTS");
        if (stored) {
            const results_list = JSON.parse(stored) as TrialResult[];
            setResults(results_list);
            const corr_num: number = results_list.filter(result => result.isCorrect).length;
            const total_num: number = results_list.length;

            console.log(corr_num,total_num)
            setAnalytics({
                corr_num: corr_num,
                corr_per: corr_num / total_num * 100,
            })
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
            <div className="flex items-center justify-center">
                <div className="w-40 h-40 border rounded-md mr-4 flex items-center justify-center">
                    <div>
                        <strong className="text-xl">正解数</strong>
                        <div className="text-xl mt-4">{String(analytics.corr_num)}</div>
                    </div>
                </div>
                <div className="w-40 h-40 border rounded-md flex items-center justify-center">
                    <div>
                        <strong className="text-xl">正答率</strong>
                        <div className="text-xl mt-4">{String(analytics.corr_per)+"%"}</div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleDownloadCSV}
                className={`px-5 py-2 rounded text-white font-semibold bg-blue-600 hover:bg-blue-700 transition ${results.length===0 ? "hidden" : ""}`}
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
