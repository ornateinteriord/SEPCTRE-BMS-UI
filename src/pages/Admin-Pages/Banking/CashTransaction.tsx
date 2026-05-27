import React, { useState, useRef } from 'react';
import { Box, Container, Button, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import { useReactToPrint } from 'react-to-print';
import AdminReusableTable, { ColumnDefinition } from '../../../utils/AdminReusableTable';
import { useGetCashTransactions, CashTransaction as CashTransactionType } from '../../../queries/banking';
import CashTransactionTablePrint from '../../../components/Print-components/CashTransaction';

interface CashTx {
  id: string;
  tranNo: string;
  tranDate: string;
  details: string;
  refNo: string;
  withdrawal: number;
  deposits: number;
  balance: number;
}

const CashTransaction: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tablePrintDialogOpen, setTablePrintDialogOpen] = useState(false);
  const tablePrintRef = useRef<HTMLDivElement>(null);

  const { data: cashTransactionsData, isLoading } = useGetCashTransactions(page, 10, searchQuery);
  // Fetch all cash transactions for printing (without pagination)
  const { data: allCashTransactionsData } = useGetCashTransactions(1, 9999, '');

  // Transform API data to table format
  const cashTransactions: CashTx[] = cashTransactionsData?.data?.map((transaction: CashTransactionType) => ({
    id: transaction._id,
    tranNo: transaction.cash_transaction_id,
    tranDate: transaction.transaction_date
      ? new Date(transaction.transaction_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
      : '-',
    details: transaction.description || '-',
    refNo: transaction.reference_no || '-',
    withdrawal: transaction.debit || 0,
    deposits: transaction.credit || 0,
    balance: transaction.balance || 0,
  })) || [];

  const columns: ColumnDefinition<CashTx>[] = [
    {
      id: 'tranNo',
      label: 'Trans. No',
      minWidth: 120,
      sortable: true,
      renderCell: (row: CashTx) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#6366f1' }}>
          {row.tranNo}
        </Typography>
      ),
    },
    {
      id: 'tranDate',
      label: 'Date',
      minWidth: 130,
      sortable: true,
    },
    {
      id: 'details',
      label: 'Details',
      minWidth: 200,
    },
    {
      id: 'refNo',
      label: 'Ref. No',
      minWidth: 120,
    },
    {
      id: 'withdrawal',
      label: 'Withdrawal',
      minWidth: 120,
      align: 'right' as const,
      renderCell: (row: CashTx) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: row.withdrawal > 0 ? '#dc2626' : '#6b7280' }}>
          {row.withdrawal > 0 ? `$ ${row.withdrawal.toFixed(2)}` : '-'}
        </Typography>
      ),
    },
    {
      id: 'deposits',
      label: 'Deposits',
      minWidth: 120,
      align: 'right' as const,
      renderCell: (row: CashTx) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: row.deposits > 0 ? '#10b981' : '#6b7280' }}>
          {row.deposits > 0 ? `$ ${row.deposits.toFixed(2)}` : '-'}
        </Typography>
      ),
    },
    {
      id: 'balance',
      label: 'Balance',
      minWidth: 130,
      align: 'right' as const,
      renderCell: (row: CashTx) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
          $ {row.balance.toFixed(2)}
        </Typography>
      ),
    },
  ];

  const handleSearchChange = (query: string) => {
    setSearchInput(query);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setPage(1);
  };

  const handleTablePrint = useReactToPrint({
    contentRef: tablePrintRef,
  });

  const tableActions = (
    <Button
      variant="contained"
      startIcon={<PrintIcon />}
      onClick={() => setTablePrintDialogOpen(true)}
      sx={{
        textTransform: 'none',
        backgroundColor: '#6366f1',
        '&:hover': { backgroundColor: '#4f46e5' }
      }}
    >
      Print
    </Button>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 9, sm: 12 }, mb: 4, px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Summary Cards */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: { xs: 2, sm: 3 },
        mb: 3
      }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            textAlign: 'center',
            background: '#667eea',
            color: 'white',
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
            Opening Balance
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            $ {cashTransactionsData?.summary?.openingBalance?.toFixed(2) || '0.00'}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            textAlign: 'center',
            background: '#667eea',
            color: 'white',
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
            Debit Amount
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            $ {cashTransactionsData?.summary?.debitAmount?.toFixed(2) || '0.00'}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            textAlign: 'center',
            background: '#667eea',
            color: 'white',
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
            Credit Amount
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            $ {cashTransactionsData?.summary?.creditAmount?.toFixed(2) || '0.00'}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            textAlign: 'center',
            background: '#667eea',
            color: 'white',
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
            Closing Balance
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            $ {cashTransactionsData?.summary?.closingBalance?.toFixed(2) || '0.00'}
          </Typography>
        </Paper>
      </Box>

      {/* Table */}
      <AdminReusableTable<CashTx>
        columns={columns}
        data={cashTransactions}
        title="Cash Transactions"
        isLoading={isLoading}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        searchQuery={searchInput}
        paginationPerPage={10}
        actions={tableActions}
        emptyMessage="No cash transactions found"
        totalCount={cashTransactionsData?.pagination?.total}
        currentPage={page - 1}
        onPageChange={(newPage) => setPage(newPage + 1)}
      />

      {/* Table Print Preview Dialog */}
      <Dialog
        open={tablePrintDialogOpen}
        onClose={() => setTablePrintDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: '16px' }
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Cash Transactions Print Preview
          </Typography>
          <IconButton
            onClick={() => setTablePrintDialogOpen(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, backgroundColor: '#f3f4f6' }}>
          <Box sx={{ maxHeight: '70vh', overflow: 'auto', p: 2 }}>
            <CashTransactionTablePrint
              ref={tablePrintRef}
              transactions={(allCashTransactionsData?.data || []).map((transaction: CashTransactionType) => ({
                cash_transaction_id: transaction.cash_transaction_id,
                transaction_date: transaction.transaction_date,
                description: transaction.description,
                reference_no: transaction.reference_no,
                debit: transaction.debit,
                credit: transaction.credit,
                balance: transaction.balance,
              }))}
              summary={allCashTransactionsData?.summary}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            onClick={() => setTablePrintDialogOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              px: 3,
            }}
          >
            Close
          </Button>
          <Button
            onClick={handleTablePrint}
            variant="contained"
            startIcon={<PrintIcon />}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              px: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CashTransaction;