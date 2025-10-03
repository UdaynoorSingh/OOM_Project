import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Professor API
export const professorAPI = {
  createSession: (classId: string) => api.post(`/professor/classes/${classId}/sessions`),
  closeSession: (sessionId: string) => api.put(`/professor/sessions/${sessionId}/close`),
  getOpenSessions: (classId: string) => api.get(`/professor/classes/${classId}/sessions/open`),
  getLiveAttendance: (sessionId: string) => api.get(`/professor/sessions/${sessionId}/attendance`),
  updateHeadcount: (sessionId: string, headcount: number) => 
    api.put(`/professor/sessions/${sessionId}/headcount`, { headcount }),
  flagProxy: (attendanceId: string, flagged: boolean) => 
    api.put(`/professor/attendance/${attendanceId}/flag`, { flagged }),
  verifyAttendance: (attendanceId: string, verified: boolean) => 
    api.put(`/professor/attendance/${attendanceId}/verify`, { verified }),
}

// Student API
export const studentAPI = {
  markAttendance: (data: any) => api.post('/student/mark-attendance', data),
  getStudentAttendance: (studentId: string) => api.get(`/student/${studentId}/attendance`),
  getAttendanceForSession: (studentId: string, sessionId: string) => 
    api.get(`/student/${studentId}/sessions/${sessionId}/attendance`),
}

// TA API
export const taAPI = {
  getVerifiedAttendance: (sessionId: string) => api.get(`/ta/sessions/${sessionId}/attendance`),
  getStudentAttendanceHistory: (studentId: string) => api.get(`/ta/students/${studentId}/attendance`),
}

export default api
