'use client'

import { useUser } from '@clerk/nextjs';
import { addDoc, collection, doc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { Grid, Container, Card, CardActionArea, CardContent, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { toast } from 'react-toastify';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

export default function Flashcard() {
    const { isSignedIn, isLoaded, user } = useUser();
    const searchParams = useSearchParams();
    const search = searchParams.get('id');
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');

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

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    if(!isSignedIn || !isLoaded) {
        return null;
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setFront('');
        setBack('');
        setOpen(false);
    }

    const saveFlashcard = async () => {
        if(front === '' && back === '') {
            alert("Please enter the front and back of the card.");
            return;
        }

        if(front === ''){
            alert("Please enter the front of the card.");
            return;
        }
        if(back === ''){
            alert("Please enter the back of the card.");
            return;
        }

        if(!search || !user) {
            alert("Error: No collection found.");
            return;
        }

        try {
            const colRef = collection(doc(db, 'users', user.id), search);
            await addDoc(colRef, {
                front: front,
                back: back,
            });

            setFlashcards(prevFlashcards => [
                ...prevFlashcards,
                { front, back },
            ]);

            toast.success('Flashcard added successfully!');
            handleClose();
        } catch (error) {
            console.error("Error adding flashcard: ", error);
        }
    };

    const handleReadAloud = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    };

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

<Button 
    sx={{ 
        marginBottom: '10px',
        borderRadius: '50%',
        padding: '10px',
        minWidth: 0,
    }}
    onClick={handleOpen}
>
    <AddCircleIcon 
        sx={{ 
            fontSize: 40,
            color: 'blue',
        }} 
    />
</Button>

        

<Grid container spacing={3}>
    {flashcards.map((flashcard, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{
                height: '300px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                '&:hover .sound-icon': {
                    opacity: 1,
                }
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

                        <VolumeUpIcon 
                            className="sound-icon"
                            sx={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                cursor: 'pointer',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleReadAloud(flipped[index] ? flashcard.back : flashcard.front);
                            }}
                        />
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    ))}
</Grid>
</Container>






        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                Add Flashcard
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter front and back of the flashcard.
                </DialogContentText>

                <TextField
                    autoFocus
                    margin="dense"
                    required
                    label="Front of card"
                    type="text"
                    fullWidth
                    value={front}
                    onChange={(e)  => setFront(e.target.value)}
                    variant="outlined"
                />

                <TextField
                    margin="dense"
                    required
                    label="Back of card"
                    type="text"
                    fullWidth
                    value={back}
                    onChange={(e)  => setBack(e.target.value)}
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
                <Button onClick={saveFlashcard}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    </Box>
    </>
    );
}
