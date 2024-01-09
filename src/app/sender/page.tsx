// import react from 'react';
// import { useState } from 'react';

// import SimplePeer from 'simple-peer';

// console.log('Peer1->');

// const peer1 = new SimplePeer({ initiator: location.hash === '#1', trickle: false });

// peer1.on('signal', data => {
//     console.log('Peer1->', JSON.stringify(data));
// });

// peer1.on('connect', () => {
//     console.log('Peer1->', 'CONNECT');
//     peer1.send('Peer 1 sending a message');
// }
// );

// peer1.on('data', data => {
//     console.log('Peer1->', 'Received', data);
// }
// );

import react from 'react';
import { useState } from 'react';
export default function Sender() {
    console.log('Peer1');
    return (
        <div>
            <h1>Sender</h1>       
        </div>
    );
}
