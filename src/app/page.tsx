'use client';

import { Box, Container, Typography, AppBar, Toolbar } from '@mui/material';
import TaskBoard from '@/components/TaskBoard';

export default function Home() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Collaborative Task Manager
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <TaskBoard />
      </Box>
      
      <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper', mt: 'auto' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Collaborative Task Manager
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
