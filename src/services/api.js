// src/services/api.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

/** =========================
 *  Config & helpers
 * ========================= */
export const BACKEND_URL = "http://213.199.42.57:7102";

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

export const getToken = () => localStorage.getItem("token");
export const setToken = (t) => localStorage.setItem("token", t);
export const clearToken = () => localStorage.removeItem("token");

export const authHeaders = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export const getRoleBasedOnToken = () => {
  const token = getToken();
  if (!token) return null;
  const decoded = jwtDecode(token);
  return decoded?.role ?? null;
};

/** =========================
 *  AUTH
 * ========================= */
// POST /auth/register/teacher
export const registerTeacher = async ({ name, lastNames, age, email, password }) => {
  const { data, status } = await api.post("/auth/register/teacher", {
    name,
    lastNames,
    age,
    email,
    password,
  });
  if (status === 200 && data?.token) setToken(data.token);
  return data;
};

// POST /auth/login/teacher
export const loginTeacher = async ({ email, password }) => {
  const { data, status } = await api.post("/auth/login/teacher", { email, password });
  if (status === 200 && data?.token) setToken(data.token);
  return getRoleBasedOnToken();
};

// POST /auth/register/student
export const registerStudent = async ({ name, lastNames, age, passwordNumber }) => {
  const { data, status } = await api.post("/auth/register/student", {
    name,
    lastNames,
    age,
    passwordNumber,
  });
  if (status === 200 && data?.token) setToken(data.token);
  return data;
};

// POST /auth/login/student
export const loginStudent = async ({ name, lastNames, passwordNumber }) => {
  const { data, status } = await api.post("/auth/login/student", {
    name,
    lastNames,
    passwordNumber,
  });
  if (status === 200 && data?.token) setToken(data.token);
  return getRoleBasedOnToken();
};

/** =========================
 *  TEACHER actions
 * ========================= */
// POST /teacher/create/classroom   body: { name, capacity }
export const teacherCreateClassroom = async ({ name, capacity }) => {
  const { data } = await api.post(
    "/teacher/create/classroom",
    { name, capacity },
    { headers: authHeaders() }
  );
  return data; // { id, name, capacity, actualNumberStudents }
};

// POST /teacher/create/classroom/:classroomId/course   body: { name }
export const teacherCreateCourse = async (classroomId, { name }) => {
  const { data } = await api.post(
    `/teacher/create/classroom/${classroomId}/course`,
    { name },
    { headers: authHeaders() }
  );
  return data; // { courseId, name }
};

// POST /teacher/create/classroom/:classroomId/course/:courseId/topic
// body: { name, startDate?, endDate? }
export const teacherCreateTopic = async (classroomId, courseId, payload) => {
  const { data } = await api.post(
    `/teacher/create/classroom/${classroomId}/course/${courseId}/topic`,
    payload,
    { headers: authHeaders() }
  );
  return data; // { id: { classroomId, courseId, topicNumber }, name }
};

/** =========================
 *  Student actions
 * ========================= */
// POST /student/join/classroom   body: { classroomId }
export const studentJoinClassroom = async (classroomId) => {
  const { data } = await api.post(
    "/student/join/classroom",
    { classroomId },
    { headers: authHeaders() }
  );
  return data; // 1 (éxito)
};

/** =========================
 *  Gets unificados (Teacher/Student)
 * ========================= */
// GET /classrooms
export const getClassrooms = async () => {
  const { data } = await api.get("/classrooms", { headers: authHeaders() });
  return data;
};

// GET /classrooms/:classroomId/courses
export const getCourses = async (classroomId) => {
  const { data } = await api.get(`/classrooms/${classroomId}/courses`, {
    headers: authHeaders(),
  });
  return data;
};

// GET /classrooms/:classroomId/courses/:courseId/topics
export const getTopics = async (classroomId, courseId) => {
  const { data } = await api.get(
    `/classrooms/${classroomId}/courses/${courseId}/topics`,
    { headers: authHeaders() }
  );
  return data;
};

// Aliases (compatibilidad)
export const teacherGetClassrooms = getClassrooms;
export const studentGetClassrooms = getClassrooms;
export const teacherGetCourses = getCourses;
export const studentGetCourses = getCourses;
export const teacherGetTopics = getTopics;
export const studentGetTopics = getTopics;

/** =========================
 *  Chat Teacher-Assistant
 * ========================= */
// POST /messages/classrooms/:classroomId/courses/:courseId/topics/:topicNumber/boot
export const assistantBootTopic = async (classroomId, courseId, topicNumber, content) => {
  const body = { role: "ASSISTANT", content };
  const { data } = await api.post(
    `/messages/classrooms/${classroomId}/courses/${courseId}/topics/${topicNumber}/boot`,
    body,
    { headers: authHeaders() }
  );
  return data;
};

// POST /messages/classrooms/:classroomId/courses/:courseId/topics/:topicNumber/chat
// Body en texto plano (Content-Type: text/plain)
export const assistantChat = async (classroomId, courseId, topicNumber, messageText) => {
  const { data } = await api.post(
    `/messages/classrooms/${classroomId}/courses/${courseId}/topics/${topicNumber}/chat`,
    messageText,
    {
      headers: {
        ...authHeaders(),
        "Content-Type": "text/plain",
      },
    }
  );
  // Respuesta según tus capturas: { messageNumber, role: "ASSISTANT", content: "<json-string>" }
  return data;
};

/** =========================
 *  Utilidades
 * ========================= */
export const logout = () => clearToken();

// Alias para mantener tu import previo
export const fetchLogin = async (body) => loginTeacher(body);
