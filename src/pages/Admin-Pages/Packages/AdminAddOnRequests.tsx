import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DataTable from 'react-data-table-component';
import { DASHBOARD_CUTSOM_STYLE } from '../../../utils/DataTableColumnsProvider';
import { useGetAddOnRequests, useEvaluateAddOnMutation } from '../../../api/Packages';
import { useState } from 'react';

const AdminAddOnRequests = () => {
  const { data: requests, isLoading } = useGetAddOnRequests();
  const { mutate: evaluateRequest, isPending: isEvaluating } = useEvaluateAddOnMutation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleAction = (request_id: string, status: 'APPROVED' | 'REJECTED') => {
    evaluateRequest({
      request_id,
      status,
      admin_id: "ADMIN_OVERRIDE" // Should pull from context in real app, hardcoded safely for now
    });
  };

  const columns = [
    { name: 'Request ID', selector: (row: any) => row.request_id, sortable: true, wrap: true },
    { name: 'Member ID', selector: (row: any) => row.member_id, sortable: true },
    {
      name: 'Amount Requested',
      selector: (row: any) => `$${row.requested_amount}`,
      sortable: true
    },
    {
      name: 'TX No',
      selector: (row: any) => row.tx_no || 'N/A',
      sortable: true,
      wrap: true
    },
    {
      name: 'Screenshot',
      cell: (row: any) => (
        row.screenshot_url ? (
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<VisibilityIcon />}
            onClick={() => setPreviewImage(row.screenshot_url)}
          >
            View
          </Button>
        ) : (
          <Typography variant="caption" color="text.secondary">No Image</Typography>
        )
      )
    },
    {
      name: 'Status',
      cell: (row: any) => (
        <Chip
          label={row.status}
          color={row.status === 'APPROVED' ? 'success' : row.status === 'REJECTED' ? 'error' : 'warning'}
          size="small"
        />
      ),
      sortable: true
    },
    { name: 'Date', selector: (row: any) => new Date(row.createdAt).toLocaleDateString(), sortable: true },
    {
      name: 'Actions',
      cell: (row: any) => (
        row.status === 'PENDING' ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => handleAction(row.request_id, 'APPROVED')}
              disabled={isEvaluating}
            >
              Approve
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => handleAction(row.request_id, 'REJECTED')}
              disabled={isEvaluating}
            >
              Reject
            </Button>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">Evaluated</Typography>
        )
      ),
      minWidth: '250px'
    }
  ];

  return (
    <>
      <Typography variant="h4" sx={{ margin: '2rem', mt: 10 }}>
        Load Fund Requests
      </Typography>

      <Card sx={{ margin: '2rem', mt: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#0a2558', mb: 2 }}>
            Manage Member Load Fund Approvals
          </Typography>
          <DataTable
            columns={columns}
            data={requests || []}
            pagination
            progressPending={isLoading}
            progressComponent={<CircularProgress />}
            customStyles={DASHBOARD_CUTSOM_STYLE}
          />
        </CardContent>
      </Card>

      {/* Screenshot Preview Dialog */}
      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Transaction Receipt Screenshot</Typography>
          <IconButton onClick={() => setPreviewImage(null)} color="inherit">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2, display: 'flex', justifyContent: 'center', bgcolor: '#f4f7f9' }}>
          {previewImage && (
            <Box
              component="img"
              src={previewImage}
              alt="Receipt Preview"
              sx={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminAddOnRequests;
