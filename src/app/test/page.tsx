"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NBackTask } from "@/components/NBackTask";
import { TrialResult } from "@/types";

const MAIN_TRIALS = 20;

export default function TestPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const participantName = searchParams.get("participantName") || "";
    const nValue = Number(searchParams.get("nValue") || 2);

    const handleFinish = (results: TrialResult[]) => {
        router.push("/finish");
    };

    if (!participantName) {
        router.push("/");
        return null;
    }

    return (
        <div className="mx-auto max-w-3xl">
            <NBackTask
                title={`N-back テスト (N=${nValue})`}
                nValue={nValue}
                trialCount={MAIN_TRIALS}
                participantName={participantName}
                targetRate={0.3}
                localStorageKey="NBACK_RESULTS"
                countdownStart={3}
                onFinish={handleFinish}
            />
        </div>
    );
}
