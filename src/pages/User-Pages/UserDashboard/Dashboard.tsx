// components/UserDashboard.tsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Button,
  Stack,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import InventoryIcon from '@mui/icons-material/Inventory';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import HubIcon from '@mui/icons-material/Hub';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import LockIcon from '@mui/icons-material/Lock';
import CampaignIcon from '@mui/icons-material/Campaign';

import TokenService from '../../../api/token/tokenService';
import {
  useVerifyPayment,
  parsePaymentRedirectParams,
  useGetTransactionDetails,
  useGetWalletOverview,
  useGetMemberDetails,
  useGetDailyPayout
} from '../../../api/Memeber';
import { toast } from 'react-toastify';


const UserDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentProcessed, setPaymentProcessed] = useState(false);

  const memberId = TokenService.getMemberId();
  const { data: walletOverview } = useGetWalletOverview(memberId);
  const { data: memberDetails, refetch: refetchMemberDetails } = useGetMemberDetails(memberId);
  const { mutate: verifyPayment, isPending: isVerifyingPayment } = useVerifyPayment();
  const { refetch: refetchTransactions } = useGetTransactionDetails("all");
  useGetDailyPayout(memberId);

  const totalPrincipal = Number(walletOverview?.totalPackages || 0);
  const totalRoiPaidValue = Number(walletOverview?.roiBenefits || 0);
  const roiLevelBenefits = Number(walletOverview?.roiLevelBenefits || 0);

  // Wallet starts at Total Principal and decreases as ROI is paid.
  const displayWallet = Math.max(0, totalPrincipal - totalRoiPaidValue);

  // Once ROI exceeds Total Principal, the Deposit itself starts to "decrease" visually.
  const extraROI = Math.max(0, totalRoiPaidValue - totalPrincipal);
  const displayDeposit = Math.max(0, totalPrincipal - extraROI);

  const isUserActive = memberDetails?.status === 'active';
  const isPackageActive = memberDetails?.upgrade_status === 'Active';

  const bannerImages = ['/cb.png', '/B3.png', '/B3_1.png'];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  useEffect(() => {
    const paymentParams = parsePaymentRedirectParams(searchParams);
    if (paymentParams.order_id && paymentParams.payment_status && !paymentProcessed) {
      setPaymentProcessed(true);
      verifyPayment(paymentParams.order_id, {
        onSuccess: () => {
          setSearchParams({});
          refetchTransactions();
          refetchMemberDetails();
        },
        onError: () => setSearchParams({})
      });
    }
  }, [searchParams, paymentProcessed, verifyPayment, setSearchParams, refetchTransactions, refetchMemberDetails]);

  const handleCopyReferralLink = () => {
    if (!memberDetails?.Member_id) return;
    const referralLink = `${window.location.origin}/register?ref=${memberDetails.Member_id}`;
    navigator.clipboard.writeText(referralLink)
      .then(() => toast.success('Referral link copied!'))
      .catch(() => toast.error('Failed to copy link'));
  };


  const quickAccessGroups = [
    {
      title: "ACCOUNT",
      items: [
        { label: "Profile", icon: <AccountCircleIcon />, route: "/user/account/profile", color: "#3b82f6" },
        { label: "KYC", icon: <VerifiedUserIcon />, route: "/user/account/kyc", color: "#10b981" },
        { label: "Password", icon: <LockIcon />, route: "/user/account/change-password", color: "#f59e0b" },
        ...(isPackageActive ? [{ label: "Add Deposit", icon: <InventoryIcon />, route: "/user/addon-packages?view=addon", color: "#3b82f6" }] : []),
      ]
    },
    {
      title: "BMS BENEFITS",
      items: [
        { label: "ROI Benefits", icon: <ShowChartIcon />, route: "/user/earnings/roi-benefits", color: "#10b981" },
        { label: "Daily ROI", icon: <TrendingUpIcon />, route: "/user/earnings/daily-payout", color: "#ef4444" },
        { label: "Level Benefits", icon: <AccountTreeIcon />, route: "/user/earnings/level-benefits", color: "#3b82f6" },
        { label: "Transactions", icon: <ReceiptLongIcon />, route: "/user/transactions", color: "#3b82f6" },
      ]
    },
    {
      title: "TEAM & TOOLS",
      items: [
        { label: "My Team", icon: <GroupsIcon />, route: "/user/team", color: "#3b82f6" },
        { label: "My Directs", icon: <PersonAddAltIcon />, route: "/user/team/direct", color: "#6366f1" },
        { label: "Tree View", icon: <HubIcon />, route: "/user/team/tree", color: "#ef4444" },
        { label: "New Regi.", icon: <PersonAddAltIcon />, route: "/user/team/new-register", color: "#10b981" },
      ]
    }
  ];

  const SliderSection = () => (
    <Box sx={{ 
      mb: 4, 
      borderRadius: '28px', 
      overflow: 'hidden', 
      position: 'relative', 
      boxShadow: '0 25px 55px rgba(0,0,0,0.35)',
      height: { xs: '180px', sm: '220px', md: '280px' }
    }}>
      {bannerImages.map((src, index) => (
        <Box
          key={src}
          component="img"
          src={src}
          alt={`Promotion banner ${index + 1}`}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: index === activeSlide ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: index === activeSlide ? 1 : 0,
          }}
        />
      ))}
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,8,20,0.05) 0%, rgba(2,8,20,0.5) 100%)', zIndex: 2 }} />
      <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1.5, zIndex: 3 }}>
        {bannerImages.map((_, dot) => (
          <Box
            key={dot}
            onClick={() => setActiveSlide(dot)}
            sx={{
              width: dot === activeSlide ? 24 : 8,
              height: 8,
              borderRadius: '999px',
              bgcolor: 'white',
              opacity: dot === activeSlide ? 1 : 0.45,
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
          />
        ))}
      </Box>
    </Box>
  );

  const AnnouncementBar = () => (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      mb: 4,
      px: 2,
      py: 1.25,
      borderRadius: '12px',
      bgcolor: 'rgba(255, 255, 255, 0.04)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      width: '100%'
    }}>
      <CampaignIcon sx={{ color: '#00e676', transform: 'rotate(-10deg)', fontSize: 22 }} />
      <Typography sx={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 600 }}>
        rewards of blockchain-based products and deposit options are updated!
      </Typography>
    </Box>
  );


  return (
    <Box sx={{
      pb: 6,
      background: 'linear-gradient(180deg, #050916 0%, #0f1e36 100%)',
      minHeight: '100vh',
      px: { xs: 2.5, md: 5, lg: 10, xl: 16 },
      pt: { xs: 1.5, md: 4 },
      maxWidth: '1800px',
      margin: '0 auto'
    }}>
      {isVerifyingPayment && (
        <Box sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'white' }}>Verifying payment...</Typography>
        </Box>
      )}

      <SliderSection />

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        mb: 4,
        mt: 1,
        flexWrap: 'nowrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
            Your Total Balance
          </Typography>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.85rem', md: '2.5rem' }, color: '#ffffff', lineHeight: 1.1 }}>
            ₹{Number(walletOverview?.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate('/user/addon-packages')}
          sx={{
            bgcolor: '#00e676', // Vibrant neon green from screenshot
            color: '#050916',   // Dark text matching main dark theme
            textTransform: 'none',
            fontWeight: 800,
            borderRadius: '999px',
            px: { xs: 3.5, md: 5 },
            py: { xs: 1.25, md: 1.5 },
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            boxShadow: '0 4px 14px rgba(0, 230, 118, 0.4)',
            minWidth: 'auto',
            flexShrink: 0,
            '&:hover': { 
              bgcolor: '#00c853',
              boxShadow: '0 6px 20px rgba(0, 230, 118, 0.6)',
            }
          }}
        >
          Deposit
        </Button>
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 4, md: 5 },
        alignItems: 'flex-start'
      }}>
        {/* Left Column (Main/Services) */}
        <Box sx={{
          flex: 1,
          width: '100%',
          display: { xs: 'none', md: 'block' }
        }}>
          {/* CB Banner - Desktop only (mobile version is inside the header) */}
          <Box
            onClick={() => navigate('/user/chat')}
            sx={{
              display: { xs: 'none', md: 'block' },
              width: '100%',
              height: '160px',
              mb: 4,
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(23, 16, 16, 0.12)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 45px rgba(0,0,0,0.18)' },

            }}
          >
            <img src="/cb.png" alt="BMS Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>


          {/* Team Performance - In Left Column on Desktop */}
          <Box sx={{ mt: 6, display: { xs: 'none', md: 'block' } }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', mb: 3 }}>TEAM PERFORMANCE</Typography>
            <Paper elevation={0} sx={{ p: 4, borderRadius: '28px', bgcolor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Team</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#ffffff', mt: 1 }}>{memberDetails?.total_team || 0}</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Directs</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#ffffff', mt: 1 }}>{memberDetails?.direct_referrals?.length || 0}</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
        {/* Right Column / Mobile Conditional View */}
        <Box sx={{
          width: { xs: '100%', md: '380px', lg: '440px' },
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          position: { md: 'sticky' },
          top: { md: '80px' }
        }}>
          {/* Mobile Only: Quick Access Header */}
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#0a2558', mb: 1, display: { xs: 'block', md: 'none' } }}>
            QUICK ACCESS
          </Typography>

          <Box sx={{ flex: 1 }}>
            {quickAccessGroups.map((group, idx) => (
              <Box key={idx} sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#ffffff', mb: 2, letterSpacing: '1px' }}>
                  {group.title}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
                  {group.items.map((item, i) => (
                    <Box key={i} onClick={() => navigate(item.route)} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
                      <Box sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '16px',
                        bgcolor: 'rgba(255, 255, 255, 0.06)',
                        color: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        '&:hover': { transform: 'scale(1.1)', bgcolor: 'rgba(255, 255, 255, 0.12)' },
                        transition: '0.2s'
                      }}>
                        {item.icon}
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.7rem', textAlign: 'center', color: '#ffffff' }}>
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}

            <AnnouncementBar />

            {/* Team Performance - Mobile Only inside Quick Access */}
            <Box sx={{ mt: 2, display: { xs: 'block', md: 'none' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#ffffff', mb: 2 }}>TEAM PERFORMANCE</Typography>
              <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Total Team</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#ffffff' }}>{memberDetails?.total_team || 0}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Directs</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#ffffff' }}>{memberDetails?.direct_referrals?.length || 0}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>

          <Box sx={{ width: { xs: '100%', xl: '420px' }, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Paper elevation={0} sx={{
              p: 4,
              borderRadius: '28px',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              color: 'white',
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.25)'
            }}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>Referral link</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<ShareIcon />}
                  fullWidth
                  sx={{
                    bgcolor: 'white',
                    color: '#1e3a8a',
                    borderRadius: '16px',
                    textTransform: 'none',
                    fontWeight: 900,
                    py: 1.5
                  }}
                >
                  Share Now
                </Button>
                <IconButton
                  onClick={handleCopyReferralLink}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    borderRadius: '16px',
                    width: 56,
                    height: 56
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Box>
            </Paper>

            {/* Wallet Section - Matched to 3rd Drawing */}
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', mb: -2, mt: { xs: 2, md: 3 } }}>
              DEPOSIT DETAILS
            </Typography>

            <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', mt: 1 }}>
              <Stack spacing={4}>
                {/* 1st Section: Deposits */}
                <Box sx={{ p: 3, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>MY Deposit</Typography>
                    <Typography sx={{ fontWeight: 900, color: '#ffffff' }}>₹{displayDeposit.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>Total Withdrawal</Typography>
                    <Typography sx={{ fontWeight: 900, color: '#ef4444' }}>₹{Number(walletOverview?.totalWithdrawal || 0).toLocaleString('en-IN')}</Typography>
                  </Box>
                </Box>

                {/* 2nd Section: Wallet Summary breakdown */}
                <Box sx={{ p: 3, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', position: 'relative', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Typography variant="caption" sx={{ position: 'absolute', top: -10, left: 20, bgcolor: '#0f1e36', px: 1.5, py: 0.2, borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 900, color: '#ffffff', fontSize: '0.65rem' }}>
                    WALLET SUMMARY
                  </Typography>
                  <Stack spacing={2} sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>Daily ROI</Typography>
                      <Typography sx={{ fontWeight: 900, color: '#ffb300' }}>₹{totalRoiPaidValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>BMS ROI Benefits</Typography>
                      <Typography sx={{ fontWeight: 900, color: '#00e676' }}>₹{roiLevelBenefits.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>BMS Level Benefits</Typography>
                      <Typography sx={{ fontWeight: 900, color: '#00e676' }}>₹{Number(walletOverview?.levelBenefits || 0).toLocaleString('en-IN')}</Typography>
                    </Box>
                    {isUserActive && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>BMS - Wallet</Typography>
                        <Typography sx={{ fontWeight: 900, color: '#29b6f6' }}>₹{displayWallet.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>

                {/* 3rd Section: Big Balance — Hidden if Inactive ROI or User */}
                {isUserActive && isPackageActive && (
                  <Box sx={{ textAlign: 'center', pt: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', mb: 1 }}>
                      WALLET BALANCE
                    </Typography>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, p: 2, px: 4, bgcolor: '#00e676', borderRadius: '20px', color: '#050916' }}>
                      <CurrencyRupeeIcon sx={{ fontSize: 28, color: '#050916' }} />
                      <Typography variant="h4" sx={{ fontWeight: 900 }}>
                        {Number(walletOverview?.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserDashboard;
