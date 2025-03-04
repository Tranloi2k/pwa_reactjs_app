// src/App.tsx
import { useState } from 'react';

const WebWorker = () => {
    const [result, setResult] = useState<number | null>(null);
    const [number, setNumber] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const handleCalculate = () => {
        setLoading(true);
        const worker = new Worker(new URL('../../worker/testWorker.ts', import.meta.url));

        worker.onmessage = (e: MessageEvent) => {
            setResult(e.data); // Nhận kết quả từ worker
            setLoading(false);
            worker.terminate(); // Dừng worker khi hoàn thành
        };
        worker.postMessage(number); // Gửi số đến worker
    };

    return (
        <div>
            <h1>Web Worker Example update</h1>
            <input
                type="number"
                value={number}
                onChange={(e) => setNumber(Number(e.target.value))}
            />
            <button onClick={handleCalculate} disabled={loading}>
                {loading ? 'Calculating...' : 'Calculate'}
            </button>
            {result !== null && <h2>Result: {result}</h2>}
        </div>
    );
};

export default WebWorker;