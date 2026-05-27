import { Card, CardContent, Grid, Typography } from '@mui/material';
import { cn } from '../../../lib/utils';
import { useNavigate } from 'react-router-dom';
import '../../Dashboard/dashboard.scss';
import DashboardTable from '../../Dashboard/DashboardTable';
import DashboardCard from '../../../components/common/DashboardCard';
import { getAdminDashboardTableColumns } from '../../../utils/DataTableColumnsProvider';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HistoryIcon from '@mui/icons-material/History';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import PaymentsIcon from '@mui/icons-material/Payments';
import { useGetAllMembersDetails, useGetROISummary } from '../../../api/Admin';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: members = [], isLoading: membersLoading, error: membersError } = useGetAllMembersDetails();
  const { data: roiSummary, isLoading: roiLoading } = useGetROISummary();

  const isLoading = membersLoading || roiLoading;
  const error = membersError;


  // Sort members by most recent registration date
  const sortedMembers = [...members].sort((a, b) => {
    return new Date(b.createdAt || b.Date_of_joining).getTime() -
      new Date(a.createdAt || a.Date_of_joining).getTime();
  });

  const totalMembers = members.length;
  const activeMembers = members.filter((member: any) =>
    member.status?.toLowerCase() === 'active'
  ).length;

  const pendingMembers = members.filter((member: any) =>
    member.status?.toLowerCase() === 'pending'
  ).length;

  const totalCities = new Set(members.map((member: any) => member.location).filter(Boolean)).size;
  const totalDegrees = new Set(members.map((member: any) => member.degree || member.education).filter(Boolean)).size;
  const totalEvents = 0;
  const totalLikes = 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography>Loading dashboard data...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography color="error">
          Error loading dashboard data: {error.message}
        </Typography>
      </div>
    );
  }

  return (
    <>
      <div className="h-auto md:h-40 relative w-full overflow-hidden bg-[#0a2558] flex flex-col items-center justify-center py-6 md:py-0">
        <div className="absolute inset-0 w-full h-full bg-[#0a2558] z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-evenly items-center w-full px-4 md:px-8 relative z-20 gap-6 md:gap-0">
          <div className="text-center md:text-left">
            <h1 className={cn("text-xl md:text-4xl text-white")}>
              Welcome to Admin Dashboard
            </h1>
            <p className="mt-2 text-neutral-300 text-sm md:text-base">
              Manage your network and track your success
            </p>
          </div>

          <div className="grid grid-cols-2 md:flex items-center gap-6 md:gap-12 text-white">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold mb-2">{totalLikes}k</div>
              <div className="text-xs md:text-sm flex items-center justify-center gap-1">
                <ThumbUpIcon sx={{ fontSize: { xs: 14, md: 16 } }} />
                Great
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold mb-2">{totalDegrees}</div>
              <div className="text-xs md:text-sm flex items-center justify-center gap-1">
                <SchoolIcon sx={{ fontSize: { xs: 14, md: 16 } }} />
                Degrees
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold mb-2">{totalEvents}</div>
              <div className="text-xs md:text-sm flex items-center justify-center gap-1">
                <EventIcon sx={{ fontSize: { xs: 14, md: 16 } }} />
                Events
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold mb-2">{totalCities}</div>
              <div className="text-xs md:text-sm flex items-center justify-center gap-1">
                <LocationOnIcon sx={{ fontSize: { xs: 14, md: 16 } }} />
                Cities
              </div>
            </div>
          </div>
        </div>
      </div>

      <Grid
        container
        spacing={{ xs: 2, sm: 3 }}
        sx={{
          mx: { xs: 1, sm: 2 },
          my: 2,
          pt: 5,
          pr: 7,
          width: 'auto',
          '& .MuiGrid-item': {
            display: 'flex',
          }
        }}
      >
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            amount={totalMembers}
            title="Total Members"
            subTitle={`${totalMembers} members in total`}
            IconComponent={PeopleIcon}
            onClick={() => navigate('/admin/members')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            amount={activeMembers}
            title="Active Members"
            subTitle={`${activeMembers} active members`}
            IconComponent={PersonAddIcon}
            onClick={() => navigate('/admin/members/active')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            amount={pendingMembers}
            title="Pending Members"
            subTitle={`${pendingMembers} pending activation`}
            IconComponent={HistoryIcon}
            onClick={() => navigate('/admin/members/pending')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            amount={`$${(roiSummary?.totalROIDistributed || 0).toLocaleString()}`}
            title="Total ROI Distributed"
            subTitle={`Today: $${(roiSummary?.todaysTotal || 0).toLocaleString()} (${roiSummary?.todaysCount || 0} payouts)`}
            IconComponent={PaymentsIcon}
            onClick={() => navigate('/admin/income/daily-payouts')}
          />
        </Grid>
      </Grid>


      <div className='mt-10 p-4 rounded shadow'>
        <Card className='bg-gray-300'>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h6" style={{ fontWeight: 'bold', color: '#0a2558' }}>
                Member Statistics ({sortedMembers.length} members)
              </Typography>
            </div>
            <DashboardTable
              data={sortedMembers}
              columns={getAdminDashboardTableColumns()}
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default AdminDashboard;