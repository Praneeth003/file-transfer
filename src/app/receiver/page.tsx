"use client";
import React, { useState, useEffect } from 'react';
import SimplePeer from 'simple-peer';

const Receiver = () => {
    const [receivedSignal, setReceivedSignal] = useState('');
    const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
    const [receivedFile, setReceivedFile] = useState<Blob | null>(null);

    const handleReceivedSignal = () => {
        try {
            const parsedSignal = JSON.parse(receivedSignal);
            console.log('Parsed signal:', parsedSignal);

            const newPeer = new SimplePeer({ trickle: false });

            newPeer.on('signal', data => {
                console.log('Receiver: Send this signal to the sender: ', JSON.stringify(data));
            });

            let receivedFile = new Blob([]);

            newPeer.on('data', data => {
                // Append each chunk to the received file
                receivedFile = new Blob([receivedFile, data]);

                // Handle progress or any other logic
                console.log('Received data chunk, current file size:', receivedFile.size);
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

            {/* Assuming there is an input for pasting the sender's signal */}
            <input
                type="text"
                value={receivedSignal}
                onChange={(e) => setReceivedSignal(e.target.value)}
                placeholder="Received signal from sender..."
            />
            <button onClick={handleReceivedSignal}>Receive Signal</button>

            {/* Display the received file */}
            {receivedFile && (
                <div>
                    <h3>Received File:</h3>
                    <a href={URL.createObjectURL(receivedFile)} download="received_file">Download Received File</a>
                </div>
            )}
        </div>
    );
};

export default Receiver;