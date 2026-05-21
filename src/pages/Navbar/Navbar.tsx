import {
  ChevronDown,
  Lock,
  LogOutIcon,
  Menu as MenuIcon,
  Settings,
  User,
  Headphones,
  Bell,
} from "lucide-react";
import "./navbar.scss";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import useAuth from "../../hooks/use-auth";
import TokenService from "../../api/token/tokenService";
import { deepOrange } from "@mui/material/colors";
import { useState } from "react";
import { useGetMemberDetails } from "../../api/Memeber";


interface NavbarProps {
  shouldHide?: boolean;
  onToggleSidebar?: () => void;
}

const Navbar = ({ shouldHide, onToggleSidebar }: NavbarProps) => {
  const navigate = useNavigate();
  const { isLoggedIn, userRole } = useAuth();
  const isAdmin = userRole === "ADMIN" || userRole === "ADMIN_01" || userRole === "AGENT";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Always call hooks before any early return (Rules of Hooks)
  const userId = TokenService.getMemberId();
  const { data: memberDetails } = useGetMemberDetails(userId);

  // If we should hide the navbar (on public/auth pages), return null
  if (shouldHide) return null;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate("/");
    TokenService.removeToken();
    window.dispatchEvent(new Event("storage"));
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "#08101f", // Matches the dark dashboard background
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ 
          height: { xs: 56, md: 64 }, 
          px: { xs: 2, md: 3 }, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {isLoggedIn && userRole === "USER" ? (
            // USER mobile-app style layout
            <>
              <Box 
                onClick={handleMenuOpen} 
                sx={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  padding: '4px 8px',
                  borderRadius: '12px',
                  transition: 'background 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.08)'
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: { xs: 36, md: 40 },
                    height: { xs: 36, md: 40 },
                    bgcolor: '#00e676', // Neon green profile circular background
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: { xs: '0.95rem', md: '1.1rem' },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  {memberDetails?.Name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 800, lineHeight: 1.2, fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
                    {memberDetails?.Name || "Member"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                    ID: {memberDetails?.Member_id || ""}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={() => navigate('/user/support-chat')}
                  sx={{ color: "white", '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}
                >
                  <Headphones size={22} />
                </IconButton>
                <IconButton
                  onClick={() => navigate('/user/mailbox')}
                  sx={{ color: "white", '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}
                >
                  <Bell size={22} />
                </IconButton>
              </Box>
            </>
          ) : (
            // Default Admin/Agent/Admin01/Public layout
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isAdmin && onToggleSidebar && (
                  <IconButton
                    onClick={onToggleSidebar}
                    sx={{ color: "white", mr: 1, display: { xs: 'flex', md: 'flex' } }}
                  >
                    <MenuIcon size={24} />
                  </IconButton>
                )}
                <Typography
                  variant="h4"
                  onClick={() => navigate("/")}
                  sx={{
                    fontWeight: 950,
                    fontSize: { xs: '1.4rem', md: '1.85rem' },
                    cursor: "pointer",
                    letterSpacing: '1.5px',
                    color: 'white',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  BMS
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
                {isLoggedIn && (
                  <Box 
                    onClick={handleMenuOpen} 
                    sx={{ 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      padding: '4px 8px',
                      borderRadius: '12px',
                      transition: 'background 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        width: { xs: 32, md: 38 },
                        height: { xs: 32, md: 38 },
                        bgcolor: '#FFC000', 
                        color: '#0a2558',
                        fontWeight: 900,
                        fontSize: { xs: '0.85rem', md: '1rem' },
                        border: '2px solid rgba(255,255,255,0.4)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}
                    >
                      {memberDetails?.Name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 800, lineHeight: 1.1 }}>
                        {memberDetails?.Name || "Member"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.65rem' }}>
                        {memberDetails?.Member_id || ""}
                      </Typography>
                    </Box>
                    <ChevronDown size={18} color="white" style={{ opacity: 0.8 }} />
                  </Box>
                )}
              </Box>
            </>
          )}
        </Toolbar>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            className: Boolean(anchorEl) ? "custom-menu open" : "custom-menu",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px 0",
            }}
          >
            <Avatar
              alt="User"
              sx={{
                width: 64,
                height: 64,
                marginBottom: "8px",
                background: deepOrange[500],
                border: '2px solid #0a2558'
              }}
            >
              {memberDetails?.Name
                ? memberDetails.Name.charAt(0).toUpperCase()
                : ""}
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0a2558' }}>
              {memberDetails?.Name || "Member"}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
               ID: {memberDetails?.Member_id || ""}
            </Typography>
          </div>

          <Divider />

          <MenuItem onClick={handleMenuClose}>
            <User size={18} style={{ marginRight: "8px" }} />
            My Profile
          </MenuItem>

          <MenuItem
            onClick={() => {
              navigate("/admin/update-password");
              setAnchorEl(null);
            }}
          >
            <Settings size={18} style={{ marginRight: "8px" }} />
            Account Settings
          </MenuItem>

          <Divider />

          <div className="admin-panel-menuitems">
            <MenuItem onClick={handleMenuClose} sx={{ display: "flex" }}>
              <Lock size={17} style={{ marginRight: "4px", color: "#007bff" }} />
              Lock
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ display: "flex" }}>
              <LogOutIcon
                size={18}
                style={{ marginRight: "4px", color: "red" }}
              />
              Logout
            </MenuItem>
          </div>
        </Menu>
      </AppBar >
    </>
  );
};

export default Navbar;
