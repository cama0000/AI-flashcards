'use client'

import { useUser } from '@clerk/nextjs'
import { collection, getDoc, setDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { Grid, Container, Card, CardActionArea, CardContent, Typography, Box, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import Loader from '../components/Loader';
import Header from '../components/Header';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

export default function Flashcard(){
    const {isLoaded, isSignedIn, user} = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

    // useEffect(() => {
    //   if (isLoaded && !isSignedIn) {
    //       router.push('/');
    //   }
    // }, [isLoaded, isSignedIn, router]);

    // if (!isLoaded || !isSignedIn) {
    //     return <Loader />;
    // }
    
    // useEffect(() => {
    //     async function getFlashcards() {
    //         if(!user) return;

    //         // check to see if document exsists
    //         const docRef = doc(collection(db, 'users'), user.id);
    //         const docSnap = await getDoc(docRef);

    //         if(docSnap.exists()){
    //             // get all collection names
    //             const collections = docSnap.data().flashcards;
    //             setFlashcards(collections);
    //         }
    //         else{
    //             await setDoc(docRef, {});
    //         }
    //     }

    //     getFlashcards();
    // }, [user]);

    // if (!isLoaded || !isSignedIn) return null;






    useEffect(() => {
      async function getFlashcards() {
          if (!user) return;

          // check to see if document exists
          const docRef = doc(collection(db, 'users'), user.id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
              // get all collection names
              const collections = docSnap.data().flashcards;
              setFlashcards(collections);
          } else {
              await setDoc(docRef, {});
          }
      }

      if (user) {
          getFlashcards();
      }
  }, [user]);

  if (!isLoaded || !isSignedIn) return <Loader />;

  const handleDelete = async (name) => {
    // alert('Delete this flashcard set');
    if (window.confirm('Are you sure you want to delete this flashcard set?')) {
        try {
            const docRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || [];
                const updatedCollections = collections.filter((flashcard) => flashcard.name !== name);

                // Update Firestore document
                await setDoc(docRef, { flashcards: updatedCollections }, { merge: true });

                // Optionally delete the collection from Firestore if you have separate documents for each set
                const flashcardColRef = collection(docRef, name);
                const querySnapshot = await getDocs(flashcardColRef);
                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });

                // Update local state
                setFlashcards(updatedCollections);
                toast.success("Deck deleted successfully!");
            }
        } catch (error) {
            console.error('Error deleting flashcard set:', error);
        }
    }
    };




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
            {/* <Grid container spacing={3} sx={{ mt: 4 }}>
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
            </Grid> */}


<Grid container spacing={3} sx={{ mt: 4 }}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                                                    <CardActionArea
                                        onClick={() => handleCardClick(flashcard.name)}
                                        sx={{ height: '100%' }}
                                    >
                                <Card
                                    sx={{
                                        minHeight: '250px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        position: 'relative',
                                        '&:hover .delete-icon': {
                                            opacity: 1,
                                        },
                                    }}
                                >
                                        <CardContent sx={{ textAlign: 'center', width: '100%' }}>
                                            <Typography
                                                variant="h5"
                                                component="div"
                                                sx={{ fontWeight: 'bold' }}
                                            >
                                                {flashcard.name}
                                            </Typography>
                                        </CardContent>
                                    <IconButton
                                        aria-label="delete"
                                        onClick={(event) => {
                                            event.stopPropagation(); // Prevents the click from triggering the CardActionArea onClick
                                            handleDelete(flashcard.name);
                                        }}
                                        className="delete-icon"
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            color: 'red',
                                            opacity: 0,
                                            transition: 'opacity 0.3s',
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
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