'use client'

import { useUser } from "@clerk/nextjs"
import { Button, TextField, Container, Typography, DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions, Box, Grid, Card, CardActionArea, CardContent, CircularProgress } from "@mui/material";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from '@/firebase';
import Loader from "../components/Loader";
import Header from "../components/Header";

// TODO: Check if signed in or not

export default function Generate(){
    const {isLoaded, isSignedIn, user} = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/');
        }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded || !isSignedIn) {
        return <Loader />;
    }

    const handleSubmit = async() =>{
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
        .then((res) => res.json())
        .then((data) => {
            setFlashcards(data);
        })
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            [id]: !prev[id],
        }))
    }

    // const toggleFlip = (id) => {
    //     setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
    // };

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const saveFlashcards = async () => {
        if(!name){
            alert("Please enter a name")
            return;
        }

        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

        // using batch so we write them all at once rather than one by one
        if(docSnap.exists()){
            const collections = docSnap.data().flashcards || [];

            if(collections.find((f) => f.name === name)){
                alert("Flashcard collection with same name already exists")
                return;
            }
            else{
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true});
            }
        }
        else{
            batch.set(userDocRef, {flashcards: [{name}]});
        }

        const colRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        handleClose();
        router.push('/flashcards');
    }

    return (
        <>
    <Box sx={{ width: '100%', minHeight: '100vh' }} className="bg-primaryBlue">

        <Header/>
        <Container maxWidth="lg" style={{                 
                backgroundColor: '#ffc0cb',
                padding: '20px',
                borderRadius: '8px',
                marginTop: '40px',
                }}>

            <TextField
            label="Enter text"
            variant="outlined"
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ marginBottom: '20px' }}
            InputProps={{
                style: { color: 'white' },
            }}
            InputLabelProps={{
                style: { color: 'white' },
            }}
            />

        <Button variant="contained" className="bg-primaryBlue" fullWidth onClick={handleSubmit}>
            Generate
        </Button>
            
        </Container>



        {flashcards.length > 0 && (
                    <Container maxWidth="lg" style={{                 
                        backgroundColor: '#ffc0cb',
                        padding: '20px',
                        borderRadius: '8px',
                        marginTop: '40px',
                        }}>
            <Box>
                <Typography variant="h3" sx={{fontStyle: 'bold'}} gutterBottom>
                    Preview
                </Typography>
                    
                    {/* maps cards */}
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


                <Box sx={{mt:4, display: 'flex', justifyContent: 'center'}}>
                    <Button variant="contained" color="secondary" onClick={handleOpen}>
                        Submit
                    </Button>
                </Box>
            </Box>
            </Container>
        )}









        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                Save Flashcards
            </DialogTitle>
            
            <DialogContent>
                <DialogContentText>
                    Please enter name for flashcards.
                </DialogContentText>

                <TextField
                autoFocus
                margin="dense"
                label="Collection name"
                type="text"
                fullWidth
                value={name}
                onChange={(e)  => setName(e.target.value)}
                variant="outlined"
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
                <Button onClick={saveFlashcards}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
      </Box>
      </>
    )

}