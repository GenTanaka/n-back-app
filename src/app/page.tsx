"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const [participantName, setParticipantName] = useState("");
    const [nValue, setNValue] = useState(2);

    const router = useRouter();

    const handleStartTest = () => {
        if (!participantName) {
            alert("参加者名を入力してください。");
            return;
        }
        router.push(
            `/test?participantName=${encodeURIComponent(
                participantName
            )}&nValue=${nValue}`
        );
    };

    const handleTutorial = () => {
        // もしチュートリアルでも参加者名が必要ならクエリに含める
        // router.push(`/tutorial?participantName=${encodeURIComponent(participantName)}`);
        // N=1固定なら不要
        router.push("/tutorial");
    };

    return (
        <div className="text-center mt-16">
            <h1 className="text-4xl font-bold mb-12">N-back テスト</h1>

            <div className="mb-5">
                <label className="font-bold mr-3">参加者名: </label>
                <input
                    type="text"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 p-2.5"
                />
            </div>

            <div className="mb-5">
                <label className="font-bold mr-3">N の数: </label>
                <input
                    type="number"
                    min={1}
                    value={nValue}
                    onChange={(e) => setNValue(Number(e.target.value))}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 p-2.5"
                />
            </div>

            <div className="mb-5">
                <button onClick={handleStartTest} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">テストを始める</button>
            </div>

            <hr style={{ width: "50%", margin: "20px auto" }} />

            <div className="mb-5">
                <button onClick={handleTutorial} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">チュートリアルをやる</button>
            </div>
        </div>
    );
}
