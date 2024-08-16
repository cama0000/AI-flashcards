'use client'

import { useUser } from '@clerk/nextjs';
import { collection, doc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { Grid, Container, Card, CardActionArea, CardContent, Typography, Button, Box } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import Loader from '../components/Loader';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';

export default function Flashcard() {
    const { isSignedIn, isLoaded, user } = useUser();
    const searchParams = useSearchParams();
    const search = searchParams.get('id');
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/');
        }
    }, [isLoaded, isSignedIn, router]);

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return;

            const colRef = collection(doc(db, 'users', user.id), search);
            const querySnapshot = await getDocs(colRef);
            const cards = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                cards.push({ id: doc.id, ...data });
            });

            setFlashcards(cards);
        }

        getFlashcard();
    }, [search, user]);

    // const toggleFlip = (id) => {
    //     setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
    // };

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            [id]: !prev[id],
        }))
    }

    if(!isSignedIn || !isLoaded) {
        return null;
    }

    return (
    <>
    <Box sx={{ width: '100%', minHeight: '100vh' }} className="bg-primaryBlue">
        <Header />
        <Container
            maxWidth="lg"
            sx={{
                backgroundColor: '#ffc0cb',
                padding: '20px',
                borderRadius: '8px',
                marginTop: '40px',
            }}
        >

            {/* OLD STYLE */}
            {/* <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <CardActionArea
                            onClick={() => toggleFlip(flashcard.id)}
                            sx={{ height: '100%' }}
                        >
                            <Card sx={{ minHeight: '250px', display: 'flex', alignItems: 'center' }}>
                                                         <CardContent>
                                     <Typography variant="h5" component="div">
                                         {flipped[flashcard.id] ? flashcard.back : flashcard.front}
                                     </Typography>
                                 </CardContent>
                            </Card>
                        </CardActionArea>
                    </Grid>
                ))}
            </Grid> */}

<Grid container spacing={3}>
    {flashcards.map((flashcard, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{
                height: '300px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}>
                <CardActionArea onClick={() => handleCardClick(index)} sx={{ height: '100%' }}>
                    <CardContent sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        padding: 2,
                        boxSizing: 'border-box',
                    }}>
                        <Box sx={{
                            perspective: '1000px',
                            width: '100%',
                            height: '100%',
                            '& > div': {
                                transition: 'transform 0.6s',
                                transformStyle: 'preserve-3d',
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            },
                            '& > div > div': {
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backfaceVisibility: 'hidden',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 2,
                                boxSizing: 'border-box',
                            },
                            '& > div > .back': {
                                transform: 'rotateY(180deg)',
                            },
                        }}>
                            <div>
                                <div className="front">
                                    <Typography variant="h5" component="div" sx={{
                                        fontSize: '1.25rem',
                                        textAlign: 'center',
                                        whiteSpace: 'normal',
                                    }}>
                                        {flashcard.front}
                                    </Typography>
                                </div>
                                <div className="back">
                                    <Typography variant="h5" component="div" sx={{
                                        fontSize: '1.25rem',
                                        textAlign: 'center',
                                        whiteSpace: 'normal',
                                    }}>
                                        {flashcard.back}
                                    </Typography>
                                </div>
                            </div>
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    ))}
</Grid>








            
        </Container>
    </Box>
</>
    );
}