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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Paper
} from '@mui/material'
import {
  QrCodeScanner as QrIcon,
  LocationOn as LocationIcon,
  Face as FaceIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material'
import { studentAPI } from '../services/api'

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

const StudentPortal: React.FC = () => {
  const [studentId] = useState('student1') // In real app, this would come from auth
  const [sessionId, setSessionId] = useState('')
  const [qrOrCodeword, setQrOrCodeword] = useState('')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [wifiSsid, setWifiSsid] = useState('')
  const [faceImageBase64, setFaceImageBase64] = useState('')
  const [livenessPassed, setLivenessPassed] = useState(false)
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false)

  useEffect(() => {
    loadStudentAttendance()
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
        },
        (error) => {
          console.error('Error getting location:', error)
          // Mock location for demo
          setLatitude(40.7128)
          setLongitude(-74.0060)
        }
      )
    } else {
      // Mock location for demo
      setLatitude(40.7128)
      setLongitude(-74.0060)
    }
  }

  const loadStudentAttendance = async () => {
    try {
      const response = await studentAPI.getStudentAttendance(studentId)
      setAttendance(response.data)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load attendance history' })
    }
  }

  const markAttendance = async () => {
    try {
      const verificationData = {
        studentId,
        sessionId,
        qrOrCodeword,
        latitude,
        longitude,
        wifiSsid,
        faceImageBase64,
        livenessPassed
      }

      const response = await studentAPI.markAttendance(verificationData)
      setMessage({ type: 'success', text: 'Attendance marked successfully!' })
      setVerificationDialogOpen(false)
      loadStudentAttendance()
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to mark attendance' })
    }
  }

  const simulateFaceCapture = () => {
    // Mock face capture - in real app, this would use camera API
    setFaceImageBase64('mock-face-image-data')
    setLivenessPassed(true)
    setMessage({ type: 'success', text: 'Face verification completed' })
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Student Portal
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
                Mark Attendance
              </Typography>
              
              <TextField
                fullWidth
                label="Session ID"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="QR Code or Codeword"
                value={qrOrCodeword}
                onChange={(e) => setQrOrCodeword(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                fullWidth
                onClick={() => setVerificationDialogOpen(true)}
                startIcon={<QrIcon />}
                sx={{ mb: 2 }}
              >
                Start Verification Process
              </Button>

              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Current Location:
                </Typography>
                <Typography variant="body2">
                  Lat: {latitude?.toFixed(4)} | Lng: {longitude?.toFixed(4)}
                </Typography>
                <Typography variant="body2">
                  Wi-Fi: {wifiSsid || 'Not detected'}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Attendance History
              </Typography>
              
              <List>
                {attendance.map((att) => (
                  <ListItem key={att.id}>
                    <ListItemText
                      primary={`Session ${att.sessionId}`}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            Time: {new Date(att.timestamp).toLocaleString()}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip 
                              label={`System: ${att.systemVerified ? 'Verified' : 'Pending'}`}
                              color={att.systemVerified ? 'success' : 'default'}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                            <Chip 
                              label={`Professor: ${att.professorVerified ? 'Verified' : 'Pending'}`}
                              color={att.professorVerified ? 'success' : 'default'}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                            {att.flaggedProxy && (
                              <Chip 
                                label="Flagged as Proxy"
                                color="error"
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            )}
                          </Box>
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
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog 
        open={verificationDialogOpen} 
        onClose={() => setVerificationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Multi-Layer Verification</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Step 1: QR Code / Codeword Verification
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ✓ Entered: {qrOrCodeword || 'Not provided'}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Step 2: Location Verification
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ✓ GPS: {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ✓ Wi-Fi: {wifiSsid || 'Not detected'}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Step 3: Face Recognition & Liveness Detection
            </Typography>
            <Button
              variant="outlined"
              startIcon={<FaceIcon />}
              onClick={simulateFaceCapture}
              sx={{ mb: 2 }}
            >
              Capture Face & Verify Liveness
            </Button>
            <FormControlLabel
              control={
                <Switch
                  checked={livenessPassed}
                  onChange={(e) => setLivenessPassed(e.target.checked)}
                />
              }
              label="Liveness Detection Passed"
            />
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            All verification layers must pass for successful attendance marking.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerificationDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={markAttendance}
            startIcon={<CheckIcon />}
            disabled={!livenessPassed}
          >
            Mark Attendance
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default StudentPortal
