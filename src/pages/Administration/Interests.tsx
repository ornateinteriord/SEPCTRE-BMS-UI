import React, { useState } from 'react';
import {
  Box,
  Container,
  Chip,
  Button,
  Alert,
  Snackbar,
  Typography,
  Stack,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import PercentIcon from '@mui/icons-material/Percent';
import AdminReusableTable from '../../utils/AdminReusableTable';
import InterestModifyDialog from '../../utils/InterestModifyDialog';
import {
  useGetInterests,
  useCreateInterest,
  useUpdateInterest
} from '../../queries/admin/index';

const MANUAL_INTERESTS = [
  { interest_id: "FD001", interest_name: "1 YEAR", plan_type: "FD", duration: 12, interest_rate_general: 9, interest_rate_senior: 8.5, minimum_deposit: 1000, status: "active", interest_type: "FD", ref_id: "AGP001" },
  { interest_id: "FD002", interest_name: "2 YEAR", plan_type: "FD", duration: 24, interest_rate_general: 9.5, interest_rate_senior: 10, minimum_deposit: 1000, status: "active", interest_type: "FD", ref_id: "AGP001" },
  { interest_id: "FD003", interest_name: "3 YEAR", plan_type: "FD", duration: 36, interest_rate_general: 10, interest_rate_senior: 10.5, minimum_deposit: 1000, status: "active", interest_type: "FD", ref_id: "AGP001" },
  { interest_id: "FD004", interest_name: "4 YEAR", plan_type: "FD", duration: 48, interest_rate_general: 11, interest_rate_senior: 11.5, minimum_deposit: 1000, status: "active", interest_type: "FD", ref_id: "AGP001" },
  { interest_id: "FD005", interest_name: "5 YEAR", plan_type: "FD", duration: 60, interest_rate_general: 13, interest_rate_senior: 13, minimum_deposit: 1000, status: "active", interest_type: "FD", ref_id: "AGP001" },
  { interest_id: "RD001", interest_name: "1 YEAR", plan_type: "RD", duration: 12, interest_rate_general: 6, interest_rate_senior: 6.5, minimum_deposit: 500, status: "active", interest_type: "RD", ref_id: "AGP002" },
  { interest_id: "RD002", interest_name: "2 YEAR", plan_type: "RD", duration: 24, interest_rate_general: 7, interest_rate_senior: 7.5, minimum_deposit: 500, status: "active", interest_type: "RD", ref_id: "AGP002" },
  { interest_id: "RD003", interest_name: "3 YEAR", plan_type: "RD", duration: 36, interest_rate_general: 9, interest_rate_senior: 9.5, minimum_deposit: 500, status: "active", interest_type: "RD", ref_id: "AGP002" },
  { interest_id: "RD004", interest_name: "4 YEAR", plan_type: "RD", duration: 48, interest_rate_general: 10, interest_rate_senior: 10.5, minimum_deposit: 500, status: "active", interest_type: "RD", ref_id: "AGP002" },
  { interest_id: "RD005", interest_name: "5 YEAR", plan_type: "RD", duration: 60, interest_rate_general: 12, interest_rate_senior: 12.5, minimum_deposit: 500, status: "active", interest_type: "RD", ref_id: "AGP002" },
  { interest_id: "PG001", interest_name: "1 YEAR", plan_type: "PIGMY", duration: 12, interest_rate_general: 5, interest_rate_senior: 5.5, minimum_deposit: 100, status: "active", interest_type: "PIGMY", ref_id: "AGP005" },
  { interest_id: "PG002", interest_name: "2 YEAR", plan_type: "PIGMY", duration: 24, interest_rate_general: 8, interest_rate_senior: 8.5, minimum_deposit: 100, status: "active", interest_type: "PIGMY", ref_id: "AGP005" },
  { interest_id: "PG003", interest_name: "3 YEAR", plan_type: "PIGMY", duration: 36, interest_rate_general: 10, interest_rate_senior: 10.5, minimum_deposit: 100, status: "active", interest_type: "PIGMY", ref_id: "AGP005" },
  { interest_id: "PG004", interest_name: "PIGMI SAVING", plan_type: "PIGMY SAVING", duration: 6, interest_rate_general: 4, interest_rate_senior: 4, minimum_deposit: 100, status: "active", interest_type: "PIGMY", ref_id: "AGP005" },
  { interest_id: "PG005", interest_name: "PIGMI LOAN", plan_type: "PIGMY LOAN", duration: 3, interest_rate_general: 0, interest_rate_senior: 0, minimum_deposit: 0, status: "active", interest_type: "PIGMY", ref_id: "AGP005" },
  { interest_id: "PG006", interest_name: "PIGMI GOLD LOAN", plan_type: "PIGMY GOLD LOAN", duration: 12, interest_rate_general: 0, interest_rate_senior: 0, minimum_deposit: 0, status: "active", interest_type: "PIGMY", ref_id: "AGP005" },
];

const Interests: React.FC = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
  const [selectedInterestId, setSelectedInterestId] = useState<string | null>(null);

  // React Query Hooks
  const { data: interestsData, isLoading } = useGetInterests(page, rowsPerPage, searchQuery);
  const createInterestMutation = useCreateInterest();
  const updateInterestMutation = useUpdateInterest();

  // Transform API data to table format
  const rawData = (interestsData?.data && interestsData.data.length > 0) ? interestsData.data : MANUAL_INTERESTS;

  const interests = rawData.map((interest: any) => ({
    id: interest._id || '',
    interest_id: interest.interest_id,
    interest_name: interest.interest_name,
    plan_type: interest.plan_type,
    duration: `${interest.duration || 0} Months`,
    interest_rate_general: `${interest.interest_rate_general || interest.interest_rate || 0}%`,
    interest_rate_senior: `${interest.interest_rate_senior || 0}%`,
    minimum_deposit: `$${interest.minimum_deposit}`,
    status: interest.status === 'active' ? 'Active' : 'Inactive',
    interest_type: interest.interest_type || interest.plan_type,
    ref_id: interest.ref_id || '-',
  })) || [];

  const columns = [
    {
      id: 'interest_id',
      label: 'Interest ID',
      sortable: true,
      minWidth: 120,
      renderCell: (row: any) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#6366f1' }}>
          {row.interest_id}
        </Typography>
      ),
    },
    {
      id: 'interest_name',
      label: 'Plan Name',
      sortable: true,
      minWidth: 150,
      renderCell: (row: any) => (
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
          {row.interest_name}
        </Typography>
      ),
    },
    {
      id: 'plan_type',
      label: 'Type',
      sortable: true,
      minWidth: 120,
      renderCell: (row: any) => (
        <Chip
          label={row.plan_type}
          size="small"
          sx={{
            backgroundColor: '#f1f5f9',
            color: '#475569',
            fontWeight: 600,
            borderRadius: 1
          }}
        />
      ),
    },
    {
      id: 'duration',
      label: 'Duration',
      sortable: true,
      minWidth: 120,
      align: 'center' as const,
    },
    {
      id: 'interest_rate_general',
      label: 'General (%)',
      sortable: true,
      minWidth: 120,
      align: 'right' as const,
      renderCell: (row: any) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
          {row.interest_rate_general}
        </Typography>
      ),
    },
    {
      id: 'interest_rate_senior',
      label: 'Senior (%)',
      sortable: true,
      minWidth: 120,
      align: 'right' as const,
      renderCell: (row: any) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
          {row.interest_rate_senior}
        </Typography>
      ),
    },
    {
      id: 'ref_id',
      label: 'Ref ID',
      minWidth: 100,
      align: 'center' as const,
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      minWidth: 100,
      align: 'center' as const,
      renderCell: (row: any) => (
        <Chip
          label={row.status}
          size="small"
          sx={{
            backgroundColor: row.status === 'Active' ? '#d1fae5' : '#fee2e2',
            color: row.status === 'Active' ? '#065f46' : '#991b1b',
            fontWeight: 600,
            borderRadius: 1,
          }}
        />
      ),
    },
    {
      id: 'modify',
      label: 'Edit',
      minWidth: 80,
      align: 'center' as const,
      renderCell: (row: any) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleModifyClick(row.id);
          }}
          sx={{ color: '#64748b' }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
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

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  const handleModifyClick = (id: string) => {
    setSelectedInterestId(id);
    setModifyDialogOpen(true);
  };

  const handleAddInterest = () => {
    setSelectedInterestId(null);
    setModifyDialogOpen(true);
  };

  const handleModifySave = (data: any, isEdit?: boolean) => {
    if (isEdit && selectedInterestId) {
      updateInterestMutation.mutate(
        {
          interestId: selectedInterestId,
          data: data
        },
        {
          onSuccess: () => {
            setSnackbar({
              open: true,
              message: 'Interest rate updated successfully',
              severity: 'success'
            });
            setModifyDialogOpen(false);
          },
          onError: (error: any) => {
            setSnackbar({
              open: true,
              message: error?.message || 'Failed to update interest rate',
              severity: 'error'
            });
          }
        }
      );
    } else {
      createInterestMutation.mutate(data, {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: 'New interest rate created successfully',
            severity: 'success'
          });
          setModifyDialogOpen(false);
        },
        onError: (error: any) => {
          setSnackbar({
            open: true,
            message: error?.message || 'Failed to create interest rate',
            severity: 'error'
          });
        }
      });
    }
  };

  const tableActions = (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={handleAddInterest}
      sx={{
        textTransform: 'none',
        borderRadius: 1,
        backgroundColor: '#1a237e',
        '&:hover': { backgroundColor: '#283593' }
      }}
    >
      Add Interest
    </Button>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
          <Box sx={{
            p: 1,
            borderRadius: 1,
            backgroundColor: '#e0e7ff',
            color: '#4338ca',
            display: 'flex'
          }}>
            <PercentIcon />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
            Interest Management
          </Typography>
        </Stack>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Configure and manage interest rates for FD, RD, PIGMY and other schemes.
        </Typography>
      </Box>

      {/* Main Table */}
      <AdminReusableTable<any>
        columns={columns}
        data={interests}
        title="Interest Rates"
        isLoading={isLoading}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        searchQuery={searchInput}
        paginationPerPage={rowsPerPage}
        actions={tableActions}
        emptyMessage="No interest rates found"
        totalCount={interestsData?.pagination?.total}
        currentPage={page - 1}
        onPageChange={(newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Modify Dialog */}
      <InterestModifyDialog
        open={modifyDialogOpen}
        onClose={() => {
          setModifyDialogOpen(false);
          setSelectedInterestId(null);
        }}
        onSave={handleModifySave}
        interestId={selectedInterestId}
        isLoading={createInterestMutation.isPending || updateInterestMutation.isPending}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 1 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Interests;
