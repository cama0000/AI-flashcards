import { CircularProgress, Box } from '@mui/material';

export default function Loader() {
    return (
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw',
            }}
        >
            <CircularProgress
                size={80}  // Increase the size of the loader
                sx={{
                    color: 'transparent',
                    '& .MuiCircularProgress-circle': {
                        stroke: `url(#gradient1)`,
                    },
                }}
            />
            <svg width={0} height={0}>
                <defs>
                    <linearGradient id="gradient1" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff6ec4" />
                        <stop offset="100%" stopColor="#7873f5" />
                    </linearGradient>
                </defs>
            </svg>
        </Box>
    );
}
