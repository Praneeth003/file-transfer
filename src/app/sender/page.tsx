"use client";
import React from 'react';
import { useState } from 'react';
import SimplePeer from 'simple-peer';

export default function Sender() {
    const [message, setMessage] = useState('');
    const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
    // const [receiverSignal, setReceiverSignal] = useState<RTCSessionDescriptionInit | null>(null);
    const [receivedSignal, setReceivedSignal] = useState('');

    const sendMessage = () => {
        if (peer && (peer as SimplePeer.Instance & { _channel?: RTCDataChannel })._channel?.readyState === 'open') {
            console.log('Sending message:', message);
            peer.send(message);
            setMessage('');
        } else {
            console.log('Peer connection is not established yet or not ready for sending messages');
        }
    };

    const initializePeer = () => {
        try {
            const newPeer = new SimplePeer({ initiator: true, trickle: false });

            newPeer.on('signal', data => {
                console.log('Send this signal to the receiver: ', JSON.stringify(data));
                // setReceiverSignal(JSON.stringify(data));
                // console.log('Send this signal to the receiver: ', receiverSignal);
            });

            setPeer(newPeer);
        } catch (error) {
            console.error('Failed to initialize peer:', error);
        }
    };

    const handleReceivedSignal = () => {
        const parsedSignal = JSON.parse(receivedSignal);
        
        if (peer) {
            peer.signal(parsedSignal);
        }
    };

    return (
        <div>
            <input value={message} onChange={(e) => setMessage(e.target.value)} type="text" placeholder="Type a message" />
            <button onClick={sendMessage}>Send Message</button>
            <button onClick={initializePeer}>Initialize Peer</button>
            <input value={receivedSignal} onChange={(e) => setReceivedSignal(e.target.value)} type="text" placeholder="Paste received signal here" />
            <button onClick={handleReceivedSignal}>Submit Received Signal</button>
        </div>
    );
}