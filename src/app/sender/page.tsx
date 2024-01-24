"use client";
import React from 'react';
import { useState } from 'react';
import SimplePeer from 'simple-peer';
import Button from '@mui/material/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Item from '@mui/material/ListItem';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import Divider from '@mui/material/Divider';

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
                console.log('Sender: Peer connection established.');
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
        <Box>
            <h1>Sender</h1>
            <Stack spacing={2} divider = {<Divider orientation='horizontal' flexItem />}>

            <Item>   
            <Button style={{marginLeft: 0}} className = "button-style" onClick={initializePeer} variant= 'outlined'>Initiate Peer Connection</Button>
            </Item>

            <Item>  
            <p style={{ fontFamily: 'Trebuchet MS', marginRight: '10px', fontSize: '1rem' }}>Send this Offer signal to the Receiver:</p>         
            <textarea value={sendOffer} id="sendOffer"></textarea>
            <Button className = "button-style" onClick={copyToClipboard} variant='outlined'><ContentCopyRoundedIcon/></Button>
            </Item>


            <Item>
            <p style={{ fontFamily: 'Trebuchet MS', marginRight: '10px', fontSize: '1rem' }}>The Answer signal from the Receiver:</p>
            <textarea 
            value={receivedSignal} 
            onChange={(e) => setReceivedSignal(e.target.value)}  
            id = "receivedSiganl">
            </textarea>
            <Button className = "button-style" onClick={handleReceivedSignal} variant='outlined'>Connect</Button>
            </Item>


            <Item>
            <p style={{ fontFamily: 'Trebuchet MS' }} >Browse File</p>
            <Button 
            variant="outlined" 
            component="label" 
            className = "button-style"
            >
            <AttachFileIcon fontSize = "small" /> File
            <input 
                type="file" 
                hidden // Hide the default file input
                onChange={handleFileChange} 
            />
            </Button>
            {file && <p style={{marginLeft: '10px'}}> {file.name}</p>}
            </Item>

            <Item>
            <Button className = 'button-style' onClick={sendFile} variant='outlined'><FileUploadIcon/>Send File</Button>
            </Item>
            </Stack>
        </Box>
    );
}