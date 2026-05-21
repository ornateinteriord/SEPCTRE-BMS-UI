import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  InputAdornment,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import WcIcon from "@mui/icons-material/Wc";
import BMSLogo from "../../assets/bms_logo.png"; // Import the logo
import { useGetSponserRef, useSignupMutation } from "../../api/Auth";
import { LoadingComponent } from "../../App";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref") || "";
  const [formData, setFormData] = useState<Record<string, string>>({
    Sponsor_code: "",
    Sponsor_name: "",
    gender: "",
    Name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileno: "",
    pincode: "",
    // packageAmount: "",
  });


  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [genderError, setGenderError] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [registrationData, setRegistrationData] = useState<{ memberId: string; password: string; email: string }>({
    memberId: '',
    password: '',
    email: ''
  });

  const {
    data: sponsorData,
    isLoading,
    isError,
    error,
    refetch
  } = useGetSponserRef(formData.Sponsor_code);

  // Auto-populate sponsor code from URL when component mounts
  useEffect(() => {
    if (refCode) {
      setFormData(prev => ({
        ...prev,
        Sponsor_code: refCode
      }));
    }
  }, [refCode]);

  // Fetch sponsor details when sponsor code changes
  useEffect(() => {
    if (formData.Sponsor_code && formData.Sponsor_code.length >= 5) {
      refetch();
    }
  }, [formData.Sponsor_code, refetch]);

  // Update sponsor name when sponsor data is fetched
  useEffect(() => {
    if (sponsorData && sponsorData.name) {
      setFormData(prev => ({
        ...prev,
        Sponsor_name: sponsorData.name
      }));
    } else if (isError) {
      // Clear sponsor name if there's an error
      setFormData(prev => ({
        ...prev,
        Sponsor_name: ""
      }));
    }
  }, [sponsorData, isError]);

  const sponsorError = isError && error instanceof Error ? error.message : "";

  const handleSponsorCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSponsorCode = e.target.value;
    setFormData(prev => ({
      ...prev,
      Sponsor_code: newSponsorCode,
      Sponsor_name: "" // Clear sponsor name when code changes
    }));
  };

  const handleSponsorCodeBlur = () => {
    if (formData.Sponsor_code && formData.Sponsor_code.length >= 5) {
      refetch();
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    setErrorMessage("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prevData => ({
      ...prevData,
      gender: e.target.value,
    }));
    setGenderError(false);
  };

  const { mutate, isPending } = useSignupMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!formData.gender) {
      setGenderError(true);
      return;
    }

    if (!formData.password || formData.password.length <= 5) {
      setErrorMessage("Password must be at least 6 characters*");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (!formData.Sponsor_code || formData.Sponsor_code.length < 5) {
      setErrorMessage("Valid sponsor code is required");
      return;
    }

    if (!formData.Sponsor_name) {
      setErrorMessage("Please enter a valid sponsor code");
      return;
    }

    try {
      // Create the final data object with the required structure
      const finalData = {
        sponsor_id: formData.Sponsor_code,
        Sponsor_code: formData.Sponsor_code,
        Sponsor_name: formData.Sponsor_name,
        spackage: 'BMS Plan',
        // ...(formData.packageAmount ? { package_value: Number(formData.packageAmount) } : {}),
        ...formData
      };


      mutate(finalData, {
        onSuccess: (response) => {
          if (response.success) {
            setRegistrationData({
              memberId: response.user.Member_id,
              password: formData.password,
              email: formData.email
            });
            setSuccessDialogOpen(true);
          }
        },
        onError: (error) => {
          setErrorMessage(error.response?.data?.message || "Registration failed");
        }
      });

    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  const handleCloseDialog = () => {
    setSuccessDialogOpen(false);
    // Navigate to login after closing dialog
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #050916 0%, #0f1e36 100%)",
        position: "relative",
        overflow: "hidden",
        pt: { xs: 5, md: 8 },
        pb: { xs: 5, md: 8 }
      }}
    >
      {/* Glow Design Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(0,230,118,0.12) 0%, rgba(0,230,118,0) 70%)",
          borderRadius: "50%",
          filter: "blur(50px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-5%",
          right: "-5%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(0,230,118,0.08) 0%, rgba(0,230,118,0) 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />

      <Container component="main" maxWidth="md" sx={{ position: "relative", zIndex: 1, mt: { xs: -2, md: -4 } }}>
        <Card
          elevation={24}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            p: { xs: 1, md: 2 },
            borderRadius: "28px",
            background: "rgba(255, 255, 255, 0.04)", // Sleek glassmorphism
            backdropFilter: "blur(12px)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <CardContent sx={{ width: "100%", padding: { xs: '1.25rem', md: '2.5rem' } }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <img
                src={BMSLogo}
                alt="BMS Logo"
                style={{ maxWidth: "220px", height: "auto", objectFit: "contain" }}
              />
            </Box>
            <Typography
              component="h1"
              variant="h5"
              sx={{
                color: "#ffffff",
                fontWeight: 800,
                textAlign: "center",
                mb: 4,
                letterSpacing: "-0.5px"
              }}
            >
              Create Account
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
              <Grid container spacing={2.5}>
                {/* Sponsor Code */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="Sponsor_code"
                    placeholder="Sponsor code"
                    value={formData.Sponsor_code}
                    onChange={handleSponsorCodeChange}
                    onBlur={handleSponsorCodeBlur}
                    error={(formData.Sponsor_code.length > 0 && formData.Sponsor_code.length < 5) || (formData.Sponsor_code.length >= 5 && !!sponsorError)}
                    helperText={
                      formData.Sponsor_code.length > 0 && formData.Sponsor_code.length < 5
                        ? "Sponsor code must be at least 5 characters."
                        : formData.Sponsor_code.length >= 5 && sponsorError
                          ? sponsorError
                          : ""
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        bgcolor: "rgba(255, 255, 255, 0.02)",
                        borderRadius: "12px",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.12)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.25)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#00e676",
                          borderWidth: "2px"
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.6)",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#00e676",
                      },
                      "& .MuiOutlinedInput-input::placeholder": {
                        color: "rgba(255, 255, 255, 0.4)",
                        opacity: 1,
                      }
                    }}
                  />
                </Grid>

                {/* Sponsor Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="Sponsor_name"
                    placeholder="Sponsor Name"
                    value={formData.Sponsor_name}
                    onChange={handleChange}
                    disabled={true}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "rgba(255, 255, 255, 0.35)" }} />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                        bgcolor: "rgba(255, 255, 255, 0.04)",
                        borderRadius: "12px",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.08)",
                        },
                        "&.Mui-disabled fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.06)",
                        },
                        "& .MuiOutlinedInput-input.Mui-disabled": {
                          WebkitTextFillColor: "rgba(255, 255, 255, 0.4)",
                        }
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.5)",
                      }
                    }}
                  />
                </Grid>

                {/* Full Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="Name"
                    name="Name"
                    autoComplete="Name"
                    placeholder="Enter your full name"
                    value={formData.Name}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        bgcolor: "rgba(255, 255, 255, 0.02)",
                        borderRadius: "12px",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.12)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.25)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#00e676",
                          borderWidth: "2px"
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.6)",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#00e676",
                      },
                      "& .MuiOutlinedInput-input::placeholder": {
                        color: "rgba(255, 255, 255, 0.4)",
                        opacity: 1,
                      }
                    }}
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        bgcolor: "rgba(255, 255, 255, 0.02)",
                        borderRadius: "12px",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.12)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.25)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#00e676",
                          borderWidth: "2px"
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.6)",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#00e676",
                      },
                      "& .MuiOutlinedInput-input::placeholder": {
                        color: "rgba(255, 255, 255, 0.4)",
                        opacity: 1,
                      }
                    }}
                  />
                </Grid>

                {/* Password */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        bgcolor: "rgba(255, 255, 255, 0.02)",
                        borderRadius: "12px",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.12)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.25)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#00e676",
                          borderWidth: "2px"
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.6)",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#00e676",
                      },
                      "& .MuiOutlinedInput-input::placeholder": {
                        color: "rgba(255, 255, 255, 0.4)",
                        opacity: 1,
                      }
                    }}
                  />
                </Grid>

                {/* Confirm Password */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errorMessage}
                    helperText={errorMessage}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        bgcolor: "rgba(255, 255, 255, 0.02)",
                        borderRadius: "12px",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.12)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.25)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#00e676",
                          borderWidth: "2px"
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.6)",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#00e676",
                      },
                      "& .MuiOutlinedInput-input::placeholder": {
                        color: "rgba(255, 255, 255, 0.4)",
                        opacity: 1,
                      }
                    }}
                  />
                </Grid>

                {/* Mobile Number */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="mobileno"
                    type="tel"
                    autoComplete="mobileno"
                    placeholder="Enter your number"
                    value={formData.mobileno}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        bgcolor: "rgba(255, 255, 255, 0.02)",
                        borderRadius: "12px",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.12)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.25)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#00e676",
                          borderWidth: "2px"
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.6)",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#00e676",
                      },
                      "& .MuiOutlinedInput-input::placeholder": {
                        color: "rgba(255, 255, 255, 0.4)",
                        opacity: 1,
                      }
                    }}
                  />
                </Grid>

                {/* Pin Code */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="pincode"
                    autoComplete="pincode"
                    placeholder="Enter your pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        bgcolor: "rgba(255, 255, 255, 0.02)",
                        borderRadius: "12px",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.12)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.25)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#00e676",
                          borderWidth: "2px"
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.6)",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#00e676",
                      },
                      "& .MuiOutlinedInput-input::placeholder": {
                        color: "rgba(255, 255, 255, 0.4)",
                        opacity: 1,
                      }
                    }}
                  />
                </Grid>

                {/* Gender */}
                <Grid item xs={12}>
                  <FormControl
                    error={!!genderError}
                    component="fieldset"
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 2,
                      ml: 1
                    }}
                  >
                    <FormLabel component="legend" sx={{ color: "rgba(255, 255, 255, 0.7) !important", fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                      <WcIcon sx={{ mr: 1, color: "rgba(255, 255, 255, 0.5)" }} />
                      Gender:
                    </FormLabel>
                    <RadioGroup
                      row
                      name="gender"
                      value={formData.gender}
                      onChange={handleRadioChange}
                    >
                      <FormControlLabel
                        value="Male"
                        control={<Radio sx={{ color: "rgba(255, 255, 255, 0.3)", "&.Mui-checked": { color: "#00e676" } }} />}
                        label={<span style={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 500 }}>Male</span>}
                      />
                      <FormControlLabel
                        value="Female"
                        control={<Radio sx={{ color: "rgba(255, 255, 255, 0.3)", "&.Mui-checked": { color: "#00e676" } }} />}
                        label={<span style={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 500 }}>Female</span>}
                      />
                    </RadioGroup>
                  </FormControl>
                  {genderError && (
                    <FormHelperText sx={{ color: "#d32f2f", ml: 1 }}>
                      Please select your gender*
                    </FormHelperText>
                  )}
                </Grid>

                {/* Terms and Checkbox */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        sx={{ color: "rgba(255, 255, 255, 0.3)", "&.Mui-checked": { color: "#00e676" } }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 500 }}>
                        I accept the Terms and Conditions
                      </Typography>
                    }
                  />
                </Grid>

                {/* Register Button */}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={!isChecked || isPending}
                    sx={{
                      mt: 1,
                      mb: 2,
                      background: "linear-gradient(135deg, #00e676 0%, #00c853 100%)",
                      color: "#050916",
                      fontWeight: 800,
                      fontSize: "1rem",
                      padding: "12px",
                      borderRadius: "12px",
                      textTransform: "none",
                      boxShadow: "0 8px 16px rgba(0, 230, 118, 0.2)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "linear-gradient(135deg, #00c853 0%, #00e676 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 20px rgba(0, 230, 118, 0.4)",
                      },
                      "&:disabled": {
                        background: "rgba(255, 255, 255, 0.12)",
                        color: "rgba(255, 255, 255, 0.3)"
                      }
                    }}
                  >
                    {isPending ? "Registering..." : "Register"}
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Typography variant="body2" sx={{ textAlign: "center", mt: 2, color: "rgba(255, 255, 255, 0.5)", fontWeight: 500 }}>
              Already registered?{" "}
              <Link
                to="/login"
                style={{
                  color: "#00e676",
                  textDecoration: "none",
                  fontWeight: 700,
                  transition: "color 0.2s ease"
                }}
              >
                Sign In
              </Link>
            </Typography>
          </CardContent>
        </Card>

        {/* Success Dialog */}
        <Dialog
          open={successDialogOpen}
          onClose={handleCloseDialog}
          aria-labelledby="registration-success-dialog"
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#0f1e36',
              backgroundImage: 'none',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              p: 1
            }
          }}
        >
          <DialogTitle
            id="registration-success-dialog"
            sx={{
              bgcolor: 'transparent',
              color: '#ffffff',
              textAlign: 'center',
              fontWeight: 800,
              fontSize: '1.35rem',
              pt: 3
            }}
          >
            Registration Successful!
          </DialogTitle>
          <DialogContent sx={{ px: { xs: 2, md: 4 }, py: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3, color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>
              New Member Created Successfully
            </Typography>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <Typography variant="body1" sx={{ mb: 2, color: '#ffffff' }}>
                <strong style={{ color: 'rgba(255,255,255,0.5)' }}>Member ID:</strong> {registrationData.memberId}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: '#ffffff' }}>
                <strong style={{ color: 'rgba(255,255,255,0.5)' }}>Email:</strong> {registrationData.email}
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>
                <strong style={{ color: 'rgba(255,255,255,0.5)' }}>Password:</strong> {registrationData.password}
              </Typography>
            </div>
            <Typography
              variant="body2"
              sx={{
                mt: 2.5,
                color: 'rgba(255, 255, 255, 0.5)',
                textAlign: 'center'
              }}
            >
              Please save these credentials securely. The member ID will be used for login.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: { xs: 2, md: 4 }, pb: 3, justifyContent: 'center' }}>
            <Button
              onClick={handleCloseDialog}
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: 800,
                px: 6,
                py: 1.25,
                borderRadius: '12px',
                background: "linear-gradient(135deg, #00e676 0%, #00c853 100%)",
                color: '#050916',
                '&:hover': {
                  background: "linear-gradient(135deg, #00c853 0%, #00e676 100%)",
                }
              }}
            >
              Go to Login
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      {(isLoading || isPending) && <LoadingComponent />}
    </Box>
  );
};

export default Register;