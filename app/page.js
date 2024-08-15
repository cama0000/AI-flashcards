// pages/index.js

'use client'

import React from 'react';
import Head from 'next/head';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { UserButton } from '@clerk/nextjs';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import getStripe from '@/utils/get-stripe'


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue color
    },
    secondary: {
      main: '#f50057', // Pink color
    },
  },
});

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        'origin': 'http://localhost:3000',
      },
    })

    const checkoutSessionJson = await checkoutSession.json()

    if(checkoutSession.statusCode == 500){
      console.error(checkoutSessionJson.message);
      alert(checkoutSessionJson.message)
      return
    }

    const stripe = await getStripe();

    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if(error){
      console.warn(error.message);
      alert(error.message)
    }
  }


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Transform your notes into flashcards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <AppBar position="static">
        <Container>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Flashcard SaaS
            </Typography>

            <SignedOut>
              <Button color="inherit" href='sign-in'>Login</Button>
              <Button color="inherit" href='sign-up'>Sign Up</Button>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </Container>
      </AppBar>
      
      <main>
        <Box
          sx={{
            backgroundColor: '#f5f5f5',
            padding: '80px 0',
            textAlign: 'center',
          }}
        >
          <Container>
            <Typography variant="h2" component="h1" gutterBottom>
              Transform Your Notes into YEAHHHH
            </Typography>
            <Typography variant="h5" component="p" gutterBottom>
              Boost your learning with our intelligent flashcard generator.
            </Typography>
            <Button variant="contained" color="primary" size="large">
              Get Started
            </Button>

            <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
              Go PRO
            </Button>

          </Container>
        </Box>
        
        <Container sx={{ padding: '40px 0' }}>
          <Typography variant="h4" component="h2" gutterBottom textAlign="center">
            Features
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: 'AI-Powered Flashcards',
                description: 'Automatically generate flashcards from your notes using AI technology.',
              },
              {
                title: 'Customizable Decks',
                description: 'Create and organize decks according to your study needs.',
              },
              {
                title: 'Mobile Friendly',
                description: 'Access your flashcards on any device, anytime, anywhere.',
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper sx={{ padding: '20px', height: '100%' }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1">{feature.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      
      <Box
        component="footer"
        sx={{
          backgroundColor: '#333',
          color: '#fff',
          padding: '20px 0',
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="body1">&copy; 2024 Flashcard SaaS</Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
