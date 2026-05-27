import React, { useState, useContext } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  FormControl,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import UserContext from "../../../context/user/userContext";
import { useGetWalletOverview } from "../../../api/Memeber";
import { useRequestAddOnMutation } from "../../../api/Packages";
import { toast } from "react-toastify";

const NewSubscription: React.FC = () => {
  const { user } = useContext(UserContext);
  const { data: walletOverview } = useGetWalletOverview(user?.Member_id || '');
  const { mutate: requestAddOn, isPending: isSubmitting } = useRequestAddOnMutation();

  const [formData, setFormData] = useState({
    package: "",
    investAmount: "",
  });

  const handleSelectChange = (e: any) => {
    const value = e.target.value;
    setFormData({
      package: value,
      investAmount: value, // Auto-fill invest amount based on package selection
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.Member_id || !formData.investAmount) {
      toast.error("Please provide an investment amount");
      return;
    }
    
    requestAddOn({
      member_id: user.Member_id,
      requested_amount: Number(formData.investAmount),
      payment_method: 'wallet',
    }, {
      onSuccess: () => {
        setFormData({ package: "", investAmount: "" });
      }
    });
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
      WebkitTextFillColor: '#ffffff',
    },
    '& .MuiInputBase-input.Mui-disabled': {
      color: '#ffffff',
      WebkitTextFillColor: '#ffffff',
    },
    '& .MuiSelect-icon': {
      color: 'rgba(255,255,255,0.7)',
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center', background: 'linear-gradient(180deg, #050916 0%, #0f1e36 100%)', minHeight: '100vh' }}>
      <Card sx={{ maxWidth: 600, width: '100%', bgcolor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: "0 15px 35px rgba(0,0,0,0.2)", borderRadius: '28px', color: '#ffffff', alignSelf: 'flex-start' }}>
        <CardHeader 
          title="NEW SUBSCRIPTION" 
          sx={{ bgcolor: 'rgba(255,255,255,0.03)', color: '#ffffff', py: 2.5, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          titleTypographyProps={{ variant: 'subtitle1', fontWeight: 900, letterSpacing: '1px' }}
        />
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ width: '150px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>Member Id <span style={{color: '#ef4444'}}>*</span></Typography>
              <TextField
                value={user?.Member_id || ''}
                fullWidth
                size="small"
                disabled
                sx={{ ...inputStyles, opacity: 0.7 }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ width: '150px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>Name <span style={{color: '#ef4444'}}>*</span></Typography>
              <TextField
                value={user?.Name || ''}
                fullWidth
                size="small"
                disabled
                sx={{ ...inputStyles, opacity: 0.7 }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ width: '150px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>Balance <span style={{color: '#ef4444'}}>*</span></Typography>
              <TextField
                value={walletOverview?.balance || 0}
                fullWidth
                size="small"
                disabled
                sx={{ ...inputStyles, opacity: 0.7 }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ width: '150px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>Package <span style={{color: '#ef4444'}}>*</span></Typography>
              <FormControl fullWidth size="small">
                <Select
                  name="package"
                  value={formData.package}
                  onChange={handleSelectChange}
                  sx={inputStyles}
                  displayEmpty
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: '#0f1e36',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }
                    }
                  }}
                >
                  <MenuItem value="" disabled></MenuItem>
                  <MenuItem value="1000">1000</MenuItem>
                  <MenuItem value="2000">2000</MenuItem>
                  <MenuItem value="5000">5000</MenuItem>
                  <MenuItem value="10000">10000</MenuItem>
                  <MenuItem value="25000">25000</MenuItem>
                  <MenuItem value="50000">50000</MenuItem>
                  <MenuItem value="100000">100000</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ width: '150px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>Invest Amount <span style={{color: '#ef4444'}}>*</span></Typography>
              <TextField
                name="investAmount"
                type="number"
                value={formData.investAmount}
                onChange={handleInputChange}
                fullWidth
                size="small"
                required
                sx={inputStyles}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ width: '150px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>Topup Date <span style={{color: '#ef4444'}}>*</span></Typography>
              <TextField
                value={new Date().toLocaleDateString('en-GB')}
                fullWidth
                size="small"
                disabled
                sx={{ ...inputStyles, opacity: 0.7 }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifySelf: 'center', mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
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
                  "&:hover": { 
                    bgcolor: '#00c853',
                    boxShadow: '0 6px 20px rgba(0, 230, 118, 0.6)'
                  },
                  "&:disabled": {
                    bgcolor: 'rgba(0, 230, 118, 0.3)',
                    color: 'rgba(255,255,255,0.5)'
                  }
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit (F2)"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NewSubscription;
