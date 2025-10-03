import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import {
  Assessment as ReportIcon,
  TrendingUp as TrendIcon,
  People as PeopleIcon
} from '@mui/icons-material'
import { taAPI } from '../services/api'

interface Attendance {
  id: string
  studentId: string
  sessionId: string
  verificationLayersPassed: string[]
  systemVerified: boolean
  professorVerified: boolean
  flaggedProxy: boolean
  timestamp: string
}

const TADashboard: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [studentHistory, setStudentHistory] = useState<Attendance[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const loadSessionAttendance = async () => {
    if (!selectedSession) return
    
    try {
      const response = await taAPI.getVerifiedAttendance(selectedSession)
      setAttendance(response.data)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load session attendance' })
    }
  }

  const loadStudentHistory = async () => {
    if (!selectedStudent) return
    
    try {
      const response = await taAPI.getStudentAttendanceHistory(selectedStudent)
      setStudentHistory(response.data)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load student history' })
    }
  }

  const generateAttendanceReport = () => {
    const totalAttendance = attendance.length
    const verifiedCount = attendance.filter(att => att.systemVerified && att.professorVerified).length
    const flaggedCount = attendance.filter(att => att.flaggedProxy).length
    const verificationRate = totalAttendance > 0 ? (verifiedCount / totalAttendance * 100).toFixed(1) : '0'
    
    return {
      totalAttendance,
      verifiedCount,
      flaggedCount,
      verificationRate
    }
  }

  const generateTrends = () => {
    const trends = studentHistory.reduce((acc, att) => {
      const date = new Date(att.timestamp).toDateString()
      if (!acc[date]) {
        acc[date] = { total: 0, verified: 0 }
      }
      acc[date].total++
      if (att.systemVerified && att.professorVerified) {
        acc[date].verified++
      }
      return acc
    }, {} as Record<string, { total: number, verified: number }>)

    return Object.entries(trends).map(([date, stats]) => ({
      date,
      ...stats,
      rate: (stats.verified / stats.total * 100).toFixed(1)
    }))
  }

  const report = generateAttendanceReport()
  const trends = generateTrends()

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Teaching Assistant Dashboard
      </Typography>

      {message && (
        <Alert 
          severity={message.type} 
          onClose={() => setMessage(null)}
          sx={{ mb: 2 }}
        >
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Session Attendance Analysis
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Session</InputLabel>
                <Select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                >
                  <MenuItem value="session1">Session 1</MenuItem>
                  <MenuItem value="session2">Session 2</MenuItem>
                  <MenuItem value="session3">Session 3</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant="contained" 
                onClick={loadSessionAttendance}
                disabled={!selectedSession}
                sx={{ mb: 2 }}
              >
                Load Attendance Data
              </Button>

              {attendance.length > 0 && (
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    Session Report
                  </Typography>
                  <Typography variant="body2">
                    Total Attendance: {report.totalAttendance}
                  </Typography>
                  <Typography variant="body2">
                    Verified: {report.verifiedCount}
                  </Typography>
                  <Typography variant="body2">
                    Flagged as Proxy: {report.flaggedCount}
                  </Typography>
                  <Typography variant="body2">
                    Verification Rate: {report.verificationRate}%
                  </Typography>
                </Paper>
              )}

              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Student ID</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Layers</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendance.map((att) => (
                      <TableRow key={att.id}>
                        <TableCell>{att.studentId}</TableCell>
                        <TableCell>
                          <Box>
                            <Chip 
                              label={att.systemVerified ? 'System ✓' : 'System ✗'}
                              color={att.systemVerified ? 'success' : 'default'}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                            <Chip 
                              label={att.professorVerified ? 'Prof ✓' : 'Prof ✗'}
                              color={att.professorVerified ? 'success' : 'default'}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                            {att.flaggedProxy && (
                              <Chip 
                                label="Flagged"
                                color="error"
                                size="small"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {att.verificationLayersPassed.map((layer) => (
                            <Chip 
                              key={layer} 
                              label={layer} 
                              size="small" 
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </TableCell>
                        <TableCell>
                          {new Date(att.timestamp).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Student Attendance Trends
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Student</InputLabel>
                <Select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  <MenuItem value="student1">Student 1</MenuItem>
                  <MenuItem value="student2">Student 2</MenuItem>
                  <MenuItem value="student3">Student 3</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant="contained" 
                onClick={loadStudentHistory}
                disabled={!selectedStudent}
                sx={{ mb: 2 }}
              >
                Load Student History
              </Button>

              {studentHistory.length > 0 && (
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    Student Trends
                  </Typography>
                  <Typography variant="body2">
                    Total Records: {studentHistory.length}
                  </Typography>
                  <Typography variant="body2">
                    Verified Rate: {trends.length > 0 ? 
                      (trends.reduce((sum, t) => sum + parseFloat(t.rate), 0) / trends.length).toFixed(1) + '%' : 
                      '0%'
                    }
                  </Typography>
                </Paper>
              )}

              {trends.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Verified</TableCell>
                        <TableCell>Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {trends.map((trend, index) => (
                        <TableRow key={index}>
                          <TableCell>{trend.date}</TableCell>
                          <TableCell>{trend.total}</TableCell>
                          <TableCell>{trend.verified}</TableCell>
                          <TableCell>{trend.rate}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TADashboard
