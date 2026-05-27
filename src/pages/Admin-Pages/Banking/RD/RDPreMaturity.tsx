import React, { useState, useRef } from 'react';
import { Box, Button, Dialog, DialogContent, DialogActions } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import AdminReusableTable, { ColumnDefinition } from '../../../../utils/AdminReusableTable';
import { useGetPreMaturityAccounts } from '../../../../queries/admin';
import { MaturityAccount } from '../../../../types';
import TablePDF, { PrintColumn } from '../../../../components/Print-components/TablePDF';
import AccountCloseDialog from '../../../../components/Banking/AccountCloseDialog';

const RDPreMaturity: React.FC = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const [printDialogOpen, setPrintDialogOpen] = useState(false);
    const [closeDialogOpen, setCloseDialogOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<MaturityAccount | null>(null);
    const tablePrintRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, refetch } = useGetPreMaturityAccounts(
        page + 1,
        rowsPerPage,
        'AGP003' // RD account type
    );

    // Fetch all data for printing
    const { data: allData } = useGetPreMaturityAccounts(
        1,
        9999,
        'AGP003'
    );

    const handleTablePrint = useReactToPrint({
        contentRef: tablePrintRef,
    });

    const handleOpenCloseDialog = (account: MaturityAccount) => {
        setSelectedAccount(account);
        setCloseDialogOpen(true);
    };

    const columns: ColumnDefinition<MaturityAccount>[] = [
        {
            id: 'account_no',
            label: 'Account No',
            minWidth: 120,
            sortable: true,
        },
        {
            id: 'member_id',
            label: 'Member ID',
            minWidth: 100,
            sortable: true,
        },
        {
            id: 'memberDetails',
            label: 'Member Name',
            minWidth: 150,
            renderCell: (row) => row.memberDetails?.name || '-',
        },
        {
            id: 'account_amount',
            label: 'Amount',
            minWidth: 120,
            align: 'right',
            renderCell: (row) => `$${row.account_amount?.toLocaleString('en-US') || '0'}`,
        },
        {
            id: 'interest_rate',
            label: 'Interest Rate',
            minWidth: 100,
            align: 'right',
            renderCell: (row) => `${row.interest_rate || 0}%`,
        },
        {
            id: 'date_of_opening',
            label: 'Opening Date',
            minWidth: 120,
            renderCell: (row) =>
                row.date_of_opening
                    ? new Date(row.date_of_opening).toLocaleDateString('en-GB')
                    : '-',
        },
        {
            id: 'date_of_maturity',
            label: 'Maturity Date',
            minWidth: 120,
            renderCell: (row) =>
                row.date_of_maturity
                    ? new Date(row.date_of_maturity).toLocaleDateString('en-GB')
                    : '-',
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            sortable: true,
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 100,
            renderCell: (row) => (
                <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    sx={{ textTransform: 'none' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCloseDialog(row);
                    }}
                    disabled={row.status === 'Closed'}
                >
                    {row.status === 'Closed' ? 'Closed' : 'Close'}
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

    // Transform data for print
    const printData = (allData?.data || []).map(row => ({
        ...row,
        'member_name-print': row.memberDetails?.name || '-',
        account_amount: `$${row.account_amount?.toLocaleString('en-US') || '0'}`,
        interest_rate: `${row.interest_rate || 0}%`,
        date_of_opening: row.date_of_opening ? new Date(row.date_of_opening).toLocaleDateString('en-GB') : '-',
        date_of_maturity: row.date_of_maturity ? new Date(row.date_of_maturity).toLocaleDateString('en-GB') : '-',
    }));

    return (
        <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, mt: { xs: 7, sm: 8 } }}>
            <AdminReusableTable
                title="RD Pre-Maturity Accounts"
                columns={columns}
                data={data?.data || []}
                isLoading={isLoading}
                totalCount={data?.pagination?.total}
                currentPage={page}
                paginationPerPage={rowsPerPage}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                emptyMessage="No pre-maturity RD accounts found"
                actions={
                    <Button
                        variant="contained"
                        startIcon={<PrintIcon />}
                        onClick={() => setPrintDialogOpen(true)}
                        disabled={!allData?.data?.length}
                        sx={{ textTransform: 'none' }}
                    >
                        Print
                    </Button>
                }
            />

            {/* Print Dialog */}
            <Dialog
                open={printDialogOpen}
                onClose={() => setPrintDialogOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogContent>
                    <Box ref={tablePrintRef}>
                        <TablePDF
                            title="RD Pre-Maturity Accounts"
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

            {/* Account Close Dialog */}
            <AccountCloseDialog
                open={closeDialogOpen}
                onClose={() => setCloseDialogOpen(false)}
                account={selectedAccount}
                isMatured={false}
                onSuccess={() => refetch()}
            />
        </Box>
    );
};

export default RDPreMaturity;
