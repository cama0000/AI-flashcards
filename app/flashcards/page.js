'use client'

import { useUser } from '@clerk/nextjs'
import { collection, getDoc, setDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { Grid, Container, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import Loader from '../components/Loader';
import Header from '../components/Header';

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
<>
    <Box sx={{ width: '100%', minHeight: '100vh' }} className="bg-primaryBlue">
        <Header />
        <Container
            maxWidth="md"
            sx={{
                backgroundColor: '#ffc0cb',
                padding: '20px',
                borderRadius: '8px',
                marginTop: '40px',
            }}
        >
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <CardActionArea
                            onClick={() => handleCardClick(flashcard.name)}
                            sx={{ height: '100%' }}
                        >
                            <Card sx={{ minHeight: '250px', display: 'flex', alignItems: 'center' }}>
                                <CardContent sx={{ textAlign: 'center', width: '100%' }}>
                                    <Typography
                                        variant="h5"
                                        component="div"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        {flashcard.name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </CardActionArea>
                    </Grid>
                ))}
            </Grid>
        </Container>
    </Box>
</>



    )
}