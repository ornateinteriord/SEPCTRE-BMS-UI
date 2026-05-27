import { forwardRef } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

interface ReceiptData {
    receipt_id: string;
    receipt_date: string | Date;
    received_from: string;
    receipt_details: string;
    mode_of_payment_received: string;
    amount: number;
    status?: string;
}

interface ReceiptsTablePrintProps {
    receipts: ReceiptData[];
    dateRange?: string;
}

const ReceiptsTablePrint = forwardRef<HTMLDivElement, ReceiptsTablePrintProps>(({ receipts, dateRange }, ref) => {
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

    const calculateTotal = () => {
        return receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
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
                    Receipts Register
                </Typography>

                {dateRange && (
                    <Typography variant="body2" sx={{ textAlign: 'center', fontSize: '11px', mb: 2 }}>
                        {dateRange}
                    </Typography>
                )}
            </Box>

            {/* Table */}
            <Table
                sx={{
                    border: '1px solid #000',
                    '& td, & th': {
                        border: '1px solid #000',
                        padding: '8px',
                        fontSize: '10px'
                    }
                }}
            >
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                        <TableCell sx={{ fontWeight: 700, width: '5%' }}>S.No</TableCell>
                        <TableCell sx={{ fontWeight: 700, width: '12%' }}>Voucher No</TableCell>
                        <TableCell sx={{ fontWeight: 700, width: '12%' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 700, width: '18%' }}>Received From</TableCell>
                        <TableCell sx={{ fontWeight: 700, width: '23%' }}>Details</TableCell>
                        <TableCell sx={{ fontWeight: 700, width: '15%' }}>Payment Mode</TableCell>
                        <TableCell sx={{ fontWeight: 700, width: '15%', textAlign: 'right' }}>Amount ($)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {receipts.map((receipt, index) => (
                        <TableRow key={receipt.receipt_id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{receipt.receipt_id}</TableCell>
                            <TableCell>{formatDate(receipt.receipt_date)}</TableCell>
                            <TableCell>{receipt.received_from}</TableCell>
                            <TableCell>{receipt.receipt_details}</TableCell>
                            <TableCell>{receipt.mode_of_payment_received}</TableCell>
                            <TableCell sx={{ textAlign: 'right', fontWeight: 600 }}>
                                {receipt.amount.toFixed(2)}
                            </TableCell>
                        </TableRow>
                    ))}

                    {/* Total Row */}
                    <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                        <TableCell colSpan={6} sx={{ fontWeight: 700, textAlign: 'right' }}>
                            Total:
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right', fontWeight: 700, fontSize: '11px' }}>
                            $ {calculateTotal().toFixed(2)}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            {/* Footer */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ fontSize: '9px', color: '#666' }}>
                    Total Receipts: {receipts.length} | Total Amount: $ {calculateTotal().toFixed(2)}
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
});

ReceiptsTablePrint.displayName = 'ReceiptsTablePrint';

export default ReceiptsTablePrint;
