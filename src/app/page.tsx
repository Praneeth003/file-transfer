import React from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';

const Page = () => {
  return (
    <div>
      <h1 id='homeH1'>File Transfer</h1>
      <div id='inside-div'>
      <Link href="/sender">
      <Button variant="outlined" size = "large" className="button-style-home" sx={{fontWeight: 'bold', fontSize: '1.5rem'}}>
        Sender
        </Button>
      </Link>
      <Link href="/receiver">
      <Button variant="outlined" size = "large" className = "button-style-home" sx={{fontWeight: 'bold'}}> 
            Receiver</Button>
      </Link>
      </div>
    </div>
  );
};

export default Page;