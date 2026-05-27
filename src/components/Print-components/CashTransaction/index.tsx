import { forwardRef } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { CashTransactionSummary } from '../../../queries/banking';

interface CashTransactionData {
    cash_transaction_id: string;
    transaction_date: string | Date;
    description: string;
    reference_no: string;
    debit: number;
    credit: number;
    balance: number;
}

interface CashTransactionTablePrintProps {
    transactions: CashTransactionData[];
    summary?: CashTransactionSummary;
    dateRange?: string;
}

const CashTransactionTablePrint = forwardRef<HTMLDivElement, CashTransactionTablePrintProps>(
    ({ transactions, summary, dateRange }, ref) => {
        const formatDate = (date: string | Date) => {
            const d = new Date(date);
            return d.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        };

        const getCurrentDateTime = () => {
            const now = new Date();
            return now.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        };

        return (
            <Box
                ref={ref}
                sx={{
                    width: '297mm', // A4 landscape width
                    minHeight: '210mm', // A4 landscape height
                    padding: '15mm',
                    backgroundColor: 'white',
                    fontFamily: 'Arial, sans-serif',
                    '@media print': {
                        padding: '10mm',
                        margin: 0,
                        '@page': {
                            size: 'A4 landscape',
                        }
                    }
                }}
            >
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontSize: '10px', mb: 2 }}>
                        {getCurrentDateTime()}
                    </Typography>

                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 700, mb: 0.5 }}>
                            Manipal society
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '11px' }}>
                            Bangalore | None,560060 | 9100000000 | mail@manipal.com
                        </Typography>
                    </Box>

                    <Typography
                        variant="h5"
                        sx={{
                            textAlign: 'center',
                            fontWeight: 700,
                            fontSize: '16px',
                            mb: 1
                        }}
                    >
                        Cash Transaction Register
                    </Typography>

                    {dateRange && (
                        <Typography variant="body2" sx={{ textAlign: 'center', fontSize: '11px', mb: 2 }}>
                            {dateRange}
                        </Typography>
                    )}
                </Box>

                {/* Summary Row */}
                {summary && (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: 2,
                            mb: 3,
                            p: 2,
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                        }}
                    >
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ fontSize: '9px', display: 'block', mb: 0.5 }}>
                                Opening Balance
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '13px', fontWeight: 700 }}>
                                $ {summary.openingBalance.toFixed(2)}
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ fontSize: '9px', display: 'block', mb: 0.5 }}>
                                Debit Amount
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '13px', fontWeight: 700, color: '#dc2626' }}>
                                $ {summary.debitAmount.toFixed(2)}
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ fontSize: '9px', display: 'block', mb: 0.5 }}>
                                Credit Amount
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>
                                $ {summary.creditAmount.toFixed(2)}
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ fontSize: '9px', display: 'block', mb: 0.5 }}>
                                Closing Balance
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '13px', fontWeight: 700 }}>
                                $ {summary.closingBalance.toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>
                )}

                {/* Table */}
                <Table
                    sx={{
                        border: '1px solid #000',
                        '& td, & th': {
                            border: '1px solid #000',
                            padding: '6px',
                            fontSize: '9px'
                        }
                    }}
                >
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                            <TableCell sx={{ fontWeight: 700, width: '5%' }}>S.No</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: '12%' }}>Trans. No</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: '12%' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: '20%' }}>Details</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: '12%' }}>Ref. No</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: '13%', textAlign: 'right' }}>Withdrawal ($)</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: '13%', textAlign: 'right' }}>Deposits ($)</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: '13%', textAlign: 'right' }}>Balance ($)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction, index) => (
                            <TableRow key={transaction.cash_transaction_id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>{transaction.cash_transaction_id}</TableCell>
                                <TableCell>{formatDate(transaction.transaction_date)}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>{transaction.reference_no || '-'}</TableCell>
                                <TableCell sx={{ textAlign: 'right', color: '#dc2626', fontWeight: 600 }}>
                                    {transaction.debit > 0 ? transaction.debit.toFixed(2) : '-'}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'right', color: '#10b981', fontWeight: 600 }}>
                                    {transaction.credit > 0 ? transaction.credit.toFixed(2) : '-'}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'right', fontWeight: 700 }}>
                                    {transaction.balance.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Footer */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ fontSize: '9px', color: '#666' }}>
                        Total Transactions: {transactions.length}
                    </Typography>
                </Box>

                {/* Page Footer */}
                <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid #ccc', textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ fontSize: '8px', color: '#666' }}>
                        Printed on {getCurrentDateTime()}
                    </Typography>
                </Box>
            </Box>
        );
    }
);

CashTransactionTablePrint.displayName = 'CashTransactionTablePrint';

export default CashTransactionTablePrint;
