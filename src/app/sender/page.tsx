"use client";
import React from 'react';
import { useState } from 'react';
import SimplePeer from 'simple-peer';

export default function Sender() {
    const [message,setMessage] = useState('');
    const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
    const [receiverSignal, setReceiverSignal] = useState<RTCSessionDescriptionInit | null>(null);

    const sendMessage = () => {
        if (peer && (peer as SimplePeer.Instance & { _channel?: RTCDataChannel })._channel?.readyState === 'open') {
            console.log('Sending message:', message);
            peer.send(message);
            setMessage('');
        }else{
            console.log('Peer connection is not established yet or not ready for sending messages');
        }
    };

    const initializePeer = () => {
        try{
            const newPeer = new SimplePeer({ initiator: true, trickle: false });
            
            newPeer.on('signal', data => {
                console.log('Send this signal to the receiver: ', data);
                setReceiverSignal(JSON.stringify(data));
                console.log('Send this signal to the receiver: ', receiverSignal);
            });
            newPeer.on('connect', () => {
                console.log('Peer connection established.');
            });

            setPeer((prevPeer) => {
            // Use the previous peer state to ensure correct updating
            if (prevPeer) {
                prevPeer.destroy();
            }
            return newPeer as SimplePeer.Instance;
            });
        }catch(error){
            console.error('Error in peer connection:', error);
        }
    };


    return (
        <div>
            <h1>Sender</h1>
            <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
            <button onClick={initializePeer}>Initialize Peer</button>                 
        </div>
    );
};


