import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import TokenService from '../../../api/token/tokenService';
import {
  useRequestAddOnMutation,
  useGetLoadFundConfig,
  useUploadPaymentScreenshot,
} from '../../../api/Packages';
import { toast } from 'react-toastify';

interface LoadFundModalProps {
  open: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [1000, 2000, 5000, 10000];

const LoadFundModal: React.FC<LoadFundModalProps> = ({ open, onClose }) => {
  const memberId = TokenService.getMemberId();
  const { data: config, isLoading: isConfigLoading } = useGetLoadFundConfig();
  const requestAddOn = useRequestAddOnMutation();
  const uploadScreenshot = useUploadPaymentScreenshot(memberId || '');

  const [amount, setAmount] = useState<string>('');
  const [txNo, setTxNo] = useState<string>('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'wallet'>('crypto');

  const handleCopyAddress = () => {
    if (config?.wallet_address) {
      navigator.clipboard.writeText(config.wallet_address);
      toast.success('Wallet address copied to clipboard!');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (paymentMethod === 'crypto') {
      if (!txNo.trim()) {
        toast.error('Please enter the transaction number (TX No / Hash)');
        return;
      }

      if (!screenshotFile) {
        toast.error('Please upload a payment screenshot');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      let url = null;
      if (paymentMethod === 'crypto') {
        const uploadResult = await uploadScreenshot.mutateAsync(screenshotFile as File);
        url = uploadResult.url;
      }
      
      await requestAddOn.mutateAsync({
        member_id: memberId || '',
        requested_amount: Number(amount),
        tx_no: txNo,
        screenshot_url: url || undefined,
        payment_method: paymentMethod,
      });

      // Clear form and close
      setAmount('');
      setTxNo('');
      setScreenshotFile(null);
      setScreenshotPreview(null);
      onClose();
    } catch (err: any) {
      console.error('Submit error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to submit load fund request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: '#0c162d',
          backgroundImage: 'none',
          color: '#ffffff',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          p: 2,
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#ffffff' }}>
          Load Fund
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            '&:hover': { color: '#ffffff', bgcolor: 'rgba(255,255,255,0.08)' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2, overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
        {isConfigLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#00e676' }} />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ToggleButtonGroup
                color="primary"
                value={paymentMethod}
                exclusive
                onChange={(_, newMethod) => { if (newMethod) setPaymentMethod(newMethod); }}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  '& .MuiToggleButton-root': {
                    color: 'rgba(255,255,255,0.7)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 700,
                    '&.Mui-selected': {
                      color: '#050916',
                      bgcolor: '#00e676',
                      '&:hover': { bgcolor: '#00c853' }
                    }
                  }
                }}
              >
                <ToggleButton value="crypto">Crypto Deposit</ToggleButton>
                <ToggleButton value="wallet">Wallet Balance</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Payment Details Container */}
            {paymentMethod === 'crypto' && (
              <Box
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  p: 3,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Typography variant="subtitle2" sx={{ color: '#00e676', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  USDT Deposit Network: {config?.network_text || 'USDT-BEP20'}
                </Typography>

                {/* QR Code Container */}
                <Box
                  sx={{
                    width: 180,
                    height: 180,
                    bgcolor: '#ffffff',
                    borderRadius: '16px',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    overflow: 'hidden',
                  }}
                >
                  {config?.qr_code_url ? (
                    <Box
                      component="img"
                      src={config.qr_code_url}
                      alt="USDT QR Code"
                      sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        const parent = e.target.parentNode;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.innerText = 'QR Code';
                          fallback.style.color = '#000000';
                          fallback.style.fontWeight = 'bold';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ color: '#050916', fontWeight: 700 }}>
                      QR Code Not Configured
                    </Typography>
                  )}
                </Box>

                {/* Wallet Address Copy */}
                <Box sx={{ width: '100%' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', mb: 0.5 }}>
                    USDT Address
                  </Typography>
                  <Box
                    onClick={handleCopyAddress}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      px: 2,
                      py: 1.25,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.08)',
                        borderColor: '#00e676',
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        color: 'rgba(255, 255, 255, 0.9)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        mr: 1,
                        textAlign: 'left',
                        fontSize: '0.85rem',
                        width: '85%',
                      }}
                    >
                      {config?.wallet_address || 'No wallet address configured'}
                    </Typography>
                    <ContentCopyIcon sx={{ color: '#00e676', fontSize: '1.1rem' }} />
                  </Box>
                </Box>
              </Box>
            )}

            {/* Fields Form */}
            <Stack spacing={2.5}>
              <Box>
                <TextField
                  fullWidth
                  label="Amount (USDT / $)"
                  variant="outlined"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  placeholder="Enter deposit amount"
                  slotProps={{
                    inputLabel: {
                      sx: { color: 'rgba(255,255,255,0.6)', '&.Mui-focused': { color: '#00e676' } }
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff',
                      borderRadius: '12px',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#00e676' },
                    },
                  }}
                />
                
                {/* Preset Chips */}
                <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                  {PRESET_AMOUNTS.map((val) => (
                    <Chip
                      key={val}
                      label={`+$${val}`}
                      onClick={() => setAmount(val.toString())}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        color: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        fontWeight: 700,
                        '&:hover': {
                          bgcolor: 'rgba(0, 230, 118, 0.1)',
                          color: '#00e676',
                          borderColor: '#00e676',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {paymentMethod === 'crypto' && (
                <>
                  <TextField
                    fullWidth
                    label="TX No / Transaction Hash"
                    variant="outlined"
                    value={txNo}
                    onChange={(e) => setTxNo(e.target.value)}
                    placeholder="Enter Transaction ID"
                    slotProps={{
                      inputLabel: {
                        sx: { color: 'rgba(255,255,255,0.6)', '&.Mui-focused': { color: '#00e676' } }
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        borderRadius: '12px',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&.Mui-focused fieldset': { borderColor: '#00e676' },
                      },
                    }}
                  />

                  {/* Upload Screenshot */}
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, fontWeight: 700 }}>
                      Upload Payment Screenshot
                    </Typography>
                    
                    {screenshotPreview ? (
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: 180,
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        <Box
                          component="img"
                          src={screenshotPreview}
                          alt="Payment Preview"
                          sx={{ width: '100%', height: '100%', objectFit: 'contain', bgcolor: '#050916' }}
                        />
                        <IconButton
                          onClick={handleRemoveScreenshot}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(239, 68, 68, 0.9)',
                            color: '#ffffff',
                            '&:hover': { bgcolor: 'rgba(239, 68, 68, 1)' },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        sx={{
                          width: '100%',
                          py: 3,
                          borderRadius: '12px',
                          border: '2px dashed rgba(255, 255, 255, 0.15)',
                          color: 'rgba(255,255,255,0.7)',
                          textTransform: 'none',
                          '&:hover': {
                            borderColor: '#00e676',
                            color: '#00e676',
                            bgcolor: 'rgba(0, 230, 118, 0.02)',
                          },
                        }}
                      >
                        Click to upload receipt image
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </Button>
                    )}
                  </Box>
                </>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                sx={{
                  bgcolor: '#00e676',
                  color: '#050916',
                  textTransform: 'none',
                  fontWeight: 900,
                  fontSize: '1rem',
                  py: 1.5,
                  borderRadius: '12px',
                  boxShadow: '0 6px 16px rgba(0, 230, 118, 0.35)',
                  '&:hover': {
                    bgcolor: '#00c853',
                    boxShadow: '0 8px 24px rgba(0, 230, 118, 0.5)',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.3)',
                  },
                }}
              >
                {isSubmitting ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: '#050916' }} />
                    Submitting Request...
                  </Box>
                ) : (
                  'Submit Load Fund Request'
                )}
              </Button>
            </Stack>

          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoadFundModal;
