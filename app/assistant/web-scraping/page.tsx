"use client";
import { useState } from 'react';
import axios from 'axios';

export default function Scrape() {
    const [taskID, setTaskID] = useState('');
    const [progress, setProgress] = useState('Not started');
    const [error, setError] = useState('');

    const handleScrape = async () => {
        try {
            const response = await axios.post('http://localhost:5000/start-scrape', { url: 'https://www.android.com/' });
            setTaskID(response.data.task_id);
            setProgress('0%');  // Initial progress
            pollProgress(response.data.task_id);
        } catch (err) {
            setError('Failed to start scraping: ' + err.message);
        }
    };

    const pollProgress = (taskId) => {
        const interval = setInterval(async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/task-progress/${taskId}`);
                if (data.progress !== undefined) {
                    setProgress(`${data.progress}%`);
                    if (data.progress === 100) {
                        clearInterval(interval);
                        setProgress('Completed');
                    }
                } else {
                    throw new Error(data.error || 'Unknown error');
                }
            } catch (err) {
                clearInterval(interval);
                setError('Error fetching progress: ' + err.message);
            }
        }, 2000);
    };

    return (
        <div>
            <h1>Web Scrape</h1>
            {error && <p>Error: {error}</p>}
            <button onClick={handleScrape}>Start Scraping</button>
            <p>Task ID: {taskID}</p>
            <p>Progress: {progress}</p>
        </div>
    );
}
