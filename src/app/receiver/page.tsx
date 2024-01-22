"use client";
import React, { useState, useEffect } from 'react';
import SimplePeer from 'simple-peer';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import Item from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';


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

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(answerSignal);
        }
        catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };


    return (
        <Box>
            <h1>Receiver</h1>

            <Stack spacing={2} divider = {<Divider orientation='horizontal' flexItem />}>

            <Item>
            <p style={{ fontFamily: 'Trebuchet MS', marginRight: '10px', fontSize: '1rem' }}>The Offer signal sent by the Sender:</p>
            <textarea
                id = "receive Offer"
                value={receivedSignal}
                onChange={(e) => setReceivedSignal(e.target.value)}             
            >
            </textarea>
            <Button onClick={handleReceivedSignal} className='button-style' variant= 'outlined'>Submit</Button>
            </Item>

            <Item>
            <p style={{ fontFamily: 'Trebuchet MS', marginRight: '10px', fontSize: '1rem' }}>Send this Answer signal to the Sender:</p>
            <textarea 
            value = {answerSignal}  
            id='answer-signal'>
            </textarea>
            <Button className='button-style' onClick={copyToClipboard} variant= 'outlined'><ContentCopyRoundedIcon/></Button>
            </Item>

            {/* Display the received file */}
            <Item>
            {receivedFile && fileName && (
                    <>
                    <h3 style={{fontFamily: 'Trebuchet MS'}}>Received File:</h3>
                    <a style={{fontFamily: 'Trebuchet MS', marginLeft: '10px'}} href={URL.createObjectURL(receivedFile)} 
                    download={fileName}>Download Received File</a>
                    </>

            )}
            </Item>
            </Stack>
        </Box>
    );
};

export default Receiver;