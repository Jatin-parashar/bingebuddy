import React, { useContext, useState } from "react";
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
import { Form, Navigate, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../store/UserAuthContextProvider";
import { auth } from "../../../firebase";
import {
  sendEmailVerification,
  updateProfile,
  deleteUser,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  linkWithCredential,
} from "firebase/auth";
import { appendToList, deleteData } from "../../db/firebasedb";
import { fetchData, writeData } from "../../db/firebasedb.js";

const Auth = ({ type }) => {
  const { logIn, signUp, googleSignIn, user } = useUserAuth();
  
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

  async function imageToBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await googleSignIn();
      const user = auth.currentUser;
      const userData = await fetchData(`users/${user.uid}`);
      if (!userData) {
        // const base64String = await imageToBase64(user.photoURL);
        await writeData(`users/${user.uid}`, {
          email: user.email,
          // photo: user.photoURL ? user.photoURL : "",
          // phoneNumber: user.phoneNumber ? user.phoneNumber : "",
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

  const checkEmailVerification = async (user) => {
    alert("Email Verification link shared to your email! Check your inbox.");
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          await user.reload();
          const currentUser = auth.currentUser;

          if (currentUser && currentUser.emailVerified) {
            clearInterval(interval);
            resolve();
          }
        } catch (error) {
          clearInterval(interval);
          reject(
            new Error(`Error checking email verification: ${error.message}`)
          );
        }
      }, 5000);

      const timer = setTimeout(async () => {
        clearInterval(interval);
        try {
          await user.reload();
          const currentUser = auth.currentUser;

          if (currentUser && !currentUser.emailVerified) {
            await deleteUser(currentUser);
            reject(
              new Error("Failed to sign up due to unfinished authentication.")
            );
          } else {
            resolve();
          }
        } catch (error) {
          reject(
            new Error(
              `Error checking email verification on timeout: ${error.message}`
            )
          );
        }
      }, 90000);

      return () => clearTimeout(timer);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, password } = formData;
    let user;
    try {
      if (type === "login") {
        await logIn(email, password);
      } else if (type === "signup") {
        // Create the user with email and password
        await signUp(email, password);
        user = auth.currentUser;
        await sendEmailVerification(user);
        // await sendEmailVerification(user, { url: "http://localhost:5173/" });
        await checkEmailVerification(user);
        await updateProfile(user, { displayName: name });
        // const username = extractUsername(email);
        await writeData(`users/${user.uid}`, {
          email: email,
          // photo: "",
          // phoneNumber: "",
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
        await deleteUser(user);
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

    // try {
    //   const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    //   console.log(signInMethods);
    //   if (signInMethods.length === 0) {
    //     setError("No account found with this email.");
    //     return;
    //   }
    // } catch (error) {
    //   setError(
    //     "An error occurred while verifying your email. Please try again later."
    //   );
    //   return;
    // }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      alert(
        "If this email is associated with an account, a password reset link has been sent. Please check your inbox."
      );
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

  function extractUsername(email) {
    const parts = email.split("@");
    return parts.length > 1 ? parts[0] : null;
  }

  const handleCloseSnackbar = () => {
    setError("");
  };

  const TransitionComponent = (props) => <Slide {...props} direction="up" />;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "400px",
        p: 3,
        backgroundColor: "white",
        color: "black",
        margin: "0 auto",
      }}
    >
      <Typography variant="h5" gutterBottom align="center">
        🎬 Welcome to BingeBuddy!
      </Typography>
      <Typography variant="body2" gutterBottom align="center" sx={{ mb: 2 }}>
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

      <Form onSubmit={handleSubmit} autoComplete="off">
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
          autoComplete="off"
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
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading
            ? type === "login"
              ? "Signing In..."
              : "Signing Up..."
            : type === "login"
            ? "Sign In"
            : "Sign Up"}
        </Button>
      </Form>

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">
          {type === "login"
            ? "New on our platform?"
            : "Already have an account?"}{" "}
          <Link
            variant="body2"
            sx={{ color: "#b22222", textDecoration: "none", cursor: "pointer" }}
            onClick={handleTypeChange}
          >
            {type === "login" ? "Create an account" : "Sign in"}
          </Link>
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
        <Box sx={{ flex: 1, height: "1px", backgroundColor: "#b22222" }} />
        <Typography
          sx={{ mx: 2, color: "#b22222", fontWeight: "bold", fontSize: "14px" }}
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
  );
};

export default Auth;
