import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import SmallRupeeIcon from './SmallRupeeIcon';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

interface DashboardCardProps {
  amount: string | number;
  title: string;
  subTitle?: string;
  IconComponent?: React.ElementType;
  type?: 'default' | 'loan' | 'renewal';
  dueAmount?: string | number;
  onRepay?: () => void;
  isRepayEnabled?: boolean;
  alreadyRepaidToday?: boolean;
  renewalDays?: number;
  isNewUser?: boolean;
  onRenew?: () => void;
  isRenewEnabled?: boolean;
  onClaim?: () => void;
  isClaimEligible?: boolean;
  loanStatus?: string | null;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  amount,
  title,
  subTitle,
  IconComponent,
  type = 'default',
  dueAmount = 0,
  onRepay,
  isRepayEnabled = false,
  alreadyRepaidToday = false,
  renewalDays,
  isNewUser = false,
  onRenew,
  isRenewEnabled = false,
  onClaim,
  isClaimEligible = false,
  loanStatus = null,
  onClick
}) => {

  const renderTextWithIcon = (val: string | number, justifyContent: string = 'center') => {
    const valStr = String(val);
    if (!valStr.includes('$')) return valStr;

    const parts = valStr.split('$');
    return (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent, gap: 0, flexWrap: 'wrap' }}>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <SmallRupeeIcon sx={{ width: '1em', height: '1em', mx: 0.1, mt: -0.2 }} />
            )}
          </React.Fragment>
        ))}
      </Box>
    );
  };

  const getRepayButtonText = () => {
    if (isRepayEnabled) return 'Repay Now';
    if (alreadyRepaidToday) return 'Already Repaid Today';
    return 'Available Saturday';
  };

  const getButtonStyle = (status: string) => {
    const baseStyle = {
      textTransform: 'capitalize' as const,
      fontWeight: 'bold',
      mt: 2,
      width: '100%',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    };

    switch (status?.toLowerCase()) {
      case 'processing':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Amber
          color: '#fff',
          '&:hover': { background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' },
        };
      case 'approved':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Emerald Green
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          },
          '&.Mui-disabled': {
            color: 'white',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          }
        };
      default:
        return baseStyle;
    }
  };

  if (type === 'loan') {
    return (
      <Card
        sx={{
          background: 'linear-gradient(135deg, #0a2558 0%, #113278 100%)', // Premium Royal Blue
          color: '#fff',
          borderRadius: '16px',
          padding: { xs: '12px', sm: '16px' },
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 10px 30px -10px rgba(10, 37, 88, 0.5)',
          height: '100%',
          minHeight: { xs: '140px', sm: '180px' },
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Glow effect */}
        <Box sx={{ position: 'absolute', top: '-20%', right: '-10%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(255,192,0,0.15) 0%, rgba(255,192,0,0) 70%)', borderRadius: '50%', filter: 'blur(20px)' }} />

        <CardContent sx={{
          textAlign: 'center',
          p: { xs: '8px', sm: '12px' },
          width: '100%',
          zIndex: 1,
          '&:last-child': { paddingBottom: { xs: '8px', sm: '12px' } }
        }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              color: '#FFC000' // Gold Accent
            }}
          >
            {title}
          </Typography>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            mb: 3
          }}>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.4rem', sm: '1.8rem' },
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {renderTextWithIcon(amount, 'center')}
              </Typography>
            </Box>

            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.9rem' },
                  mb: 0.5,
                  color: '#94a3b8'
                }}
              >
                Due Amount
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.1rem', sm: '1.3rem' },
                  color: '#ef4444' // Red for due
                }}
              >
                {renderTextWithIcon(dueAmount, 'center')}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={onRepay}
            disabled={!isRepayEnabled}
            sx={{
              background: isRepayEnabled
                ? 'linear-gradient(135deg, #FFC000 0%, #E6A800 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              color: isRepayEnabled ? '#0a2558' : 'rgba(255,255,255,0.5)',
              border: isRepayEnabled ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
              '&:hover': {
                background: isRepayEnabled
                  ? 'linear-gradient(135deg, #FFCE33 0%, #FFC000 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                transform: isRepayEnabled ? 'translateY(-2px)' : 'none',
                boxShadow: isRepayEnabled
                  ? '0 6px 15px rgba(255, 192, 0, 0.4)'
                  : 'none',
              },
              fontWeight: 800,
              textTransform: 'none',
              px: { xs: 2, sm: 3 },
              py: 1,
              fontSize: { xs: '0.85rem', sm: '0.95rem' },
              borderRadius: '8px',
              minWidth: '140px',
              transition: 'all 0.3s ease'
            }}
          >
            {getRepayButtonText()}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (type === 'renewal') {
    return (
      <Card
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', // Pristine White
          color: '#0a2558', // Deep Navy
          borderRadius: '16px',
          padding: { xs: '12px', sm: '16px' },
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
          height: '100%',
          minHeight: { xs: '140px', sm: '180px' },
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <CardContent sx={{
          textAlign: 'center',
          p: { xs: '8px', sm: '12px' },
          width: '100%',
          '&:last-child': { paddingBottom: { xs: '8px', sm: '12px' } }
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1.5,
            mb: 2
          }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#64748b',
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: '#0a2558',
                fontSize: { xs: '1.3rem', sm: '1.6rem' },
              }}
            >
              {renderTextWithIcon(amount, 'center')}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            {isNewUser ? (
              <Typography
                variant="body2"
                sx={{
                  color: '#b45309', // Dark Amber
                  fontWeight: 700,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  background: '#fef3c7',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '6px',
                  display: 'inline-block'
                }}
              >
                Select RD Package
              </Typography>
            ) : renewalDays !== undefined && renewalDays > 0 ? (
              <Typography
                variant="body2"
                sx={{
                  color: '#334155',
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  background: '#f1f5f9',
                  px: 1.5,
                  py: 0.8,
                  borderRadius: '6px',
                  display: 'inline-block',
                  border: '1px solid #e2e8f0'
                }}
              >
                Next RD Deposit in <span style={{ color: '#0a2558', fontWeight: 800 }}>{renewalDays}</span> days
              </Typography>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: '#b91c1c',
                  fontWeight: 700,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  background: '#fee2e2',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '6px',
                  display: 'inline-block'
                }}
              >
                Renewal Due
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            onClick={onRenew}
            disabled={!isRenewEnabled}
            sx={{
              background: isRenewEnabled
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' // Fresh Emerald Green
                : '#f1f5f9',
              color: isRenewEnabled ? 'white' : '#94a3b8',
              boxShadow: isRenewEnabled ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
              '&:hover': {
                background: isRenewEnabled
                  ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                  : '#f1f5f9',
                transform: isRenewEnabled ? 'translateY(-2px)' : 'none',
                boxShadow: isRenewEnabled ? '0 6px 15px rgba(16, 185, 129, 0.4)' : 'none',
              },
              '&:disabled': {
                color: '#94a3b8',
                background: '#f8fafc',
                border: '1px solid #e2e8f0'
              },
              fontWeight: 800,
              textTransform: 'none',
              px: { xs: 2, sm: 3 },
              py: 1,
              fontSize: { xs: '0.85rem', sm: '0.95rem' },
              borderRadius: '8px',
              minWidth: '140px',
              transition: 'all 0.3s ease'
            }}
          >
            {isNewUser ? 'Select RD Package' : 'Deposit Amount'}
          </Button>
        </CardContent>
      </Card >
    );
  }

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', // Pristine White
        color: '#0a2558',
        borderRadius: '16px',
        padding: { xs: '16px', sm: '20px' },
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
        height: '100%',
        minHeight: { xs: '140px', sm: '180px' },
        width: '100%',
        flexDirection: { xs: 'row', sm: 'row' },
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.1)',
        },
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          width: { xs: '100%', sm: '120px' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: { xs: 1, sm: 0 },
        }}
      >
        <Box sx={{
          background: 'transparent', // Removed soft gold circle
          borderRadius: '50%',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {IconComponent ?
            <IconComponent sx={{ fontSize: { xs: '2.5rem', sm: '3rem' }, color: '#FFC000' }} /> :
            <MonetizationOnIcon sx={{ fontSize: { xs: '2.5rem', sm: '3rem' }, color: '#FFC000' }} />
          }
        </Box>
      </Box>

      <CardContent
        sx={{
          padding: { xs: '8px', sm: '16px' },
          width: '100%',
          textAlign: 'left',
          pl: { sm: 3 },
          '&:last-child': { paddingBottom: { xs: '8px', sm: '16px' } }
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '0.85rem', sm: '1rem' },
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            mb: 0.5
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.6rem', sm: '2.2rem' },
            color: '#0a2558',
            letterSpacing: '-0.5px'
          }}
        >
          {renderTextWithIcon(amount, 'flex-start')}
        </Typography>

        {subTitle && (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              fontSize: { xs: '0.75rem', sm: '0.85rem' },
              color: '#94a3b8',
              marginTop: '4px'
            }}
          >
            {renderTextWithIcon(subTitle, 'flex-start')}
          </Typography>
        )}

        {loanStatus ? (
          <Button
            variant="contained"
            disabled={loanStatus.toLowerCase() === 'approved'}
            sx={{ ...getButtonStyle(loanStatus), mt: 2 }}
          >
            {loanStatus.toLowerCase() === 'approved' ? 'Approved' : loanStatus}
          </Button>
        ) : isClaimEligible && onClaim ? (
          <Button
            variant="contained"
            onClick={onClaim}
            sx={{
              marginTop: '16px',
              background: 'linear-gradient(135deg, #0a2558 0%, #153b93 100%)', // Action Navy
              color: '#fff',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              boxShadow: '0 4px 12px rgba(10, 37, 88, 0.2)',
              '&:hover': {
                background: 'linear-gradient(135deg, #153b93 0%, #0a2558 100%)',
                boxShadow: '0 6px 16px rgba(10, 37, 88, 0.3)',
                transform: 'translateY(-2px)'
              },
              width: { xs: '100%', sm: 'auto' },
              transition: 'all 0.3s ease'
            }}
          >
            Claim Loan
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
