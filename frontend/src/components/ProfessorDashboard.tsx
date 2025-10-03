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
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material'
import {
  QrCode as QrIcon,
  Close as CloseIcon,
  Flag as FlagIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon
} from '@mui/icons-material'
import { professorAPI } from '../services/api'

interface Session {
  id: string
  classId: string
  qrToken: string
  codeword: string
  startTime: string
  open: boolean
  professorHeadcount: number
}

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

const ProfessorDashboard: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [headcount, setHeadcount] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      const response = await professorAPI.getOpenSessions('class1')
      setSessions(response.data)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load sessions' })
    }
  }

  const createSession = async () => {
    try {
      const response = await professorAPI.createSession('class1')
      setSessions([...sessions, response.data])
      setMessage({ type: 'success', text: 'Session created successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create session' })
    }
  }

  const closeSession = async (sessionId: string) => {
    try {
      await professorAPI.closeSession(sessionId)
      loadSessions()
      setMessage({ type: 'success', text: 'Session closed successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to close session' })
    }
  }

  const loadAttendance = async (sessionId: string) => {
    try {
      const response = await professorAPI.getLiveAttendance(sessionId)
      setAttendance(response.data)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load attendance' })
    }
  }

  const updateHeadcount = async (sessionId: string) => {
    try {
      await professorAPI.updateHeadcount(sessionId, headcount)
      setMessage({ type: 'success', text: 'Headcount updated successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update headcount' })
    }
  }

  const flagProxy = async (attendanceId: string, flagged: boolean) => {
    try {
      await professorAPI.flagProxy(attendanceId, flagged)
      loadAttendance(selectedSession?.id || '')
      setMessage({ type: 'success', text: 'Proxy flag updated' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update flag' })
    }
  }

  const verifyAttendance = async (attendanceId: string, verified: boolean) => {
    try {
      await professorAPI.verifyAttendance(attendanceId, verified)
      loadAttendance(selectedSession?.id || '')
      setMessage({ type: 'success', text: 'Attendance verification updated' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to verify attendance' })
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Professor Dashboard
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
                Session Management
              </Typography>
              <Button 
                variant="contained" 
                onClick={createSession}
                sx={{ mb: 2 }}
              >
                Create New Session
              </Button>
              
              <List>
                {sessions.map((session) => (
                  <ListItem key={session.id}>
                    <ListItemText
                      primary={`Session ${session.id}`}
                      secondary={`Started: ${new Date(session.startTime).toLocaleString()}`}
                    />
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedSession(session)
                        loadAttendance(session.id)
                      }}
                    >
                      View Attendance
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setQrDialogOpen(true)}
                      startIcon={<QrIcon />}
                    >
                      Show QR
                    </Button>
                    <Button
                      size="small"
                      onClick={() => closeSession(session.id)}
                      startIcon={<CloseIcon />}
                      color="error"
                    >
                      Close
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Live Attendance
              </Typography>
              {selectedSession && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Session: {selectedSession.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Codeword: {selectedSession.codeword}
                  </Typography>
                  
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <TextField
                      label="Professor Headcount"
                      type="number"
                      value={headcount}
                      onChange={(e) => setHeadcount(parseInt(e.target.value) || 0)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Button 
                      variant="outlined" 
                      onClick={() => updateHeadcount(selectedSession.id)}
                    >
                      Update
                    </Button>
                  </Box>

                  <List>
                    {attendance.map((att) => (
                      <ListItem key={att.id}>
                        <ListItemText
                          primary={`Student ${att.studentId}`}
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block">
                                Time: {new Date(att.timestamp).toLocaleString()}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                {att.verificationLayersPassed.map((layer) => (
                                  <Chip 
                                    key={layer} 
                                    label={layer} 
                                    size="small" 
                                    sx={{ mr: 0.5, mb: 0.5 }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          }
                        />
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => flagProxy(att.id, !att.flaggedProxy)}
                            color={att.flaggedProxy ? 'error' : 'default'}
                          >
                            <FlagIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => verifyAttendance(att.id, !att.professorVerified)}
                            color={att.professorVerified ? 'success' : 'default'}
                          >
                            {att.professorVerified ? <CheckIcon /> : <CancelIcon />}
                          </IconButton>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)}>
        <DialogTitle>Session QR Code</DialogTitle>
        <DialogContent>
          {selectedSession && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                QR Token: {selectedSession.qrToken}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Students can scan this QR code or enter the codeword: {selectedSession.codeword}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProfessorDashboard
