'use client'

import { useUser } from "@clerk/nextjs"
import { Button, TextField, Container, Typography, DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions, Box, Grid, Card, CardActionArea, CardContent, CircularProgress } from "@mui/material";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from '@/firebase';
import Loader from "../components/Loader";

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
        <Container maxWidth="sm" style={{ marginTop: '50px' }}>

            <TextField
            label="Enter text"
            variant="outlined"
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ marginBottom: '20px' }}
            InputProps={{
                style: { color: 'white' }, // Set text color to white
            }}
            InputLabelProps={{
                style: { color: 'white' }, // Set label color to white
            }}
            />

<Button variant="contained" color="secondary" fullWidth onClick={handleSubmit}>
            Generate Flashcards
        </Button>



        {flashcards.length > 0 && (
            <Box sx={{mt: 4}}>
                <Typography variant="h5">
                    Flashcards Preview
                </Typography>
                <Grid container spacing={3}>
                    
                    {/* maps cards */}
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea onClick={() => handleCardClick(index)}>
                                    <CardContent>
                                    <Box sx={{
                                        perspective: '1000px',
                                        '& > div': {
                                            transition: 'transform 0.6s',
                                            transformStyle: 'preserve-3d',
                                            position: 'relative',
                                            width: '100%',
                                            height: '200px',
                                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        },
                                        '& > div > div': {
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            display: 'flex',
                                            padding: 2,
                                            boxSizing: 'border-box',
                                        },
                                        '& > div > .back': {
                                            transform: 'rotateY(180deg)',
                                        },
                                    }}>
                                        <div>
                                            <div className="front">
                                                <Typography variant="h5" component="div">
                                                    {flashcard.front}
                                                </Typography>
                                            </div>
                                            <div className="back">
                                                <Typography variant="h5" component="div">
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
      </Container>
    )

}