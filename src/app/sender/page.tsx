"use client";
import React from 'react';
import { useState } from 'react';
import SimplePeer from 'simple-peer';

export default function Sender() {
    const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
    const [receivedSignal, setReceivedSignal] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const initializePeer = () => {
        try {
            const newPeer = new SimplePeer({ initiator: true, trickle: false });

            newPeer.on('signal', data => {
                console.log('Send this signal to the receiver: ', JSON.stringify(data));
            });

            setPeer(newPeer);
        } catch (error) {
            console.error('Failed to initialize peer:', error);
        }
    };

    const handleReceivedSignal = () => {
        try {
            const parsedSignal = JSON.parse(receivedSignal);
            console.log('Parsed signal:', parsedSignal);
            if (peer && parsedSignal) {
                peer.signal(parsedSignal);
            }
        } catch (error) {
            console.error('Error parsing received signal:', error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const sendFile = () => {
        if (peer && file) {
            const CHUNK_SIZE = 1024 * 1024;
            let offset = 0;
            const reader = new FileReader();

            reader.onload = (event) => {
                if (event.target && event.target.result) {
                    peer.send(event.target.result as ArrayBuffer);

                    offset += CHUNK_SIZE;

                    if (offset < file.size) {
                        reader.readAsArrayBuffer(file.slice(offset, offset + CHUNK_SIZE));
                    } else {
                        console.log('File transfer complete.');
                    }
                }
            };

            reader.readAsArrayBuffer(file.slice(0, CHUNK_SIZE));
        } else {
            console.log('Select a file and initialize peer connection before sending.');
        }
    };

    return (
        <div>
            <button onClick={initializePeer}>Initialize Peer</button>
            <input value={receivedSignal} onChange={(e) => setReceivedSignal(e.target.value)} type="text" placeholder="Paste received signal here" />
            <button onClick={handleReceivedSignal}>Submit Received Signal</button>
            <input type="file" onChange={handleFileChange} />
            <button onClick={sendFile}>Send File</button>
        </div>
    );
}