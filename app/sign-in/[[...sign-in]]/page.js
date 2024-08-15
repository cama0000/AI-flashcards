import { SignIn } from "@clerk/nextjs";
import { Box } from "@mui/material";

export default function Page() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: 'linear-gradient(to right, #ff6ec4, #7873f5)',
            }}
        >
            <SignIn/>
        </Box>
    );
}
