"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { NBackTask } from "@/components/NBackTask";

export default function TutorialPage() {
    const router = useRouter();

    const handleFinish = () => {
        router.push("/finish");
    };

    return (
        <div className="mx-auto max-w-3xl">
            {/* チュートリアルの場合はN=1, trialCount=5 */}
            <NBackTask
                title="チュートリアル (N=1)"
                nValue={1}
                trialCount={10}
                participantName="(チュートリアル)"
                targetRate={0.5}
                localStorageKey="NBACK_TUTORIAL_RESULTS"
                countdownStart={3}
                onFinish={handleFinish}
            />
        </div>
    );
}
