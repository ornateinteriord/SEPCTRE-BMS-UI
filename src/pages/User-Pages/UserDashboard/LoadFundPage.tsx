import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import TokenService from '../../../api/token/tokenService';
import { useGetWalletOverview } from '../../../api/Memeber';
import {
  useRequestAddOnMutation,
  useGetLoadFundConfig,
  useUploadPaymentScreenshot,
} from '../../../api/Packages';
import { toast } from 'react-toastify';

const LoadFundPage: React.FC = () => {
  const memberId = TokenService.getMemberId();
  const { data: config, isLoading: isConfigLoading } = useGetLoadFundConfig();
  const { data: walletOverview } = useGetWalletOverview(memberId || '');

  const requestAddOn = useRequestAddOnMutation();
  const uploadScreenshot = useUploadPaymentScreenshot(memberId || '');

  const [amount, setAmount] = useState<string>('');
  const [txNo, setTxNo] = useState<string>('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // For viewing screenshot history
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

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

    // No need to check for balance here since we are loading funds

    if (!txNo.trim()) {
      toast.error('Please enter the transaction number (TX No)');
      return;
    }

    if (!screenshotFile) {
      toast.error('Please upload your payment screenshot');
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadResult = await uploadScreenshot.mutateAsync(screenshotFile);
      await requestAddOn.mutateAsync({
        member_id: memberId || '',
        requested_amount: Number(amount),
        tx_no: txNo,
        screenshot_url: uploadResult.url,
      });

      setAmount('');
      setTxNo('');
      setScreenshotFile(null);
      setScreenshotPreview(null);
    } catch (err: any) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        pb: 6,
        background: 'linear-gradient(180deg, #050916 0%, #0f1e36 100%)',
        minHeight: '100vh',
        px: { xs: 2.5, md: 5, lg: 10 },
        pt: { xs: 4, md: 4 },
        maxWidth: '1800px',
        margin: '0 auto',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff', mb: 1 }}>
          Load Fund
        </Typography>
      </Box>

      {isConfigLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#00e676' }} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Left Column: Instructions and Address */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                bgcolor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 3,
                height: '100%',
              }}
            >
              {/* <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff' }}>
                Payment Instructions
              </Typography> */}
              {/* 
              <Chip
                label={`USDT Deposit Network: ${config?.network_text || 'USDT-BEP20'}`}
                color="success"
                variant="outlined"
                sx={{
                  color: '#00e676',
                  borderColor: '#00e676',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  py: 2,
                  px: 1,
                }}
              /> */}

              {/* QR Image */}
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  bgcolor: '#ffffff',
                  borderRadius: '20px',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                  mt: 1,
                }}
              >
                {config?.qr_code_url ? (
                  <Box
                    component="img"
                    src={config.qr_code_url}
                    alt="Payment QR Code"
                    sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      const parent = e.target.parentNode;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.innerText = 'QR Code';
                        fallback.style.color = '#050916';
                        fallback.style.fontWeight = 'bold';
                        fallback.style.fontSize = '1.2rem';
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <Typography variant="body2" sx={{ color: '#050916', fontWeight: 800 }}>
                    QR Code Not Configured
                  </Typography>
                )}
              </Box>

              {/* Copy Address */}
              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', display: 'block', mb: 1, textAlign: 'left' }}>
                  Copy Destination Address
                </Typography>
                <Box
                  onClick={handleCopyAddress}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '16px',
                    px: 3,
                    py: 2,
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
                      color: 'rgba(255, 255, 255, 0.95)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      mr: 2,
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      width: '90%',
                    }}
                  >
                    {config?.wallet_address || 'No wallet address configured'}
                  </Typography>
                  <ContentCopyIcon sx={{ color: '#00e676' }} />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column: Transaction Submission */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                bgcolor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.06)',
                height: '100%',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#ffffff', mb: 2, textAlign: 'center' }}>
                Load Fund Request
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                <Box>
                  <TextField
                    fullWidth
                    label="Top Up Balance"
                    variant="outlined"
                    value={`$${Number(walletOverview?.topUpBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    disabled
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '1.2rem',
                        borderRadius: '14px',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                        '&.Mui-disabled': { color: '#ffffff', WebkitTextFillColor: '#ffffff' },
                        '& input.Mui-disabled': { color: '#ffffff', WebkitTextFillColor: '#ffffff' }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255,255,255,0.6)',
                        '&.Mui-disabled': { color: 'rgba(255,255,255,0.6)' }
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Amount (USDT / $)"
                    variant="outlined"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    placeholder="Enter amount loaded"
                    slotProps={{
                      inputLabel: {
                        sx: { color: 'rgba(255,255,255,0.6)', '&.Mui-focused': { color: '#00e676' } }
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        borderRadius: '14px',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&.Mui-focused fieldset': { borderColor: '#00e676' },
                      },
                    }}
                  />

                </Box>

                <TextField
                  fullWidth
                  label="TX No / Transaction Hash"
                  variant="outlined"
                  value={txNo}
                  onChange={(e) => setTxNo(e.target.value)}
                  placeholder="Enter transaction receipt hash"
                  slotProps={{
                    inputLabel: {
                      sx: { color: 'rgba(255,255,255,0.6)', '&.Mui-focused': { color: '#00e676' } }
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff',
                      borderRadius: '14px',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#00e676' },
                    },
                  }}
                />

                {/* Receipt Image upload */}
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mb: 1.5, fontWeight: 700 }}>
                    Upload Payment Screenshot
                  </Typography>

                  {screenshotPreview ? (
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: 200,
                        borderRadius: '14px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.12)',
                        bgcolor: '#050916',
                      }}
                    >
                      <Box
                        component="img"
                        src={screenshotPreview}
                        alt="Screenshot Preview"
                        sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                      <IconButton
                        onClick={handleRemoveScreenshot}
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          bgcolor: 'rgba(239, 68, 68, 0.95)',
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
                        py: 4,
                        borderRadius: '14px',
                        border: '2px dashed rgba(255, 255, 255, 0.12)',
                        color: 'rgba(255,255,255,0.6)',
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        '&:hover': {
                          borderColor: '#00e676',
                          color: '#00e676',
                          bgcolor: 'rgba(0, 230, 118, 0.02)',
                        },
                      }}
                    >
                      Drag & Drop or Click to Upload Payment Screenshot
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  )}
                </Box>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  sx={{
                    bgcolor: '#00e676',
                    color: '#050916',
                    textTransform: 'none',
                    fontWeight: 900,
                    fontSize: '1rem',
                    py: 1.75,
                    borderRadius: '14px',
                    boxShadow: '0 6px 20px rgba(0, 230, 118, 0.35)',
                    '&:hover': {
                      bgcolor: '#00c853',
                      boxShadow: '0 8px 26px rgba(0, 230, 118, 0.5)',
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.3)',
                    },
                  }}
                >
                  {isSubmitting ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} sx={{ color: '#050916' }} />
                      Submitting...
                    </Box>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Screenshot Viewer Dialog */}
      <Dialog
        open={!!selectedScreenshot}
        onClose={() => setSelectedScreenshot(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0c162d',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff' }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Payment Screenshot</Typography>
          <IconButton onClick={() => setSelectedScreenshot(null)} sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#ffffff' } }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, display: 'flex', justifyContent: 'center', bgcolor: '#050916', height: '70vh' }}>
          {selectedScreenshot && (
            <Box
              component="img"
              src={selectedScreenshot}
              alt="Payment Transaction Receipt"
              sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LoadFundPage;
