import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

interface AccountBreakdown {
    type: string;
    amount: number;
}

interface WalletCardProps {
    balance: string | number;
    onClick: () => void;
    breakdown?: AccountBreakdown[];
}

const WalletCard: React.FC<WalletCardProps> = ({ balance, onClick, breakdown }) => {
    return (
        <Card
            onClick={onClick}
            sx={{
                borderRadius: '16px',
                background: '#667eea',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 6px 24px rgba(99, 102, 241, 0.4)',
                },
                minHeight: '160px',
                width: '80%',
                display: 'flex',
                alignItems: 'center',
                justifySelf: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <CardContent sx={{ zIndex: 1, textAlign: 'center', width: '100%' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {balance}
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: breakdown && breakdown.length > 0 ? 2 : 0 }}>
                    Wallet Balance
                </Typography>

                {/* Account Breakdown Chips */}
                {breakdown && breakdown.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2 }}>
                        {breakdown.map((acc, index) => (
                            <Chip
                                key={index}
                                label={`${acc.type} - $${acc.amount.toFixed(2)}`}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    fontWeight: 600,
                                    backdropFilter: 'blur(10px)'
                                }}
                            />
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default WalletCard;
