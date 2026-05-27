import React from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';

interface AgentWalletCardProps {
    balance: string | number;
    isLoading?: boolean;
}

const AgentWalletCard: React.FC<AgentWalletCardProps> = ({ balance, isLoading = false }) => {
    return (
        <Card
            sx={{
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #667EEA 0%, #5B21B6 100%)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 8px 30px rgba(102, 126, 234, 0.5)',
                },
                minHeight: '200px',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <CardContent sx={{ zIndex: 1, textAlign: 'center', width: '100%', py: 4 }}>
                <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 1 }}>
                    Total Commission Balance
                </Typography>
                {isLoading ? (
                    <CircularProgress size={40} sx={{ color: 'white', my: 2 }} />
                ) : (
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {typeof balance === 'number' ? `$${balance.toFixed(2)}` : balance}
                    </Typography>
                )}
                <Typography variant="body2" sx={{ opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <TouchAppIcon sx={{ fontSize: 18 }} />
                    Tap to manage wallet
                </Typography>
            </CardContent>
        </Card>
    );
};

export default AgentWalletCard;
