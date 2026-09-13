import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Link, 
  Snackbar, 
  Alert, 
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  AutoAwesome, 
  LockOutlined, 
  EmailOutlined, 
  Visibility, 
  VisibilityOff 
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
    },
    background: {
      default: '#0f172a',
      paper: 'rgba(15, 23, 42, 0.85)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    button: { fontWeight: 600, textTransform: 'none' }
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          }
        }
      }
    }
  }
});

function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Create floating geometric particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1200;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 80;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: '#60a5fa',
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create floating glowing geometric shapes
    const group = new THREE.Group();
    scene.add(group);

    const geometries = [
      new THREE.DodecahedronGeometry(2, 0),
      new THREE.IcosahedronGeometry(2.5, 0),
      new THREE.OctahedronGeometry(2, 0)
    ];

    const shapes = [];
    for (let i = 0; i < 6; i++) {
      const geom = geometries[Math.floor(Math.random() * geometries.length)];
      const mat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x3b82f6 : 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20
      );
      group.add(mesh);
      shapes.push({ mesh, rotSpeed: { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01 } });
    }

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) - 0.5;
      mouseY = (event.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      particlesMesh.rotation.y += 0.0008;
      particlesMesh.rotation.x += 0.0004;

      group.rotation.y += mouseX * 0.05;
      group.rotation.x += mouseY * 0.05;

      shapes.forEach(item => {
        item.mesh.rotation.x += item.rotSpeed.x;
        item.mesh.rotation.y += item.rotSpeed.y;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <Box ref={mountRef} sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }} />;
}

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setSnackbar({ open: true, message: 'Please enter both email and password.', severity: 'error' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSnackbar({ open: true, message: 'Login successful! Welcome back.', severity: 'success' });
    }, 1500);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <ThreeBackground />

        {/* Main Layout Container */}
        <Box sx={{ 
          position: 'relative', 
          zIndex: 1, 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: { xs: 'center', md: 'flex-end' },
          p: { xs: 2, md: 0 }
        }}>
          {/* Right Side: Glassmorphic Login Panel */}
          <Box sx={{ 
            width: { xs: '100%', sm: '440px', md: '520px', lg: '560px' },
            height: { xs: 'auto', md: '100vh' },
            maxHeight: { xs: '92vh', md: 'none' },
            overflowY: { xs: 'auto', md: 'auto' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 4, sm: 6, md: 8 },
            backgroundColor: 'rgba(15, 23, 42, 0.82)',
            backdropFilter: 'blur(24px)',
            borderLeft: { md: '1px solid rgba(255, 255, 255, 0.1)' },
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            <Box sx={{ maxWidth: '420px', width: '100%', mx: 'auto' }}>
              
              {/* Header / Logo */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                <Box sx={{ 
                  p: 1.2, 
                  borderRadius: 0.5, 
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
                }}>
                  <AutoAwesome sx={{ color: '#ffffff', fontSize: 26 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  Hacksaw
                </Typography>
              </Box>

              {/* Welcome text */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ color: '#ffffff', mb: 1, fontWeight: 700 }}>
                  Welcome back
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Please enter your credentials to access your account.
                </Typography>
              </Box>

              {/* Form */}
              <form onSubmit={handleLogin}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  
                  <TextField
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    slotProps={{ input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        </InputAdornment>
                      ),
                    }}}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                      input: { color: '#ffffff' }
                    }}
                  />

                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    slotProps={{ input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                      input: { color: '#ffffff' }
                    }}
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={rememberMe} 
                          onChange={(e) => setRememberMe(e.target.checked)} 
                          sx={{ color: 'rgba(255, 255, 255, 0.5)', '&.Mui-checked': { color: '#3b82f6' } }}
                        />
                      }
                      label={<Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>Remember me</Typography>}
                    />
                    <Link href="#" variant="body2" sx={{ color: '#60a5fa', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                      Forgot password?
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '1rem',
                      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.5)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                        boxShadow: '0 15px 30px rgba(59, 130, 246, 0.7)',
                      }
                    }}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Sign In'}
                  </Button>

                </Box>
              </form>

              {/* Footer */}
              <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Don't have an account?{' '}
                  <Link href="#" sx={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    Sign up
                  </Link>
                </Typography>
              </Box>

            </Box>
          </Box>
        </Box>

        {/* Snackbar Notification */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ 
              width: '100%', 
              borderRadius: 0.5, 
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              fontWeight: 500,
              backgroundColor: snackbar.severity === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

      </Box>
    </ThemeProvider>
  );
}