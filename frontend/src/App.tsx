import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material'
import ProfessorDashboard from './components/ProfessorDashboard'
import StudentPortal from './components/StudentPortal'
import TADashboard from './components/TADashboard'
import RoleSelector from './components/RoleSelector'

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SecureAttend
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<RoleSelector />} />
          <Route path="/professor" element={<ProfessorDashboard />} />
          <Route path="/student" element={<StudentPortal />} />
          <Route path="/ta" element={<TADashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
