import { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import TokenService from '../../queries/token/tokenService';
import { useGetAgentById, useGetAgentCommissionTransactions } from '../../queries/Agent';
import WithdrawMoneyDialog from '../../components/Wallet/WithdrawMoneyDialog';

const AgentWallet = () => {
    const navigate = useNavigate();
    const agentId = TokenService.getMemberId() || '';
    const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

    const { data: agentData } = useGetAgentById(agentId);
    const {
        data: transactionsData,
        isLoading: transactionsLoading,
        error: transactionsError
    } = useGetAgentCommissionTransactions(agentId);

    // Get commission balance from commission transactions summary
    const totalBalance = transactionsData?.data?.summary?.availableBalance || 0;

    // Get commission transactions
    const transactions = transactionsData?.data?.transactions || [];

    // Format transaction for display
    const formatTransaction = (transaction: any) => {
        // Check if it's a credit (CREDITED status) or withdrawal (WITHDRAWN status)
        const isCredit = transaction.status === 'CREDITED' || transaction.status === 'PENDING';
        const amount = transaction.commission_amount || 0;

        // Determine description based on credit/debit
        let description = transaction.description;
        if (!description) {
            description = isCredit ? 'Commission Received' : 'Commission Withdrawal';
        }

        return {
            id: transaction._id || transaction.transaction_id,
            date: new Date(transaction.createdAt || transaction.transaction_date).toLocaleDateString('en-US'),
            description,
            amount: `${isCredit ? '+ ' : '- '}$${Math.abs(amount).toFixed(2)}`,
            status: transaction.status || 'Completed',
            isCredit,
            type: isCredit ? 'commission_received' : 'commission_withdrawal'
        };
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 3 }, mt: { xs: 2, sm: 8 } }}>
            {/* Back Button */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/agent/dashboard')}
                sx={{
                    mb: 3,
                    color: '#667EEA',
                    fontWeight: 600,
                    '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.08)'
                    }
                }}
            >
                Back to Dashboard
            </Button>

            {/* Header */}
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#1f2937' }}>
                Agent Wallet
            </Typography>

            {/* Welcome Text */}
            <Typography variant="body1" sx={{ mb: 3, color: '#6b7280' }}>
                Welcome, {agentData?.data?.name || 'Agent'}. Manage your commission balance and withdrawals here.
            </Typography>

            {/* Balance Section */}
            <Card sx={{
                mb: 4,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #667EEA 0%, #5B21B6 100%)',
                color: 'white',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
            }}>
                <CardContent sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 4
                }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                            Commission Balance
                        </Typography>
                        {transactionsLoading ? (
                            <CircularProgress size={40} sx={{ color: 'white', mt: 1 }} />
                        ) : (
                            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                ${totalBalance.toFixed(2)}
                            </Typography>
                        )}
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                            Available for withdrawal
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: { xs: 3, md: 0 } }}>
                        <Button
                            variant="contained"
                            startIcon={<AccountBalanceWalletIcon />}
                            onClick={() => setWithdrawDialogOpen(true)}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '12px',
                                px: 4,
                                py: 1.5,
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '1rem',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.3)',
                                    transform: 'scale(1.02)'
                                }
                            }}
                        >
                            Withdraw
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Commission Transactions Section */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#374151' }}>
                Recent Commission Transactions
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: '#6b7280' }}>
                Showing commission received and commission withdrawal transactions
            </Typography>

            {transactionsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress sx={{ color: '#667EEA' }} />
                </Box>
            ) : transactionsError ? (
                <Alert severity="info" sx={{ borderRadius: '12px' }}>
                    No commission transactions found yet. Your commission history will appear here.
                </Alert>
            ) : transactions.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '12px', bgcolor: '#f9fafb' }}>
                    <AccountBalanceWalletIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                        No commission transactions yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Your commission earnings and withdrawals will appear here
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper} sx={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(102, 126, 234, 0.1)'
                }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'rgba(102, 126, 234, 0.05)' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((transaction: any) => {
                                const formatted = formatTransaction(transaction);
                                return (
                                    <TableRow key={formatted.id} hover sx={{
                                        '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.02)' }
                                    }}>
                                        <TableCell>{formatted.date}</TableCell>
                                        <TableCell>{formatted.description}</TableCell>
                                        <TableCell>
                                            <Box sx={{
                                                display: 'inline-block',
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                bgcolor: formatted.isCredit ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: formatted.isCredit ? '#16a34a' : '#dc2626',
                                            }}>
                                                {formatted.isCredit ? 'Received' : 'Withdrawal'}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{
                                            fontWeight: 'bold',
                                            color: formatted.isCredit ? '#16a34a' : '#dc2626'
                                        }}>
                                            {formatted.amount}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{
                                                display: 'inline-block',
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                bgcolor: formatted.status === 'Completed' || formatted.status === 'Success'
                                                    ? '#dcfce7'
                                                    : formatted.status === 'Pending'
                                                        ? '#fef9c3'
                                                        : '#fee2e2',
                                                color: formatted.status === 'Completed' || formatted.status === 'Success'
                                                    ? '#166534'
                                                    : formatted.status === 'Pending'
                                                        ? '#854d0e'
                                                        : '#991b1b',
                                            }}>
                                                {formatted.status}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Withdraw Dialog */}
            <WithdrawMoneyDialog
                open={withdrawDialogOpen}
                onClose={() => setWithdrawDialogOpen(false)}
            />
        </Box>
    );
};

export default AgentWallet;
