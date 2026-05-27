import { Card, CardContent, Typography, Avatar, Button, Grid, Box, CircularProgress, Chip } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
// import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SavingsIcon from '@mui/icons-material/Savings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CollectionsIcon from '@mui/icons-material/Collections';
import TokenService from '../../queries/token/tokenService';
import { useGetAssignedAccounts, useGetCollectionTransactions, useGetAgentById, useGetAgentCommissionTransactions } from '../../queries/Agent';
import AgentWalletCard from '../../components/Dashboard/AgentWalletCard';

// Icon mapping for account types
const getAccountIcon = (accountType: string) => {
  const iconMap: { [key: string]: JSX.Element } = {
    'SB': <SavingsIcon sx={{ fontSize: 40 }} />,
    'CA': <AccountBalanceIcon sx={{ fontSize: 40 }} />,
    'RD': <TrendingUpIcon sx={{ fontSize: 40 }} />,
    'FD': <MonetizationOnIcon sx={{ fontSize: 40 }} />,
    'PIGMY': <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />,
    'MIS': <SavingsIcon sx={{ fontSize: 40 }} />,
  };
  return iconMap[accountType] || <AccountBalanceIcon sx={{ fontSize: 40 }} />;
};

// Gradient colors for different cards
const getCardGradient = (index: number) => {
  const gradients = [
    'linear-gradient(135deg, #667EEA 0%, #818CF8 100%)',
    'linear-gradient(135deg, #5B21B6 0%, #667EEA 100%)',
    'linear-gradient(135deg, #4C1D95 0%, #5B21B6 100%)',
    'linear-gradient(135deg, #3730A3 0%, #4C1D95 100%)',
    'linear-gradient(135deg, #312E81 0%, #3730A3 100%)',
    'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
  ];
  return gradients[index % gradients.length];
};

const AgentDashboard = () => {
  const navigate = useNavigate();
  const agentId = TokenService.getMemberId() || '';

  const { data: agentData, isLoading: agentLoading } = useGetAgentById(agentId);
  const { data: accountsData, isLoading: accountsLoading } = useGetAssignedAccounts(agentId);
  const { data: transactionsData, isLoading: transactionsLoading } = useGetCollectionTransactions(agentId);
  const { data: commissionData, isLoading: commissionLoading } = useGetAgentCommissionTransactions(agentId);

  console.log("recent collectio:", transactionsData)

  const isLoading = agentLoading || accountsLoading || transactionsLoading;

  // Get commission balance from commission transactions summary
  const totalBalance = commissionData?.data?.summary?.availableBalance || 0;

  // Get collection balance from transactions data (API returns data as an array)
  const collectionTransactions = transactionsData?.data || [];
  console.log("Collection transactions data:", transactionsData);
  const totalCollected = Array.isArray(collectionTransactions) ? collectionTransactions.reduce((sum: number, tx: any) => sum + (tx.credit || 0), 0) : 0;
  const totalPaid = Array.isArray(collectionTransactions) ? collectionTransactions.reduce((sum: number, tx: any) => sum + (tx.debit || 0), 0) : 0;
  const netCollectedAmount = totalCollected - totalPaid;

  // Calculate statistics
  // const totalAssignedAccounts = accountsData?.data?.length || 0;
  // const totalCollected = transactionsData?.data?.reduce((sum: number, tx: any) => sum + (tx.credit || 0), 0) || 0;
  // const todayTransactions = transactionsData?.data?.filter((tx: any) => {
  //   const txDate = new Date(tx.transaction_date).toDateString();
  //   const today = new Date().toDateString();
  //   return txDate === today;
  // }) || [];
  // const todayCollected = todayTransactions.reduce((sum: number, tx: any) => sum + (tx.credit || 0), 0);

  // Group accounts by type
  const accountsByType = accountsData?.data?.reduce((acc: any, account: any) => {
    const type = account.account_type || 'Other';
    if (!acc[type]) {
      acc[type] = { count: 0, accounts: [] };
    }
    acc[type].count++;
    acc[type].accounts.push(account);
    return acc;
  }, {}) || {};

  return (
    <div>
      {/* Header Section */}
      {/* <Box sx={{ px: { xs: 1.5, sm: 2, md: 1 }, mt: { xs: 3, sm: 8 } }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#667EEA', mb: 1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Agent Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: '#4171d2ff', mb: 1, fontSize: '3rem', textAlign: 'center', fontWeight: '600' }}>
          Welcome back, {agentData?.data?.name || 'Agent'}
        </Typography>
      </Box> */}

      {/* Stats Cards */}
      {/* <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 }, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #667EEA 0%, #818CF8 100%)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', opacity: 0.9, mb: 1 }}>
                      Assigned Accounts
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {isLoading ? '-' : totalAssignedAccounts}
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #5B21B6 0%, #667EEA 100%)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(91, 33, 182, 0.3)',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', opacity: 0.9, mb: 1 }}>
                      Today's Collection
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      ${isLoading ? '-' : todayCollected.toLocaleString()}
                    </Typography>
                  </Box>
                  <MonetizationOnIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #4C1D95 0%, #5B21B6 100%)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(76, 29, 149, 0.3)',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', opacity: 0.9, mb: 1 }}>
                      Total Collected
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      ${isLoading ? '-' : totalCollected.toLocaleString()}
                    </Typography>
                  </Box>
                  <AccountBalanceWalletIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #3730A3 0%, #4C1D95 100%)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(55, 48, 163, 0.3)',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', opacity: 0.9, mb: 1 }}>
                      Today's Transactions
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {isLoading ? '-' : todayTransactions.length}
                    </Typography>
                  </Box>
                  <AssignmentIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box> */}

      {/* Assigned Accounts by Type */}
      <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 }, mb: 3, mt: 2 }}>
        {/* <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667EEA', mb: 3 }}>
          Assigned Accounts by Type
        </Typography> */}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#667EEA' }} />
          </Box>
        ) : Object.keys(accountsByType).length === 0 ? (
          <Card sx={{
            borderRadius: '16px',
            p: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%)',
            border: '2px dashed #d1d5db',
          }}>
            <AccountBalanceIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6b7280', fontWeight: 600 }}>
              No Accounts Assigned
            </Typography>
            <Typography sx={{ color: '#9ca3af', mt: 1 }}>
              You don't have any accounts assigned yet. Contact your branch manager.
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {Object.entries(accountsByType).map(([type, data]: [string, any], index: number) => (
              <Grid item xs={12} sm={6} md={4} key={type}>
                <Card
                  onClick={() => navigate(`/agent/collections?type=${type}`)}
                  sx={{
                    borderRadius: '16px',
                    background: getCardGradient(index),
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
                    }
                  }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        {getAccountIcon(type)}
                      </Box>
                      <Box sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        px: 2,
                        py: 0.5,
                        backdropFilter: 'blur(10px)',
                      }}>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                          {data.count} {data.count === 1 ? 'Account' : 'Accounts'}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {type}
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', opacity: 0.9 }}>
                      Click to view & collect
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Wallet and Collection Balance Cards - Side by Side */}
      <Box sx={{ px: { xs: 1.5, sm: 2, md: 1 }, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Agent Wallet Card - Clickable to navigate to wallet page */}
          <Grid item xs={12} md={6}>
            <Box
              onClick={() => navigate('/agent/wallet')}
              sx={{ height: '100%' }}
            >
              <AgentWalletCard
                balance={totalBalance}
                isLoading={commissionLoading}
              />
            </Box>
          </Grid>

          {/* Collection Balance Card */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                minHeight: '200px',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ zIndex: 1, textAlign: 'center', width: '100%', py: 4 }}>
                <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 1 }}>
                  Collection Balance
                </Typography>
                {transactionsLoading ? (
                  <CircularProgress size={40} sx={{ color: 'white', my: 2 }} />
                ) : (
                  <>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                      ${netCollectedAmount.toFixed(2)}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Collected</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>${totalCollected.toFixed(2)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Paid</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>${totalPaid.toFixed(2)}</Typography>
                      </Box>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mx: { xs: 1, sm: 2 }, my: 2, pt: 3 }}>
        {/* Recent Collections */}
        <Grid item xs={12} sm={12} md={8}>
          <Card sx={{
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            background: 'white',
          }}>
            <CardContent>
              <Typography variant="h6" style={{
                fontWeight: 'bold',
                color: '#667EEA',
                marginBottom: '16px',
              }}>
                Recent Collections
              </Typography>

              {transactionsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress sx={{ color: '#667EEA' }} />
                </Box>
              ) : !collectionTransactions.length ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CollectionsIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
                  <Typography sx={{ color: '#6b7280' }}>No recent collections</Typography>
                </Box>
              ) : (
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {collectionTransactions.slice(0, 5).map((tx: any) => (
                    <Box
                      key={tx.transaction_id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'white',
                        p: 2,
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        border: '1px solid rgba(102, 126, 234, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1)',
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                          width: 48,
                          height: 48,
                          background: 'linear-gradient(135deg, #667EEA 0%, #818CF8 100%)',
                        }}>
                          {tx.Name?.[0] || 'A'}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: '600', color: '#1f2937' }}>
                            {tx.Name || 'Unknown'}
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {tx.account_number} • {new Date(tx.transaction_date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={tx.status || 'Completed'}
                          size="small"
                          sx={{
                            backgroundColor: tx.status === 'Failed' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(102, 126, 234, 0.1)',
                            color: tx.status === 'Failed' ? '#ef4444' : '#667EEA',
                            fontWeight: 600,
                          }}
                        />
                        <Typography sx={{
                          fontWeight: '700',
                          color: '#667EEA',
                          minWidth: '80px',
                          textAlign: 'right',
                        }}>
                          ${tx.credit?.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions & Summary */}
        <Grid item xs={12} sm={12} md={4}>
          <Card sx={{
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            background: 'linear-gradient(135deg, #667EEA 0%, #5B21B6 100%)',
            color: 'white',
            mb: 3,
          }}>
            <CardContent>
              <Typography variant="h6" style={{
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '20px',
              }}>
                Agent Summary
              </Typography>

              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                    Agent ID
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {agentData?.data?.agent_id || '-'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                    Branch
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {agentData?.data?.branch_id || '-'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                    Designation
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {agentData?.data?.designation || 'Agent'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                    Total Transactions
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {collectionTransactions.length || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            background: 'white',
          }}>
            <CardContent>
              <Typography variant="h6" style={{
                fontWeight: 'bold',
                color: '#667EEA',
                marginBottom: '20px',
              }}>
                Quick Actions
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/agent/collections')}
                  sx={{
                    background: 'linear-gradient(135deg, #667EEA 0%, #818CF8 100%)',
                    borderRadius: '12px',
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: '600',
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5B21B6 0%, #667EEA 100%)',
                      boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                    }
                  }}
                  startIcon={<MonetizationOnIcon />}
                >
                  Collect Payment
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/agent/transactions')}
                  sx={{
                    borderRadius: '12px',
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: '600',
                    fontSize: '1rem',
                    borderColor: '#667EEA',
                    color: '#667EEA',
                    '&:hover': {
                      borderColor: '#5B21B6',
                      background: 'rgba(102, 126, 234, 0.04)',
                    }
                  }}
                  startIcon={<AssignmentIcon />}
                >
                  View Transactions
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/agent/profile')}
                  sx={{
                    borderRadius: '12px',
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: '600',
                    fontSize: '1rem',
                    borderColor: '#5B21B6',
                    color: '#5B21B6',
                    '&:hover': {
                      borderColor: '#4C1D95',
                      background: 'rgba(91, 33, 182, 0.04)',
                    }
                  }}
                  startIcon={<EventIcon />}
                >
                  View Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </div >
  );
}

export default AgentDashboard;