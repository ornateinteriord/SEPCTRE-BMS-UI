import React, { useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Box,
    Typography,
    Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import { useGetAdminTransactions } from '../../queries/Transaction';
import AdminReusableTable, { type ColumnDefinition } from '../../utils/AdminReusableTable';
import { type Transaction } from '../../types/Transaction';
import TablePDF, { PrintColumn } from '../Print-components/TablePDF';

interface TransactionDialogProps {
    open: boolean;
    onClose: () => void;
    memberId: string;
    accountType?: string;
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({
    open,
    onClose,
    memberId,
    accountType
}) => {
    const [printDialogOpen, setPrintDialogOpen] = useState(false);
    const tablePrintRef = useRef<HTMLDivElement>(null);

    const { data, isLoading } = useGetAdminTransactions(memberId, accountType);

    const handleTablePrint = useReactToPrint({
        contentRef: tablePrintRef,
    });

    const columns: ColumnDefinition<Transaction>[] = [
        {
            id: 'transaction_id',
            label: 'Transaction ID',
            minWidth: 120,
            sortable: true,
        },
        {
            id: 'transaction_date',
            label: 'Date',
            minWidth: 120,
            sortable: true,
            renderCell: (row) => {
                return new Date(row.transaction_date).toLocaleDateString('en-GB');
            }
        },
        {
            id: 'account_type',
            label: 'Account Type',
            minWidth: 100,
        },
        {
            id: 'transaction_type',
            label: 'Type',
            minWidth: 120,
        },
        {
            id: 'description',
            label: 'Description',
            minWidth: 200,
        },
        {
            id: 'credit',
            label: 'Credit',
            minWidth: 100,
            align: 'right',
            renderCell: (row) => {
                return row.credit > 0 ? `$${row.credit.toLocaleString('en-US')}` : '-';
            }
        },
        {
            id: 'debit',
            label: 'Debit',
            minWidth: 100,
            align: 'right',
            renderCell: (row) => {
                return row.debit > 0 ? `$${row.debit.toLocaleString('en-US')}` : '-';
            }
        },
        {
            id: 'balance',
            label: 'Balance',
            minWidth: 120,
            align: 'right',
            renderCell: (row) => {
                return `$${row.balance.toLocaleString('en-US')}`;
            }
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 100,
        },
    ];

    const printColumns: PrintColumn[] = [
        { id: 'transaction_id', label: 'Txn ID', width: '12%' },
        { id: 'transaction_date', label: 'Date', width: '12%' },
        { id: 'account_type', label: 'Account', width: '10%' },
        { id: 'transaction_type', label: 'Type', width: '12%' },
        { id: 'description', label: 'Description', width: '20%' },
        { id: 'credit', label: 'Credit', width: '12%', align: 'right' },
        { id: 'debit', label: 'Debit', width: '12%', align: 'right' },
        { id: 'balance', label: 'Balance', width: '10%', align: 'right' },
    ];

    // Transform data for print
    const printData = (data?.data || []).map(row => ({
        ...row,
        transaction_date: new Date(row.transaction_date).toLocaleDateString('en-GB'),
        credit: row.credit > 0 ? `$${row.credit.toLocaleString('en-US')}` : '-',
        debit: row.debit > 0 ? `$${row.debit.toLocaleString('en-US')}` : '-',
        balance: `$${row.balance.toLocaleString('en-US')}`,
    }));

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="xl"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        minHeight: '85vh'
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #e2e8f0',
                    pb: 2
                }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e' }}>
                            Transaction History
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Member ID: {memberId}
                            {accountType && ` | Account Type: ${accountType}`}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            startIcon={<PrintIcon />}
                            onClick={() => setPrintDialogOpen(true)}
                            disabled={!data?.data?.length}
                            sx={{ textTransform: 'none' }}
                        >
                            Print
                        </Button>
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    <AdminReusableTable
                        columns={columns}
                        data={data?.data || []}
                        title=""
                        isLoading={isLoading}
                        emptyMessage="No transactions found"
                        paginationPerPage={25}
                    />
                </DialogContent>
            </Dialog>

            {/* Print Preview Dialog */}
            <Dialog
                open={printDialogOpen}
                onClose={() => setPrintDialogOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogContent>
                    <Box ref={tablePrintRef}>
                        <TablePDF
                            title={`Transaction History - ${memberId}${accountType ? ` (${accountType})` : ''}`}
                            columns={printColumns}
                            data={printData}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPrintDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleTablePrint}
                        startIcon={<PrintIcon />}
                    >
                        Print
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TransactionDialog;
