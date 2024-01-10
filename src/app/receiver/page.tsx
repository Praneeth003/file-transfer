"use client";
import React, { useState, useEffect } from 'react';
import SimplePeer from 'simple-peer';

const Receiver = () => {
    const [receivedSignal, setReceivedSignal] = useState('');
    const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
    const [receivedMessage, setReceivedMessage] = useState('');

    // Function to handle receiving the sender's signal and initiating the peer connection
    const handleReceivedSignal = () => {
          try {
            const parsedSignal = JSON.parse(receivedSignal);
            console.log('Parsed signal:', parsedSignal);

            const newPeer = new SimplePeer({ initiator: false, trickle: false });

            newPeer.on('signal', (data) => {
                console.log('Signal data:', data);
            });

            // Set the signal received from the sender
            newPeer.signal(parsedSignal);

            // Listener for when the peer connection is established
            newPeer.on('connect', () => {
                console.log('Receiver: Peer connection established.');
            });

            // Listener for when a message is received from the sender
            newPeer.on('data', (data) => {
                setReceivedMessage(data.toString());
            });

            setPeer(newPeer);
        } catch (error) {
            console.error('Error parsing received signal:', error);
        }
    };

    return (
        <div>
            <h1>Receiver</h1>

            {/* Assuming you have an input for pasting the sender's signal */}
            <input
                type="text"
                value={receivedSignal}
                onChange={(e) => setReceivedSignal(e.target.value)}
                placeholder="Received signal from sender..."
            />
            <button onClick={handleReceivedSignal}>Receive Signal</button>

            {/* Display the received message */}
            <div>
                <h3>Received Message:</h3>
                <p>{receivedMessage}</p>
            </div>
        </div>
    );
};

export default Receiver;
