"use client";
import React from 'react';
import { useState } from 'react';
import SimplePeer from 'simple-peer';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';

export default function Sender() {
    const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
    const [receivedSignal, setReceivedSignal] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [sendOffer, setSendOffer] = useState('');

    const initializePeer = () => {
        try {
            const newPeer = new SimplePeer({ initiator: true, trickle: false });

            newPeer.on('signal', data => {
                setSendOffer(JSON.stringify(data));
                // console.log('Send this signal to the receiver: ', sendOffer);
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
            const CHUNK_SIZE = 16384;
            let offset = 0;
            const reader = new FileReader();

            // Record the start time
            const startTime = Date.now();

            reader.onload = (event) => {
                if (event.target && event.target.result) {

                    // Send file info (name and type) before sending the file data
                    if (offset === 0) {
                    peer.send(JSON.stringify({ name: file.name, type: file.type }));
                }
                    peer.send(event.target.result as ArrayBuffer);

                    offset += CHUNK_SIZE;

                    if (offset < file.size) {
                        reader.readAsArrayBuffer(file.slice(offset, offset + CHUNK_SIZE));
                    } else {
                        // Record the end time and calculate the difference
                        const endTime = Date.now();
                        const timeTaken = (endTime - startTime) / 1000; // in seconds
                        console.log(`File transfer complete. Time taken: ${timeTaken} seconds.`);
                    }
                }
            };

            reader.readAsArrayBuffer(file.slice(0, CHUNK_SIZE));
        } else {
            console.log('Select a file and initialize peer connection before sending.');
        }
    };

    const copyToClipboard = async () => {
        try{
            await navigator.clipboard.writeText(sendOffer);
            console.log('Offer copied to clipboard');
        } catch (error) {
            console.error('Error copying offer to clipboard:', error);
        }
    };

    return (
        <div>
            <h1>Sender</h1>
            <Button onClick={initializePeer} variant= 'outlined'>Initiate Peer Connection</Button>

            
            <label htmlFor = "sendOffer">Copy the Offer and send it to the Receiver</label>
            <textarea value={sendOffer} id="sendOffer"></textarea>
            <Button onClick={copyToClipboard} variant='outlined'>Copy to Clipboard</Button>


            <label htmlFor="receivedSignal">Paste the Answer from the Receiver</label>
            <textarea 
            value={receivedSignal} 
            onChange={(e) => setReceivedSignal(e.target.value)}  
            id = "receivedSiganl">
            </textarea>
            <Button onClick={handleReceivedSignal} variant='outlined'>Submit Received Signal</Button>

            {/* <label htmlFor="file">Select a file to send</label>
            <input type="file" onChange={handleFileChange}/> */}

            <label htmlFor="file">Select a file to send</label>
            <Button 
            variant="outlined" 
            component="label" // Make the Button act as a label
            >
            Upload File
            <input 
                type="file" 
                hidden // Hide the default file input
                onChange={handleFileChange} 
            />
            </Button>
            <p>Selected file: {file?.name}</p>

            <Button onClick={sendFile} variant='outlined'>Send File</Button>
        </div>
    );
}