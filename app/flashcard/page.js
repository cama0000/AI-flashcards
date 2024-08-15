'use client'

import { useUser } from '@clerk/nextjs';
import { collection, doc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { Grid, Container, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import Loader from '../components/Loader';
import { useRouter } from 'next/navigation';

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

    if (!isLoaded || !isSignedIn) {
        return <Loader />;
    }

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

    const toggleFlip = (id) => {
        setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if(!isSignedIn || !isLoaded) {
        return null;
    }

    return (
        <Container maxWidth="md">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard) => (
                    <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                        <Card>
                            <CardActionArea onClick={() => toggleFlip(flashcard.id)}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {flipped[flashcard.id] ? flashcard.back : flashcard.front}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
