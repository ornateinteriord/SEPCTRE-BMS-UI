import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    IconButton,
    Box,
    Typography,
    Grid,
    CircularProgress,
    Backdrop,
    InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useGetInterestById } from '../queries/admin/index';

interface InterestFormData {
    interest_id: string;
    interest_type: string;
    ref_id: string;
    plan_type: string;
    interest_name: string;
    duration: string;
    interest_rate_general: string;
    interest_rate_senior: string;
    minimum_deposit: string;
    from_date?: string;
    to_date?: string;
}

interface InterestModifyDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: any, isEdit?: boolean) => void;
    interestId?: string | null;
    isLoading?: boolean;
}

const InterestModifyDialog: React.FC<InterestModifyDialogProps> = ({
    open,
    onClose,
    onSave,
    interestId,
    isLoading: externalLoading
}) => {
    const isEditMode = !!interestId;

    // Fetch interest data when editing
    const { data: interestData, isLoading: isFetching, isError } = useGetInterestById(
        interestId || '',
        isEditMode && open
    );

    const [formData, setFormData] = useState<InterestFormData>({
        interest_id: '',
        interest_type: '',
        ref_id: '',
        plan_type: 'FD',
        interest_name: '',
        duration: '',
        interest_rate_general: '',
        interest_rate_senior: '',
        minimum_deposit: '',
        from_date: '',
        to_date: '',
    });

    // Plan type options - Matches backend InterestModel enum: ["FD", "RD", "PIGMY", "SAVING", "PIGMY SAVING", "PIGMY LOAN", "PIGMY GOLD LOAN"]
    const planTypes = ['FD', 'RD', 'PIGMY', 'SAVING', 'PIGMY SAVING', 'PIGMY LOAN', 'PIGMY GOLD LOAN'];

    // Duration-based interest slab names for deposits
    const depositDurations = [
        '1 YEAR',
        '2 YEAR',
        '3 YEAR',
        '4 YEAR',
        '5 YEAR'
    ];

    // Update form data when interest data is fetched
    useEffect(() => {
        if (isEditMode && interestData?.data) {
            const interest = interestData.data;
            setFormData({
                interest_id: interest.interest_id || '',
                interest_type: interest.interest_type || '',
                ref_id: interest.ref_id || '',
                plan_type: interest.plan_type || 'FD',
                interest_name: interest.interest_name || '',
                duration: interest.duration?.toString() || '',
                interest_rate_general: interest.interest_rate_general?.toString() || '',
                interest_rate_senior: interest.interest_rate_senior?.toString() || '',
                minimum_deposit: interest.minimum_deposit?.toString() || '',
                from_date: interest.from_date ? new Date(interest.from_date).toISOString().split('T')[0] : '',
                to_date: interest.to_date ? new Date(interest.to_date).toISOString().split('T')[0] : '',
            });
        } else if (!isEditMode || isError || !open) {
            // Reset form for create mode, error, or dialog close
            setFormData({
                interest_id: '',
                interest_type: '',
                ref_id: '',
                plan_type: 'FD',
                interest_name: '',
                duration: '',
                interest_rate_general: '',
                interest_rate_senior: '',
                minimum_deposit: '',
                from_date: '',
                to_date: '',
            });
        }
    }, [interestData, isEditMode, open, isError]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
            // Reset interest_name if plan type changes
            ...(name === 'plan_type' ? { interest_name: '' } : {})
        });
    };

    const handleSave = () => {
        const dataToSend = {
            interest_id: formData.interest_id,
            interest_type: formData.interest_type,
            ref_id: formData.ref_id,
            plan_type: formData.plan_type,
            interest_name: formData.interest_name,
            duration: parseInt(formData.duration) || 0,
            interest_rate_general: parseFloat(formData.interest_rate_general) || 0,
            interest_rate_senior: parseFloat(formData.interest_rate_senior) || 0,
            minimum_deposit: parseFloat(formData.minimum_deposit) || 0,
            from_date: formData.from_date || undefined,
            to_date: formData.to_date || undefined,
        };
        console.log('Creating interest with data:', dataToSend);
        onSave(dataToSend, isEditMode);
    };

    const isLoading = isFetching || externalLoading;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            {/* Loading Backdrop */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
                open={!!isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <DialogTitle sx={{
                backgroundColor: '#1a237e',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2,
            }}>
                <Typography variant="h6">
                    {isEditMode ? 'Update Interest Details' : 'Create New Interest'}
                </Typography>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, backgroundColor: '#f8fafc' }}>
                <Box sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    p: 3,
                    border: '1px solid #e2e8f0',
                }}>
                    <Grid container spacing={3}>
                        {/* Interest ID */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Interest ID"
                                name="interest_id"
                                value={formData.interest_id}
                                onChange={handleChange}
                                size="small"
                                disabled={isEditMode}
                                placeholder="e.g. FD001"
                            />
                        </Grid>

                        {/* Interest Type */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Interest Type"
                                name="interest_type"
                                value={formData.interest_type}
                                onChange={handleChange}
                                size="small"
                                placeholder="e.g. FD, RD"
                            />
                        </Grid>

                        {/* Ref ID */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Ref ID"
                                name="ref_id"
                                value={formData.ref_id}
                                onChange={handleChange}
                                size="small"
                                placeholder="e.g. AGP001"
                            />
                        </Grid>

                        {/* Plan Type */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Plan Type</InputLabel>
                                <Select
                                    name="plan_type"
                                    value={formData.plan_type}
                                    label="Plan Type"
                                    onChange={handleSelectChange}
                                >
                                    {planTypes.map((type) => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Interest Name (Duration) */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Interest Name</InputLabel>
                                <Select
                                    name="interest_name"
                                    value={formData.interest_name}
                                    label="Interest Name"
                                    onChange={handleSelectChange}
                                >
                                    {depositDurations.map((type) => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Duration */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Duration (Months)"
                                name="duration"
                                type="number"
                                value={formData.duration}
                                onChange={handleChange}
                                size="small"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">Months</InputAdornment>,
                                }}
                                inputProps={{ min: "0" }}
                            />
                        </Grid>

                        {/* Interest Rate - General */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Interest Rate (General)"
                                name="interest_rate_general"
                                type="number"
                                value={formData.interest_rate_general}
                                onChange={handleChange}
                                size="small"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                inputProps={{ step: "0.1", min: "0" }}
                            />
                        </Grid>

                        {/* Interest Rate - Senior Citizen */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Interest Rate (Senior Citizen)"
                                name="interest_rate_senior"
                                type="number"
                                value={formData.interest_rate_senior}
                                onChange={handleChange}
                                size="small"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                inputProps={{ step: "0.1", min: "0" }}
                            />
                        </Grid>

                        {/* Minimum Deposit */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Minimum Deposit"
                                name="minimum_deposit"
                                type="number"
                                value={formData.minimum_deposit}
                                onChange={handleChange}
                                size="small"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                inputProps={{ min: "0" }}
                            />
                        </Grid>

                        {/* From Date */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="From Date"
                                name="from_date"
                                type="date"
                                value={formData.from_date}
                                onChange={handleChange}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        {/* To Date */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="To Date"
                                name="to_date"
                                type="date"
                                value={formData.to_date}
                                onChange={handleChange}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                    </Grid>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, backgroundColor: '#f8fafc' }}>
                <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={onClose}
                    sx={{ textTransform: 'none' }}
                    disabled={!!isLoading}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={!!isLoading}
                    sx={{
                        textTransform: 'none',
                        backgroundColor: '#1a237e',
                        '&:hover': { backgroundColor: '#283593' }
                    }}
                >
                    {isEditMode ? 'Update Interest' : 'Create Interest'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InterestModifyDialog;
