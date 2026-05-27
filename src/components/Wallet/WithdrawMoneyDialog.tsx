import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    InputAdornment,
    CircularProgress,
    MenuItem,
    Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useWithdrawRequest } from '../../queries/transfer';
import { useWithdrawCommission } from '../../queries/transfer/commission';
import { useGetMyAccounts } from '../../queries/Member';
import { toast } from 'react-toastify';
import TokenService from '../../queries/token/tokenService';

interface WithdrawMoneyDialogProps {
    open: boolean;
    onClose: () => void;
    isCommission?: boolean;
    availableBalance?: number;
}

const WithdrawMoneyDialog: React.FC<WithdrawMoneyDialogProps> = ({ open, onClose, isCommission = false, availableBalance = 0 }) => {
    const { data: accountsData, isLoading: accountsLoading } = useGetMyAccounts();
    const withdrawMutation = useWithdrawRequest();
    const withdrawCommissionMutation = useWithdrawCommission();

    const [selectedAccount, setSelectedAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [bankAccountNumber, setBankAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [withdrawing, setWithdrawing] = useState(false);

    // Flatten all accounts for the dropdown
    const allAccounts = accountsData?.data?.accountTypes?.flatMap((accType: any) =>
        accType.accounts.map((acc: any) => ({
            ...acc,
            account_group_name: accType.account_group_name
        }))
    ) || [];

    const handleWithdraw = async () => {
        // Validation
        if (!isCommission && !selectedAccount) {
            toast.error('Please select an account');
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }
        /* if (!isCommission) {
            if (!bankAccountNumber.trim()) {
                toast.error('Please enter bank account number');
                return;
            }
            if (!ifscCode.trim()) {
                toast.error('Please enter IFSC code');
                return;
            }
            if (!accountHolderName.trim()) {
                toast.error('Please enter account holder name');
                return;
            }
        } */

        const selectedAcc = !isCommission ? allAccounts.find((acc: any) => acc._id === selectedAccount) : null;
        if (!isCommission && !selectedAcc) {
            toast.error('Selected account not found');
            return;
        }

        const balanceCheck = isCommission ? availableBalance : selectedAcc.account_amount;
        if (parseFloat(amount) > balanceCheck) {
            toast.error(`Insufficient balance in ${isCommission ? 'Commission Wallet' : 'selected account'}`);
            return;
        }

        setWithdrawing(true);

        try {
            // Call withdraw request API
            let response;
            if (isCommission) {
                response = await withdrawCommissionMutation.mutateAsync({
                    member_id: TokenService.getMemberId() || '', // Ensure we get member ID
                    amount: parseFloat(amount),
                    bank_account_number: 'Registered Bank Account',
                    ifsc_code: 'N/A',
                    account_holder_name: 'Registered Member'
                });
            } else {
                response = await withdrawMutation.mutateAsync({
                    member_id: selectedAcc.member_id,
                    account_id: selectedAcc._id,
                    account_no: selectedAcc.account_no,
                    account_type: selectedAcc.account_type,
                    amount: parseFloat(amount),
                    bank_account_number: bankAccountNumber || 'N/A',
                    ifsc_code: ifscCode || 'N/A',
                    account_holder_name: accountHolderName || 'N/A'
                });
            }

            if (response.success) {
                toast.success(response.message || 'Withdrawal request submitted successfully!');
                handleClose();
            } else {
                toast.error(response.message || 'Failed to submit withdrawal request');
            }
        } catch (error: any) {
            console.error('Withdrawal request error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit withdrawal request. Please try again.';
            toast.error(errorMessage);
        } finally {
            setWithdrawing(false);
        }
    };

    const handleClose = () => {
        setSelectedAccount('');
        setAmount('');
        setBankAccountNumber('');
        setIfscCode('');
        setAccountHolderName('');
        onClose();
    };

    const selectedAccountData = allAccounts.find((acc: any) => acc._id === selectedAccount);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    background: 'linear-gradient(to bottom, #ffffff, #f8f9ff)',
                }
            }}
        >
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalanceIcon />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Withdraw Money
                    </Typography>
                </Box>
                <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* From Account Section */}
                    {!isCommission && (
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#4b5563' }}>
                                Withdraw From
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                value={selectedAccount}
                                onChange={(e) => setSelectedAccount(e.target.value)}
                                disabled={accountsLoading}
                                placeholder="Select Account"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                    }
                                }}
                            >
                                {accountsLoading ? (
                                    <MenuItem disabled>
                                        <CircularProgress size={20} />
                                    </MenuItem>
                                ) : (
                                    allAccounts.map((account: any) => (
                                        <MenuItem key={account._id} value={account._id}>
                                            {account.account_group_name} - ${account.account_amount.toFixed(2)} ({account.account_no})
                                        </MenuItem>
                                    ))
                                )}
                            </TextField>

                            {selectedAccountData && (
                                <Box sx={{
                                    mt: 2,
                                    p: 2,
                                    borderRadius: '12px',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    border: '1px solid rgba(99, 102, 241, 0.2)'
                                }}>
                                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                        Available Balance
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#6366f1' }}>
                                        ${selectedAccountData.account_amount.toFixed(2)}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}

                    {isCommission && (
                        <Box sx={{
                            p: 2,
                            borderRadius: '12px',
                            background: 'rgba(99, 102, 241, 0.1)',
                            border: '1px solid rgba(99, 102, 241, 0.2)'
                        }}>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                Available Commission Balance
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#6366f1' }}>
                                ${availableBalance.toFixed(2)}
                            </Typography>
                        </Box>
                    )}

                    {/* Amount */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#4b5563' }}>
                            Amount
                        </Typography>
                        <TextField
                            fullWidth
                            type="text"
                            value={amount}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Allow only numbers and one decimal point
                                if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
                                    setAmount(value);
                                }
                            }}
                            placeholder="Enter amount"
                            error={isCommission ? parseFloat(amount || '0') > availableBalance : (selectedAccountData && parseFloat(amount || '0') > selectedAccountData.account_amount)}
                            helperText={
                                selectedAccountData && parseFloat(amount || '0') > selectedAccountData.account_amount
                                    ? `Insufficient balance. Available: $${selectedAccountData.account_amount.toFixed(2)}`
                                    : ''
                            }
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                }
                            }}
                        />
                    </Box>

                    {/* Bank Details Section - Commented out as requested
                    {!isCommission && (
                        <Box>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#1f2937' }}>
                                Bank Account Details
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Account Holder Name"
                                    value={accountHolderName}
                                    onChange={(e) => setAccountHolderName(e.target.value)}
                                    placeholder="Enter account holder name"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                        }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Bank Account Number"
                                    value={bankAccountNumber}
                                    onChange={(e) => setBankAccountNumber(e.target.value)}
                                    placeholder="Enter bank account number"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                        }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="IFSC Code"
                                    value={ifscCode}
                                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                                    placeholder="Enter IFSC code"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                    )}
                    */}

                    <Alert severity="info" sx={{ borderRadius: '12px' }}>
                        Withdrawal requests are processed within 2-3 business days.
                    </Alert>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    disabled={withdrawing}
                    sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        px: 3,
                        borderColor: '#d1d5db',
                        color: '#6b7280',
                        '&:hover': {
                            borderColor: '#9ca3af',
                            background: '#f9fafb'
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleWithdraw}
                    variant="contained"
                    disabled={withdrawing || (!isCommission && !selectedAccount) || !amount}
                    sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        px: 3,
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
                        }
                    }}
                >
                    {withdrawing ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Withdraw'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WithdrawMoneyDialog;
