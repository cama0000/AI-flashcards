import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { AppBar, Box, Button, Stack, Toolbar } from "@mui/material";

export default function Header(){
    return(
        <AppBar position="static" className='bg-primaryBlue'>
      <Toolbar disableGutters>
        
        <Stack direction={'row'} spacing={1} sx={{ flexGrow: 1, marginLeft: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="/images/logo.png" alt="pantry" className="w-8 h-8" style={{ marginRight: '8px' }} />
            <div className="text-white text-2xl font-bold">
              Quanta
            </div>
          </Box>
        </Stack>

        <Stack direction={'row'} spacing={2} sx={{ marginRight: 2 }}>
          <SignedOut>
            <Button className='hover:scale-110 duration-300' color="inherit" href='sign-in'>Login</Button>
            <Button className='hover:scale-110 duration-300'color="inherit" href='sign-up'>Sign Up</Button>
          </SignedOut>

          <SignedIn>
            <UserButton               
              sx={{
                width: 48,
                height: 48,
                fontSize: '1.5rem',
                marginLeft: -8
              }} />
          </SignedIn>
        </Stack>
      </Toolbar>
    </AppBar>
    )
}