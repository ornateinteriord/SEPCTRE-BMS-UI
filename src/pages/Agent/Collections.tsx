import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AdminReusableTable, { ColumnDefinition } from '../../utils/AdminReusableTable';
import { useGetAssignedAccounts, useCollectPayment } from '../../queries/Agent';
import TokenService from '../../queries/token/tokenService';
import { AssignedAccount } from '../../types';

const Collections: React.FC = () => {
  const agentId = TokenService.getMemberId();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const typeFilter = searchParams.get('type');

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AssignedAccount | null>(null);
  const [amount, setAmount] = useState('');

  const { data, isLoading } = useGetAssignedAccounts(agentId || '', !!agentId);
  const collectPaymentMutation = useCollectPayment(agentId || '');

  const allAccounts = data?.data || [];

  // Filter accounts by type if filter is specified in URL
  const accounts = useMemo(() => {
    if (!typeFilter) return allAccounts;
    return allAccounts.filter((acc: AssignedAccount) => acc.account_type === typeFilter);
  }, [allAccounts, typeFilter]);

  const handleOpenDialog = (account: AssignedAccount) => {
    setSelectedAccount(account);
    setOpenDialog(true);
    setAmount('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAccount(null);
    setAmount('');
  };

  const handleCollect = async () => {
    if (!selectedAccount || !amount || !selectedAccount.account_id) return;

    try {
      const response = await collectPaymentMutation.mutateAsync({
        accountId: selectedAccount.account_id,
        amount: parseFloat(amount)
      });

      if (response.success) {
        toast.success(`Successfully collected $${amount} from ${selectedAccount.account_holder}`);
        handleCloseDialog();
      } else {
        toast.error(response.message || 'Failed to collect payment');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to collect payment');
      console.error('Collection error:', error);
    }
  };

  const columns: ColumnDefinition<AssignedAccount>[] = [
    {
      id: 'date_of_opening',
      label: 'Date Of Opening',
      sortable: true,
      renderCell: (row) => {
        if (!row.date_of_opening) return '-';
        const date = new Date(row.date_of_opening);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      },
    },
    {
      id: 'account_no',
      label: 'Account No',
      sortable: true,
    },
    {
      id: 'account_holder',
      label: 'Account Holder',
      sortable: true,
    },
    {
      id: 'account_type',
      label: 'Account Type',
      sortable: true,
      renderCell: (row) => (
        <Chip
          label={row.account_type || '-'}
          size="small"
          sx={{
            backgroundColor: '#e0e7ff',
            color: '#4338ca',
            fontWeight: 600,
            borderRadius: 1,
          }}
        />
      ),
    },
    {
      id: 'date_of_maturity',
      label: 'Date Of Maturity',
      sortable: true,
      renderCell: (row) => {
        if (!row.date_of_maturity) return '-';
        const date = new Date(row.date_of_maturity);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      },
    },
    {
      id: 'balance',
      label: 'Balance',
      align: 'right',
      sortable: true,
      renderCell: (row) => `$ ${row.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      renderCell: (row) => {
        const status = row.status.toLowerCase();
        return (
          <Chip
            label={row.status}
            size="small"
            sx={{
              backgroundColor:
                status === 'active' ? '#d1fae5' :
                  status === 'pending' ? '#fef3c7' :
                    '#f1f5f9',
              color:
                status === 'active' ? '#065f46' :
                  status === 'pending' ? '#92400e' :
                    '#64748b',
              fontWeight: 500,
              borderRadius: 1,
              textTransform: 'capitalize',
            }}
          />
        );
      },
    },
    {
      id: 'account_id',
      label: 'Action',
      align: 'center',
      renderCell: (row) => (
        <Button
          variant="contained"
          size="small"
          sx={{
            textTransform: 'none',
            background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleOpenDialog(row);
          }}
        >
          Collect
        </Button>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ mt: 10, px: 3, pb: 4 }}>
        {/* Filter Header */}
        {typeFilter && (
          <Box sx={{
            mb: 2,
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667EEA 0%, #818CF8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: 'white', fontWeight: 500 }}>
                Showing accounts for:
              </Typography>
              <Chip
                label={typeFilter}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: '#4338ca',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              />
            </Box>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/agent/collections')}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Show All Accounts
            </Button>
          </Box>
        )}

        <AdminReusableTable
          columns={columns}
          data={accounts}
          title={typeFilter ? `${typeFilter} Accounts` : 'List Of Collections'}
          isLoading={isLoading}
          emptyMessage={typeFilter ? `No ${typeFilter} accounts found` : 'No assigned accounts found'}
          onExport={() => {
            // TODO: Implement export functionality if needed
            console.log('Export accounts');
          }}
        />
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{
          pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Collect Payment
          </Typography>
          <IconButton
            onClick={handleCloseDialog}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 2 }}>
          {selectedAccount && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Account Details
              </Typography>
              <Box sx={{
                p: 2,
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                mb: 3
              }}>
                <Typography variant="body2">
                  <strong>Account No:</strong> {selectedAccount.account_no}
                </Typography>
                <Typography variant="body2">
                  <strong>Account Holder:</strong> {selectedAccount.account_holder}
                </Typography>
                <Typography variant="body2">
                  <strong>Balance:</strong> $ {selectedAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Box>
          )}

          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter collection amount"
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderRadius: 1,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCollect}
            variant="contained"
            disabled={!amount || parseFloat(amount) <= 0 || collectPaymentMutation.isPending}
            sx={{
              textTransform: 'none',
              background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
              },
              borderRadius: 1,
              px: 3
            }}
          >
            {collectPaymentMutation.isPending ? 'Collecting...' : 'Collect'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Collections;
