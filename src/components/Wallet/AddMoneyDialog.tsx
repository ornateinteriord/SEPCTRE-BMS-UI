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
    MenuItem,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useCreatePaymentOrder } from '../../queries/Wallet/useWallet';
import { useGetMemberById, useGetMyAccounts } from '../../queries/Member';
import TokenService from '../../queries/token/tokenService';
import { toast } from 'react-toastify';

interface AddMoneyDialogProps {
    open: boolean;
    onClose: () => void;
}

const AddMoneyDialog: React.FC<AddMoneyDialogProps> = ({ open, onClose }) => {
    const [amount, setAmount] = useState('');
    const [selectedAccount, setSelectedAccount] = useState('');

    const userId = TokenService.getMemberId();
    const { data: memberData } = useGetMemberById(userId || '');
    const { data: accountsData, isLoading: accountsLoading } = useGetMyAccounts();
    const { mutate: createOrder, isPending } = useCreatePaymentOrder();

    // Note: Cashfree SDK is initialized dynamically in handleAddMoney 
    // after receiving cashfree_env from backend response

    // Flatten accounts for dropdown - Filter for FD, RD, PIGMY accounts only
    const allAccounts = accountsData?.data?.accountTypes?.flatMap((accType: any) =>
        accType.accounts.map((acc: any) => ({
            ...acc,
            account_type: accType.account_type,
            account_group_name: accType.account_group_name
        }))
    ) || [];

    // Debug: Log all accounts to see the actual account_type values
    console.log("All accounts for Add Money:", allAccounts);
    console.log("Account types available:", allAccounts.map((a: any) => ({ type: a.account_type, group: a.account_group_name })));

    // Filter to show only FD, RD, PIGMY, MIS accounts for Add Money
    const myAccounts = allAccounts.filter((acc: any) => {
        const accountGroup = acc.account_group_name?.toUpperCase();
        return accountGroup === 'FD' ||
            accountGroup === 'RD' ||
            accountGroup === 'PIGMY' ||
            accountGroup === 'MIS';
    });

    const handleClose = () => {
        setAmount('');
        setSelectedAccount('');
        onClose();
    };

    const handleAddMoney = () => {
        const finalAmount = parseFloat(amount);
        if (finalAmount > 0 && selectedAccount) {
            // Find the selected account object to get all details
            const accountDetails = myAccounts.find((acc: any) => acc._id === selectedAccount);

            if (!accountDetails) {
                toast.error("Selected account not found. Please try again.");
                return;
            }

            const request = {
                member_id: memberData?.data?.member_id,
                amount: finalAmount,
                mobileno: memberData?.data?.contactno,
                Name: memberData?.data?.name,
                email: memberData?.data?.emailid,
                account_id: accountDetails._id,
                account_no: accountDetails.account_no,
                account_type: accountDetails.account_type
            };

            if (!request.member_id) {
                toast.error("Missing member information. Please try again.");
                return;
            }

            createOrder(request, {
                onSuccess: (data: any) => {
                    if (data?.payment_session_id && (window as any).Cashfree) {
                        // Verify the payment session ID format
                        if (typeof data.payment_session_id !== 'string' || data.payment_session_id.trim() === '') {
                            toast.error("Invalid payment session ID received");
                            return;
                        }

                        // Initialize Cashfree with mode from backend response (like BICCSL-Server)
                        const cashfreeMode = data.cashfree_env || "sandbox";
                        console.log("Initializing Cashfree in", cashfreeMode, "mode");

                        const cashfreeInstance = new (window as any).Cashfree({
                            mode: cashfreeMode,
                        });

                        cashfreeInstance.checkout({
                            paymentSessionId: data.payment_session_id
                        });
                        handleClose();
                    } else {
                        if (!(window as any).Cashfree) {
                            toast.error("Payment gateway not properly initialized. Please reload the page.");
                        } else {
                            toast.error("Failed to initialize payment gateway");
                        }
                    }
                },
                onError: (error: any) => {
                    console.error("❌ Order creation failed:", error);
                    console.error("Response data:", error?.response?.data);
                    toast.error(error?.response?.data?.message || "Failed to create payment order");
                }
            });
        } else {
            toast.error("Please enter a valid amount and select an account");
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                }
            }}
        >
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AddIcon />
                    <Typography variant="h6">Add Money to Wallet</Typography>
                </Box>
                <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        select
                        fullWidth
                        value={selectedAccount}
                        onChange={(e) => setSelectedAccount(e.target.value)}
                        label="Select Account"
                        disabled={accountsLoading}
                    >
                        {accountsLoading ? (
                            <MenuItem disabled>
                                <CircularProgress size={20} sx={{ mr: 1 }} /> Fetching accounts...
                            </MenuItem>
                        ) : myAccounts.length === 0 ? (
                            <MenuItem disabled>
                                No account found
                            </MenuItem>
                        ) : (
                            myAccounts.map((acc: any) => (
                                <MenuItem key={acc._id} value={acc._id}>
                                    {acc.account_group_name} - ${acc.account_amount.toFixed(2)} ({acc.account_no})
                                </MenuItem>
                            ))
                        )}
                    </TextField>
                    {!accountsLoading && myAccounts.length === 0 && (
                        <Typography variant="caption" color="error">
                            No account found for this member
                        </Typography>
                    )}

                    <TextField
                        label="Enter Amount"
                        type="number"
                        fullWidth
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        InputProps={{
                            inputProps: { min: 1 },
                            startAdornment: <InputAdornment position="start">$</InputAdornment>
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: '8px' }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleAddMoney}
                    variant="contained"
                    disabled={isPending || !amount || !selectedAccount || parseFloat(amount) <= 0}
                    sx={{
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        px: 4
                    }}
                >
                    {isPending ? <CircularProgress size={24} color="inherit" /> : 'Add Money'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddMoneyDialog;
