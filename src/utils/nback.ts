// src/utils/nback.ts

/**
 * N-back用の数字列を生成するユーティリティ。
 *
 * @param n - Nの値
 * @param length - 総数 (先頭のn個 + 試行回数)
 * @param targetRate - 「同じ」（ターゲット）になる確率(例: 0.3なら30%)
 * @returns 生成した数字列 (length個)
 */
export function generateNBackSequence(
    n: number,
    length: number,
    targetRate: number
): number[] {
    const arr: number[] = [];

    // 先頭 n 個は比較対象なし→ランダム
    for (let i = 0; i < n; i++) {
        arr.push(Math.floor(Math.random() * 10));
    }

    // i >= n は targetRate の確率で「同じ」に
    for (let i = n; i < length; i++) {
        const isTarget = Math.random() < targetRate;
        if (isTarget) {
            // n個前と同じ
            arr[i] = arr[i - n];
        } else {
            // n個前とは違う
            let r = Math.floor(Math.random() * 10);
            while (r === arr[i - n]) {
                r = Math.floor(Math.random() * 10);
            }
            arr[i] = r;
        }
    }

    return arr;
}

/**
 * N個前との比較を行い、正解が「同じ」(true) か「違う」(false) か、比較不可(null)かを返す。
 *
 * @param n - Nの値
 * @param idx - 現在の配列インデックス
 * @param arr - 全体の数字列
 * @returns `true` 同じ, `false` 違う, `null` 比較不可 (idx - n < 0)
 */
export function getCorrectAnswer(
    n: number,
    idx: number,
    arr: number[]
): boolean | null {
    if (idx - n < 0) return null;
    return arr[idx] === arr[idx - n];
}
