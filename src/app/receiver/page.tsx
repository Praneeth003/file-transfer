"use client";
import React, { useState, useEffect } from 'react';
import SimplePeer from 'simple-peer';

const Receiver = () => {
    const [receivedSignal, setReceivedSignal] = useState('');
    const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
    const [receivedFile, setReceivedFile] = useState<Blob | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [answerSignal, setAnswerSignal] = useState('');

    const handleReceivedSignal = () => {
        try {
            const parsedSignal = JSON.parse(receivedSignal);
            console.log('Parsed signal:', parsedSignal);

            const newPeer = new SimplePeer({ trickle: false });

            newPeer.on('signal', data => {
                console.log('Receiver: Send this signal to the sender: ', JSON.stringify(data));
                setAnswerSignal(JSON.stringify(data));
            });

            let receivedFile = new Blob([]);
            let fileInfoReceived = false;

            newPeer.on('data', data => {
                if (!fileInfoReceived) {
                    const fileInfo = JSON.parse(new TextDecoder().decode(data));
                    setFileName(fileInfo.name);
                    fileInfoReceived = true;
                } else {
                    // Append each chunk to the received file
                    receivedFile = new Blob([receivedFile, data]);

                    // Handle progress or any other logic
                    console.log('Received data chunk, current file size:', receivedFile.size);

                    // Update the receivedFile state
                    setReceivedFile(receivedFile);
                }
            });

            newPeer.on('connect', () => {
                console.log('Receiver: Peer connection established.');
            });

            setPeer(newPeer);
            newPeer.signal(parsedSignal);
        } catch (error) {
            console.error('Error parsing received signal:', error);
        }
    };

    return (
        <div>
            <h1>Receiver</h1>

            <input
                type="text"
                value={receivedSignal}
                onChange={(e) => setReceivedSignal(e.target.value)}
                placeholder="Received signal from sender..."
            />
            <button onClick={handleReceivedSignal}>Receive Signal</button>

            <input type='text' value = {answerSignal} placeholder='Answer signal from receiver' ></input>
            
            

            {/* Display the received file */}
            {receivedFile && fileName && (
                <div id='recv-out'>
                    <h3>Received File:</h3>
                    <a href={URL.createObjectURL(receivedFile)} download={fileName}>Download Received File</a>
                </div>
            )}
        </div>
    );
};

export default Receiver;