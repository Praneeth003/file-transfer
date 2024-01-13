import React from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';

const Page = () => {
  return (
    <div>
      <h1>File Transfer</h1>
      <Link href="/sender">
      <Button variant="contained" size = "large" >Sender</Button>
      </Link>
      <Link href="/receiver">
      <Button variant="contained" size = "large" >Receiver</Button>
      </Link>
    </div>
  );
};

export default Page;