import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useResetpassword } from "../../../api/Auth";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const ResetPasswordMutation = useResetpassword();
  const { mutate, isPending } = ResetPasswordMutation;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (step === 1 && formData.email) {
        mutate({ email: formData.email });
        setStep(2); // Advance immediately to allow OTP input
      } else if (step === 2 && otp.length === 6) {
        mutate(
          { email: formData.email, otp },
          {
            onSuccess: () => {
              setStep(3);
            },
            onError: () => {
              setOtp("");
              setStep(1);
            },
          }
        );
      } else if (step === 3) {
        if (formData.password?.length <= 5) {
          setErrorMessage("Password must be at least 6 characters*");
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setErrorMessage("Passwords do not match");
          return;
        }
        mutate(
          { email: formData.email, password: formData.password, otp },
          {
            onSuccess: () => {
              setFormData({ email: "", password: "", confirmPassword: "" });
              setOtp("");
              setErrorMessage("");
              onBackToLogin(); // Go back to login screen safely
            }
          }
        );
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBackToLogin}
        sx={{
          color: "rgba(255, 255, 255, 0.6)",
          mb: 2,
          textTransform: "none",
          fontWeight: 600,
          background: "transparent",
          "&:hover": { color: "#00e676", backgroundColor: "rgba(255,255,255,0.05)" }
        }}
      >
        Back to Login
      </Button>

      <Typography
        component="h1"
        variant="h5"
        sx={{
          color: "#ffffff",
          fontWeight: 800,
          textAlign: "center",
          mb: 1,
          letterSpacing: "-0.5px"
        }}
      >
        Reset Password
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center", mb: 3, fontWeight: 500 }}
      >
        {step === 1 && "Enter your registered email to receive an OTP"}
        {step === 2 && "Enter the 6-digit OTP sent to your email"}
        {step === 3 && "Securely enter your new preferred password"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        {step >= 1 && (
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={formData.email || ""}
            onChange={handleChange}
            disabled={step > 1 || isPending}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                </InputAdornment>
              ),
            }}
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
        )}

        {step >= 2 && (
          <Box sx={{ mt: 1, mb: 1, display: "flex", justifyContent: "center" }}>
            <MuiOtpInput
              value={otp}
              length={6}
              onChange={setOtp}
              autoFocus
              TextFieldsProps={{
                disabled: step > 2 || isPending,
                sx: {
                  "& .MuiOutlinedInput-root": {
                    height: "50px",
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
                },
              }}
            />
          </Box>
        )}

        {step === 3 && (
          <>
            <TextField
              required
              fullWidth
              id="password"
              label="New Password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter new password"
              value={formData.password || ""}
              onChange={handleChange}
              disabled={isPending}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                  </InputAdornment>
                ),
              }}
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

            <TextField
              required
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm new password"
              value={formData.confirmPassword || ""}
              onChange={handleChange}
              disabled={isPending}
              error={!!errorMessage}
              helperText={errorMessage}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                  </InputAdornment>
                ),
              }}
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
          </>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isPending}
          sx={{
            mt: 2,
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
          {isPending 
            ? "Processing..." 
            : step === 1
              ? "Get OTP"
              : step === 2
                ? "Verify OTP"
                : "Reset Password"}
        </Button>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm;
