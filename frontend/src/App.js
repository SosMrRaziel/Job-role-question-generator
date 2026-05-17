import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Alert,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import WorkOutlineIcon from "@mui/icons-material/WorkOutlined";

// Create a professional Material Design theme using the custom palette
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#023047", // Deep Space Blue
      light: "#219ebc", // Blue Green
    },
    secondary: {
      main: "#fb8500", // Princeton Orange
      light: "#ffb703", // Amber Flame
    },
    background: {
      default: "#8ecae6", // Sky Blue (Light)
      paper: "#ffffff",
    },
    text: {
      primary: "#023047",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 800,
      color: "#023047",
    },
  },
  shape: {
    borderRadius: 16,
  },
});

function App() {
  const [jobTitle, setJobTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    setLoading(true);
    setError(null);
    setQuestions([]);

    const backendUrl =
      process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${backendUrl}/generate-questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobTitle }),
      });

      if (!response.ok) {
        throw new Error(
          "Failed to fetch questions. Please make sure the backend is running.",
        );
      }

      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        throw new Error("No questions returned from the server.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          {/* Header Animation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box textAlign="center" mb={4}>
              <AutoAwesomeIcon color="secondary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4" color="textPrimary" gutterBottom>
                AI Interview Prep
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ color: "#023047", opacity: 0.8 }}
              >
                Generate thoughtful questions for any role in seconds.
              </Typography>
            </Box>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card elevation={3} sx={{ mb: 4, overflow: "visible" }}>
              <CardContent sx={{ p: 4 }}>
                <form onSubmit={handleSubmit}>
                  <Box sx={{ display: "flex", alignItems: "flex-end", mb: 3 }}>
                    <WorkOutlineIcon color="action" sx={{ mr: 2, my: 0.5 }} />
                    <TextField
                      fullWidth
                      id="jobTitle"
                      label="Job Title"
                      placeholder="e.g., Customer Success Manager"
                      variant="standard"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="off"
                    />
                  </Box>

                  <Box sx={{ position: "relative", mt: 4 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      type="submit"
                      disabled={loading}
                      sx={{ py: 1.5, fontWeight: "bold", fontSize: "1.1rem" }}
                      component={motion.button}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? "Generating..." : "Generate Questions"}
                    </Button>
                    {loading && (
                      <CircularProgress
                        size={24}
                        sx={{
                          color: "secondary.main",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          marginTop: "-12px",
                          marginLeft: "-12px",
                        }}
                      />
                    )}
                  </Box>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results List */}
          <Box sx={{ mt: 2 }}>
            <AnimatePresence>
              {questions.map((q, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                >
                  <Card
                    elevation={1}
                    sx={{
                      mb: 2,
                      borderLeft: "6px solid",
                      borderColor: "secondary.main",
                      "&:hover": {
                        boxShadow: 4,
                        transform: "translateY(-2px)",
                        transition: "all 0.3s ease",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.6,
                          color: "text.primary",
                          fontSize: "1.05rem",
                        }}
                      >
                        <strong style={{ opacity: 0.6, marginRight: "8px" }}>
                          Q{index + 1}.
                        </strong>
                        {q}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
