import './App.css';

import { ethers } from 'ethers';
import React, { FC, useEffect, useState } from 'react';

import artifact from './abi/TodoList.json';

type Task = {
    id: string;
    content: string;
    isCompleted: boolean;
};

const useContent = (contract: ethers.Contract) => {
    const { taskCount, tasks } = contract.functions;
    const [taskContValue, setTaskCountValue] = useState<string>("");
    const [tasksValue, setTasksValue] = useState<Task[]>([]);

    useEffect(() => {
        const getTasks = async () => {
            const _taskCount = await taskCount();
            setTaskCountValue(_taskCount);

            const _tasks = [];
            for (let i = 1; i <= _taskCount; i++) {
                const _task = await tasks(i);
                _tasks.push({
                    ..._task,
                    id: i,
                });
            }
            setTasksValue(_tasks);
        };
        getTasks();
    }, []);

    return {
        taskCount: taskContValue,
        tasks: tasksValue,
    };
};

type ContentProps = {
    contract: ethers.Contract;
};

const Content: FC<ContentProps> = ({ contract }) => {
    const { taskCount, tasks } = useContent(contract);
    return (
        <div>
            <p>{`taskCount ... ${taskCount}`}</p>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Content</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((t, index) => (
                        <tr key={`task.${index}`}>
                            <td>{t.id}</td>
                            <td>{t.content}</td>
                            <td>
                                {t.isCompleted ? "Completed" : "Not Completed"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract: ethers.Contract = new ethers.Contract(
        contractAddress,
        artifact.abi,
        provider
    );
    return (
        <div>
            <h1>Hello, TodoList Contract.</h1>
            <Content contract={contract} />
        </div>
    );
}

export default App;
