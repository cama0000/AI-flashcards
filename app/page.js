// 'use client'

// import React, { useEffect } from 'react';
// import Head from 'next/head';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import Container from '@mui/material/Container';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';
// import CssBaseline from '@mui/material/CssBaseline';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import { UserButton } from '@clerk/nextjs';
// import { SignedIn, SignedOut } from '@clerk/clerk-react';
// import getStripe from '@/utils/get-stripe'
// import { IconButton, Stack } from '@mui/material';
// import LinkedInIcon from '@mui/icons-material/LinkedIn';
// import GitHubIcon from '@mui/icons-material/GitHub';
// import EmailIcon from '@mui/icons-material/Email';
// import { useRouter } from 'next/navigation';
// import { useUser } from '@clerk/nextjs'
// import Loader from './components/Loader';
// import Header from './components/Header';

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#1976d2',
//     },
//     secondary: {
//       main: '#f50057',
//     },
//   },
// });

// export default function Home() {
//   const {isLoaded, isSignedIn, user} = useUser();
//   const router = useRouter();

//   useEffect(() => {
//     if (isLoaded && isSignedIn) {
//         router.push('/flashcards');
//     }
//   }, [isLoaded, isSignedIn, router]);

//   // if (!isLoaded) {
//   //     return <Loader />;
//   // }

//   const handleSubmit = async () => {
//     const checkoutSession = await fetch('/api/checkout_session', {
//       method: 'POST',
//       headers: {
//         'origin': 'http://localhost:3000',
//       },
//     })

//     const checkoutSessionJson = await checkoutSession.json()

//     if(checkoutSession.statusCode == 500){
//       console.error(checkoutSessionJson.message);
//       alert(checkoutSessionJson.message)
//       return
//     }

//     const stripe = await getStripe();

//     const {error} = await stripe.redirectToCheckout({
//       sessionId: checkoutSessionJson.id,
//     })

//     if(error){
//       console.warn(error.message);
//       alert(error.message)
//     }
//   }


//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Head>
//         <title>Quanta</title>
//         <meta name="Quanta" content="AI-Flashcard Generator" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//     <Header/>
      
//       <main>
//         <Box
//           sx={{
//             padding: '80px 0',
//             textAlign: 'center',
//           }}

//           className="bg-primaryPink"
//         >
//             <Typography variant="h2" sx={{color: '#ffffff', fontStyle: 'bold', fontSize: '75px'}} gutterBottom>
//               Generate flashcards with a single click.
//             </Typography>

//             <Typography variant="h5" sx={{color: '#000000', fontStyle: 'italic'}} gutterBottom>
//               All you need is your notes, we'll handle the rest.
//             </Typography>

//             <Button className='w-32 mt-16 mb-16' size='large' variant="contained" href='sign-up'>JOIN NOW</Button>


//             {/* <Button variant='contained' color="primary" size="large" onClick={handleSubmit}>
//               Go PRO
//             </Button> */}

//         </Box>
        
//         <Box 
//             sx={{ 
//                 width: '100%', 
//                 padding: '40px 0',
//                 boxSizing: 'border-box'
//             }}

//             className="bg-secondaryBlue"
//         >
//             <Container>
//                 <Typography variant="h4" gutterBottom textAlign="center">
//                     Features
//                 </Typography>
//                 <Grid container spacing={4}>
//                     {[
//                         {
//                             title: 'AI-Powered Flashcards',
//                             description: 'Automatically generate flashcards from your notes using AI technology.',
//                         },
//                         {
//                             title: 'Customizable Decks',
//                             description: 'Create and organize decks according to your study needs.',
//                         },
//                         {
//                             title: 'Mobile Friendly',
//                             description: 'Access your flashcards on any device, anytime, anywhere.',
//                         },
//                     ].map((feature, index) => (
//                         <Grid item xs={12} md={4} key={index}>
//                             <Paper sx={{ padding: '20px', height: '100%' }}>
//                                 <Typography variant="h6" component="h3" gutterBottom>
//                                     {feature.title}
//                                 </Typography>
//                                 <Typography variant="body1">{feature.description}</Typography>
//                             </Paper>
//                         </Grid>
//                     ))}
//                 </Grid>
//             </Container>
//         </Box>



//         {/* <Box 
//             sx={{ 
//                 width: '100%', 
//                 padding: '40px 0',
//                 boxSizing: 'border-box'
//             }}

//             className="bg-secondaryPink"
//         >
//             <Container>
//                 <Typography variant="h4" gutterBottom textAlign="center">
//                     Pricing
//                 </Typography>
//                 <Grid container spacing={4}>
//                     {[
//                         {
//                             title: 'AI-Powered Flashcards',
//                             description: 'Automatically generate flashcards from your notes using AI technology.',
//                         },
//                         {
//                             title: 'Customizable Decks',
//                             description: 'Create and organize decks according to your study needs.',
//                         },
//                         {
//                             title: 'Mobile Friendly',
//                             description: 'Access your flashcards on any device, anytime, anywhere.',
//                         },
//                     ].map((feature, index) => (
//                         <Grid item xs={12} md={4} key={index}>
//                             <Paper sx={{ padding: '20px', height: '100%' }}>
//                                 <Typography variant="h6" component="h3" gutterBottom>
//                                     {feature.title}
//                                 </Typography>
//                                 <Typography variant="body1">{feature.description}</Typography>
//                             </Paper>
//                         </Grid>
//                     ))}
//                 </Grid>
//             </Container>
//         </Box> */}

//       </main>
      
//       {/* FOOTER */}
//       <Box
//         component="footer"
//         sx={{
//           backgroundColor: '#333',
//           color: '#fff',
//           padding: '20px 0',
//           textAlign: 'center',
//         }}
//       >
//                 <Box display="flex" justifyContent="center" mb={1}>
//           <IconButton className='hover:scale-105 duration-200' href="https://www.linkedin.com/in/cameronarmijo000/" target="_blank" color="inherit">
//             <LinkedInIcon />
//           </IconButton>
//           <IconButton className='hover:scale-105 duration-200' href="https://github.com/cama0000" target="_blank" color="inherit">
//             <GitHubIcon />
//           </IconButton>
//           <IconButton className='hover:scale-105 duration-200' href="mailto:acama0000@gmail.com" color="inherit">
//             <EmailIcon />
//           </IconButton>
//         </Box>
//         <Container>
//           <Typography variant="body2">
//             © {new Date().getFullYear()} Quanta. All rights reserved.
//           </Typography>
//         </Container>
//       </Box>
//     </ThemeProvider>
//   );
// }





'use client'

import React, { useEffect } from 'react';
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
import getStripe from '@/utils/get-stripe';
import { IconButton, Stack } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Loader from './components/Loader';
import Header from './components/Header';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/flashcards');
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSessionJson.message);
      alert(checkoutSessionJson.message);
      return;
    }

    const stripe = await getStripe();

    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
      alert(error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Quanta</title>
        <meta name="description" content="AI-Flashcard Generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <Box
          sx={{
            padding: '80px 0',
            textAlign: 'center',
          }}
          className="bg-primaryPink"
        >
          <Typography variant="h2" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '75px' }} gutterBottom>
            Generate flashcards with a single click.
          </Typography>

          <Typography variant="h5" sx={{ color: '#000000', fontStyle: 'italic' }} gutterBottom>
            All you need is your notes, we&apos;ll handle the rest.
          </Typography>

          <Button className="w-32 mt-16 mb-16" size="large" variant="contained" href="sign-up">
            JOIN NOW
          </Button>
        </Box>

        <Box
          sx={{
            width: '100%',
            padding: '40px 0',
            boxSizing: 'border-box',
          }}
          className="bg-secondaryBlue"
        >
          <Container>
            <Typography variant="h4" gutterBottom textAlign="center">
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
        </Box>
      </main>

      {/* FOOTER */}
      <Box
        component="footer"
        sx={{
          backgroundColor: '#333',
          color: '#fff',
          padding: '20px 0',
          textAlign: 'center',
        }}
      >
        <Box display="flex" justifyContent="center" mb={1}>
          <IconButton className="hover:scale-105 duration-200" href="https://www.linkedin.com/in/cameronarmijo000/" target="_blank" color="inherit">
            <LinkedInIcon />
          </IconButton>
          <IconButton className="hover:scale-105 duration-200" href="https://github.com/cama0000" target="_blank" color="inherit">
            <GitHubIcon />
          </IconButton>
          <IconButton className="hover:scale-105 duration-200" href="mailto:acama0000@gmail.com" color="inherit">
            <EmailIcon />
          </IconButton>
        </Box>
        <Container>
          <Typography variant="body2">
            © {new Date().getFullYear()} Quanta. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
