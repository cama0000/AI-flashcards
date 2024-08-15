'use client'

import { useUser } from '@clerk/nextjs'
import { collection, getDoc, setDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { Grid, Container, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import Loader from '../components/Loader';

export default function Flashcard(){
    const {isLoaded, isSignedIn, user} = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

    useEffect(() => {
      if (isLoaded && !isSignedIn) {
          router.push('/');
      }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded || !isSignedIn) {
        return <Loader />;
    }
    
    useEffect(() => {
        async function getFlashcards() {
            if(!user) return;

            // check to see if document exsists
            const docRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){
                // get all collection names
                const collections = docSnap.data().flashcards;
                setFlashcards(collections);
            }
            else{
                await setDoc(docRef, {});
            }
        }

        getFlashcards();
    }, [user]);

    if (!isLoaded || !isSignedIn) return null;

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    }

    return (
<Container maxWidth="md">
  <Grid container spacing={3} sx={{ mt: 4 }}>
    {flashcards.map((flashcard, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card>
          <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
            <CardContent>
              <Typography variant="h5" component="div">
                {flashcard.name}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    ))}
  </Grid>
</Container>

    )
}