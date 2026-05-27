import React from 'react';
import { Box, Chip } from '@mui/material';
import AdminReusableTable, { ColumnDefinition } from '../../utils/AdminReusableTable';
import { useGetCollectionTransactions } from '../../queries/Agent';
import TokenService from '../../queries/token/tokenService';

const Report: React.FC = () => {
  const agentId = TokenService.getMemberId();
  const { data: transactionsData, isLoading: transactionsLoading } = useGetCollectionTransactions(agentId || '', !!agentId);

  const transactions = transactionsData?.data || [];

  // Transaction columns
  const transactionColumns: ColumnDefinition<any>[] = [
    {
      id: 'transaction_date',
      label: 'Date',
      sortable: true,
      renderCell: (row) => {
        const date = new Date(row.transaction_date);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      },
    },
    {
      id: 'transaction_id',
      label: 'Transaction ID',
      sortable: true,
    },
    {
      id: 'account_number',
      label: 'Account No',
      sortable: true,
    },
    {
      id: 'Name',
      label: 'Account Holder',
      sortable: true,
    },
    {
      id: 'credit',
      label: 'Amount Collected',
      align: 'right',
      sortable: true,
      renderCell: (row) => `$ ${row.credit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      id: 'balance',
      label: 'Account Balance',
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
                status === 'completed' ? '#d1fae5' :
                  status === 'pending' ? '#fef3c7' :
                    '#fee2e2',
              color:
                status === 'completed' ? '#065f46' :
                  status === 'pending' ? '#92400e' :
                    '#991b1b',
              fontWeight: 500,
              borderRadius: 1,
              textTransform: 'capitalize',
            }}
          />
        );
      },
    },
  ];

  return (
    <Box sx={{ mt: 10, px: 3, pb: 4 }}>
      <AdminReusableTable
        columns={transactionColumns}
        data={transactions}
        title="Transactions"
        isLoading={transactionsLoading}
        emptyMessage="No transactions found"
        onExport={() => {
          console.log('Export transactions');
        }}
      />
    </Box>
  );
};

export default Report;
