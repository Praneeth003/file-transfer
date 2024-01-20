import React from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';

const Page = () => {
  return (
    <div>
      <h1 id='homeH1'>File Transfer</h1>
      <div id='inside-div'>
      <Link href="/sender">
      <Button variant="outlined" size = "large"  
            sx={{ 
              borderColor: 'black', 
              color: '#000000',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              fontFamily: 'Trebuchet MS',
              textTransform: 'capitalize',
              '&:hover': { 
                  backgroundColor: 'gray',
                  color: '#ffffff',
                }, 
            }} >
        Sender
        </Button>
      </Link>
      <Link href="/receiver">
      <Button variant="outlined" size = "large"  
            sx={{ 
              borderColor: 'black', 
              color: '#000000',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              fontFamily: 'Trebuchet MS',
              textTransform: 'capitalize',
              '&:hover': { 
                  backgroundColor: 'gray',
                  color: '#ffffff',
                }, 
            }} >
            Receiver</Button>
      </Link>
      </div>
    </div>
  );
};

export default Page;