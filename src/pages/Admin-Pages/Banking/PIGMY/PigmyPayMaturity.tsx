import React, { useState, useRef } from 'react';
import { Box, Button, Dialog, DialogContent, DialogActions } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import AdminReusableTable, { ColumnDefinition } from '../../../../utils/AdminReusableTable';
import { useGetPostMaturityAccounts } from '../../../../queries/admin';
import { MaturityAccount } from '../../../../types';
import TablePDF, { PrintColumn } from '../../../../components/Print-components/TablePDF';
import AccountCloseDialog from '../../../../components/Banking/AccountCloseDialog';

const PigmyPayMaturity: React.FC = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const [printDialogOpen, setPrintDialogOpen] = useState(false);
    const [closeDialogOpen, setCloseDialogOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<MaturityAccount | null>(null);
    const tablePrintRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, refetch } = useGetPostMaturityAccounts(
        page + 1,
        rowsPerPage,
        'AGP005' // PIGMY account type
    );

    const { data: allData } = useGetPostMaturityAccounts(1, 9999, 'AGP005');

    const handleTablePrint = useReactToPrint({ contentRef: tablePrintRef });

    const handleOpenCloseDialog = (account: MaturityAccount) => {
        setSelectedAccount(account);
        setCloseDialogOpen(true);
    };

    const columns: ColumnDefinition<MaturityAccount>[] = [
        { id: 'account_no', label: 'Account No', minWidth: 120, sortable: true },
        { id: 'member_id', label: 'Member ID', minWidth: 100, sortable: true },
        { id: 'memberDetails', label: 'Member Name', minWidth: 150, renderCell: (row) => row.memberDetails?.name || '-' },
        { id: 'account_amount', label: 'Amount', minWidth: 120, align: 'right', renderCell: (row) => `$${row.account_amount?.toLocaleString('en-US') || '0'}` },
        { id: 'interest_rate', label: 'Interest Rate', minWidth: 100, align: 'right', renderCell: (row) => `${row.interest_rate || 0}%` },
        { id: 'date_of_opening', label: 'Opening Date', minWidth: 120, renderCell: (row) => row.date_of_opening ? new Date(row.date_of_opening).toLocaleDateString('en-GB') : '-' },
        { id: 'date_of_maturity', label: 'Maturity Date', minWidth: 120, renderCell: (row) => row.date_of_maturity ? new Date(row.date_of_maturity).toLocaleDateString('en-GB') : '-' },
        { id: 'status', label: 'Status', minWidth: 100, sortable: true },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 120,
            renderCell: (row) => (
                <Button
                    variant="contained"
                    size="small"
                    sx={{
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    }}
                    onClick={(e) => { e.stopPropagation(); handleOpenCloseDialog(row); }}
                    disabled={row.status === 'Closed'}
                >
                    {row.status === 'Closed' ? 'Paid' : 'Pay & Close'}
                </Button>
            ),
        },
    ];

    const printColumns: PrintColumn[] = [
        { id: 'account_no', label: 'Account No', width: '15%' },
        { id: 'member_id', label: 'Member ID', width: '10%' },
        { id: 'member_name-print', label: 'Member Name', width: '20%' },
        { id: 'account_amount', label: 'Amount', width: '15%', align: 'right' },
        { id: 'interest_rate', label: 'Interest', width: '10%', align: 'right' },
        { id: 'date_of_opening', label: 'Opening Date', width: '15%' },
        { id: 'date_of_maturity', label: 'Maturity Date', width: '15%' },
    ];

    const printData = (allData?.data || []).map(row => ({
        ...row,
        'member_name-print': row.memberDetails?.name || '-',
        account_amount: `$${row.account_amount?.toLocaleString('en-US') || '0'}`,
        interest_rate: `${row.interest_rate || 0}%`,
        date_of_opening: row.date_of_opening ? new Date(row.date_of_opening).toLocaleDateString('en-GB') : '-',
        date_of_maturity: row.date_of_maturity ? new Date(row.date_of_maturity).toLocaleDateString('en-GB') : '-',
    }));

    return (
        <Box sx={{ p: 3, mt: 8 }}>
            <AdminReusableTable
                title="PIGMY Pay Maturity (Post-Maturity) Accounts"
                columns={columns}
                data={data?.data || []}
                isLoading={isLoading}
                totalCount={data?.pagination?.total}
                currentPage={page}
                paginationPerPage={rowsPerPage}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                emptyMessage="No post-maturity PIGMY accounts found"
                actions={
                    <Button variant="contained" startIcon={<PrintIcon />} onClick={() => setPrintDialogOpen(true)} disabled={!allData?.data?.length} sx={{ textTransform: 'none' }}>
                        Print
                    </Button>
                }
            />

            <Dialog open={printDialogOpen} onClose={() => setPrintDialogOpen(false)} maxWidth="lg" fullWidth>
                <DialogContent>
                    <Box ref={tablePrintRef}>
                        <TablePDF title="PIGMY Pay Maturity (Post-Maturity) Accounts" columns={printColumns} data={printData} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPrintDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleTablePrint} startIcon={<PrintIcon />}>Print</Button>
                </DialogActions>
            </Dialog>

            <AccountCloseDialog
                open={closeDialogOpen}
                onClose={() => setCloseDialogOpen(false)}
                account={selectedAccount}
                isMatured={true}
                onSuccess={() => refetch()}
            />
        </Box>
    );
};

export default PigmyPayMaturity;
