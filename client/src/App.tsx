import './App.css';

import { ethers } from 'ethers';
import React, { FC, useEffect, useState } from 'react';

import artifact from './abi/TodoList.json';

// type Task = {
//     id: string;
//     content: string;
//     isCompleted: boolean;
// };

const useContent = (contract: ethers.Contract) => {
    const { taskCount } = contract.functions;
    const [taskContValue, setTaskCountValue] = useState<string>("");
    useEffect(() => {
        const getTaskCount = async () => {
            const _taskCount = await taskCount();
            setTaskCountValue(_taskCount);
        };
        getTaskCount();
    }, []);

    return {
        taskCount: taskContValue,
    };
};

type ContentProps = {
    contract: ethers.Contract;
};

const Content: FC<ContentProps> = ({ contract }) => {
    const { taskCount } = useContent(contract);
    return <p>{`taskCount ... ${taskCount}`}</p>;
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
