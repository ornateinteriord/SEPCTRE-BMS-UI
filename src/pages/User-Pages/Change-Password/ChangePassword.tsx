import React, { useState } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  Box,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import KeyIcon from '@mui/icons-material/Key';
import { useUpdateMember } from '../../../api/Memeber';
import { toast } from 'react-toastify';
import { LoadingComponent } from '../../../App';

const ChangePassword: React.FC = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateMember = useUpdateMember();

  const handleSubmit = () => {
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields are required!");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    updateMember.mutate({ oldPassword: formData.oldPassword, newPassword: formData.newPassword });
  };

  const inputStyles = {
    bgcolor: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    color: '#ffffff',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255,255,255,0.1)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255,255,255,0.3)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#00e676',
    },
    '& .MuiInputBase-input': {
      color: '#ffffff',
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255,255,255,0.7)',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#00e676',
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center', background: 'linear-gradient(180deg, #050916 0%, #0f1e36 100%)', minHeight: '100vh' }}>
      <Card sx={{ maxWidth: 600, width: '100%', bgcolor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: "0 15px 35px rgba(0,0,0,0.2)", borderRadius: '28px', color: '#ffffff', mt: { xs: 4, md: 10 }, alignSelf: 'flex-start' }}>
        <CardHeader 
          title="CHANGE PASSWORD" 
          sx={{ bgcolor: 'rgba(255,255,255,0.03)', color: '#ffffff', py: 2.5, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          titleTypographyProps={{ variant: 'subtitle1', fontWeight: 900, letterSpacing: '1px' }}
        />
        <CardContent sx={{ p: 4 }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <TextField
              label="Old Password"
              name="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Enter your current password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
              }}
              sx={inputStyles}
            />
            <TextField
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Enter your new password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
              }}
              sx={inputStyles}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Confirm your new password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
              }}
              sx={inputStyles}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!formData.oldPassword || !formData.newPassword || !formData.confirmPassword || updateMember.isPending}
                sx={{
                  bgcolor: '#00e676',
                  color: '#050916',
                  px: 5,
                  py: 1.2,
                  fontWeight: 800,
                  textTransform: 'none',
                  borderRadius: '999px',
                  boxShadow: '0 4px 14px rgba(0, 230, 118, 0.4)',
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    bgcolor: '#00c853',
                    boxShadow: '0 6px 20px rgba(0, 230, 118, 0.6)'
                  },
                  "&:disabled": {
                    bgcolor: 'rgba(0, 230, 118, 0.3)',
                    color: 'rgba(255,255,255,0.5)'
                  }
                }}
              >
                Update Password
              </Button>
            </Box>
          </form>
        </CardContent>
        {updateMember.isPending && <LoadingComponent />}
      </Card>
    </Box>
  );
};

export default ChangePassword;
