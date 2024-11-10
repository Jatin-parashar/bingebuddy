import React, { useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Link,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Slide,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import {
  deleteCurrentUser,
  googleSignIn,
  logIn,
  resetPassword,
  signUp,
} from "../firebase/firebaseAuth.js";
import usr from "../assets/usr.png";
import styles from "./AuthenticationPage.module.css";
import { fetchData, writeData } from "../firebase/firebaseDB.js";

const AuthenticationPage = ({ type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const userCredential = await googleSignIn();
      const user = userCredential.user;
      const userData = await fetchData(`users/${user.uid}`);
      if (!userData) {
        await writeData(`users/${user.uid}`, {
          email: user.email,
          name: user.displayName,
          createdAt: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          }),
        });
      }
      navigate("/");
    } catch (error) {
      setError("Google sign-in failed. Please try again.");
      console.error("Google sign-in error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { name, email, password } = formData;
    try {
      if (type === "login") {
        await logIn(email, password);
      } else if (type === "signup") {
        const user = await signUp(email, password, name);
        await writeData(`users/${user.uid}`, {
          email: email,
          name: name,
          createdAt: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          }),
        });
      }
      navigate("/");
    } catch (err) {
      setError(`Error: ${err.message}`);
      if (user) {
        await deleteCurrentUser(user);
      }
    } finally {
      setLoading(false);
      setFormData({ email: "", password: "", name: "" });
    }
  };

  const handleForgotPassword = async () => {
    const { email } = formData;
    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, null);
      alert("Check your inbox for a reset link if your email is registered.");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = () => {
    setFormData({ email: "", password: "", name: "" });
    navigate(type === "login" ? "/signup" : "/login");
  };

  const handleCloseSnackbar = () => setError("");

  const TransitionComponent = (props) => <Slide {...props} direction="up" />;

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <Box
          sx={{
            width: "100%",
            maxWidth: "400px",
            p: 5,
            backgroundColor: "white",
            color: "black",
            margin: "0 auto",
            borderRadius:"30px"
          }}
        >
          <Typography variant="h5" gutterBottom align="center">
            🎬 Welcome to BingeBuddy!
          </Typography>
          <Typography
            variant="body2"
            gutterBottom
            align="center"
            sx={{ mb: 2 }}
          >
            {type === "login"
              ? "Please sign in to your account!"
              : "Create a new account!"}
          </Typography>

          <Snackbar
            open={!!error}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            TransitionComponent={TransitionComponent}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="error"
              sx={{ width: "100%" }}
            >
              {error}
            </Alert>
          </Snackbar>

          <form onSubmit={handleSubmit} autoComplete="off">
            {type === "signup" && (
              <TextField
                fullWidth
                size="small"
                label="Name"
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="off"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#b22222" },
                    "&:hover fieldset": { borderColor: "#b22222" },
                    "&.Mui-focused fieldset": { borderColor: "#b22222" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#b22222" },
                }}
              />
            )}

            <TextField
              fullWidth
              size="small"
              label="Email"
              variant="outlined"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#b22222" },
                  "&:hover fieldset": { borderColor: "#b22222" },
                  "&.Mui-focused fieldset": { borderColor: "#b22222" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#b22222" },
              }}
            />

            <TextField
              fullWidth
              size="small"
              label="Password"
              variant="outlined"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#b22222" },
                  "&:hover fieldset": { borderColor: "#b22222" },
                  "&.Mui-focused fieldset": { borderColor: "#b22222" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#b22222" },
              }}
            />

            {type === "login" && (
              <Box sx={{ textAlign: "center" }}>
                <Link
                  onClick={handleForgotPassword}
                  variant="body2"
                  sx={{
                    color: "#b22222",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
            )}

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, backgroundColor: "#b22222", color: "white" }}
              type="submit"
              disabled={loading}
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
            >
              {loading
                ? type === "login"
                  ? "Signing In..."
                  : "Signing Up..."
                : type === "login"
                ? "Sign In"
                : "Sign Up"}
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              {type === "login"
                ? "New on our platform?"
                : "Already have an account?"}{" "}
              <Link
                variant="body2"
                sx={{
                  color: "#b22222",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
                onClick={handleTypeChange}
              >
                {type === "login" ? "Create an account" : "Sign in"}
              </Link>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
            <Box sx={{ flex: 1, height: "1px", backgroundColor: "#b22222" }} />
            <Typography
              sx={{
                mx: 2,
                color: "#b22222",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              OR
            </Typography>
            <Box sx={{ flex: 1, height: "1px", backgroundColor: "#b22222" }} />
          </Box>

          <Button
            sx={{
              color: "#b22222",
              display: "flex",
              alignItems: "center",
              p: 0,
              mx: "auto",
              "&:hover": { backgroundColor: "white" },
            }}
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <GoogleIcon sx={{ mr: 1 }} />
            {/* Sign {type === "login" ? "in" : "up"} with Google */}
          </Button>
        </Box>
      </div>
      <img
        className={styles.bottomImage}
        src={usr}
        alt="User enjoying BingeBuddy"
      />
    </div>
  );
};

export default AuthenticationPage;
