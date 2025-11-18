// src/services/api.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

/** =========================
 *  Config & helpers
 * ========================= */
export const BACKEND_URL = "http://213.199.42.57:8084";
//export const BACKEND_URL = "http://localhost:8080";

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
 *  Student flow (nuevos endpoints)
 * ========================= */

// GET /classrooms/courses/topics/{topicId}/levels
export const studentGetLevels = async (topicId) => {
  const { data } = await api.get(
    `/classrooms/courses/topics/${topicId}/levels`,
    { headers: authHeaders() }
  );
  return data;
};

// GET /student/classroom/course/topic/level/{levelId}/passedOrNot
export const studentCheckLevelPassed = async (levelId) => {
  const { data } = await api.get(
    `/student/classroom/course/topic/level/${levelId}/passedOrNot`,
    { headers: authHeaders() }
  );
  return data; // true | false
};

// GET /student/classroom/course/topic/level/{levelId}/play
export const studentPlayLevel = async (levelId) => {
  const { data } = await api.get(
    `/student/classroom/course/topic/level/${levelId}/play`,
    { headers: authHeaders() }
  );
  return data; // { levelRunId, runNumber, status }
};

// GET /student/classroom/course/topic/level/run/{levelRunId}/attempts
export const studentGetLevelRunAttempts = async (levelRunId) => {
  const { data } = await api.get(
    `/student/classroom/course/topic/level/run/${levelRunId}/attempts`,
    { headers: authHeaders() }
  );
  // Retorna: [{ exerciseNumber, attemptNumber, markedOption, isCorrect }]
  return data;
};

// GET /student/classroom/course/topic/level/run/{levelRunId}/result
export const studentGetLevelRunResult = async (levelRunId) => {
  const { data } = await api.get(
    `/student/classroom/course/topic/level/run/${levelRunId}/result`,
    { headers: authHeaders() }
  );
  // Retorna: { totalCorrectFirstTry, minCorrectFirstTry, status }
  return data;
};

// POST /student/classroom/course/topic/level/run/{levelRunId}/repeat
export const studentRepeatLevel = async (levelRunId) => {
  const { data } = await api.post(
    `/student/classroom/course/topic/level/run/${levelRunId}/repeat`,
    {},
    { headers: authHeaders() }
  );
  return data; // Información del nuevo run para repetir el nivel
};

// GET /student/classroom/course/topic/level/{levelId}/exercises
export const studentGetExercises = async (levelId) => {
  const { data } = await api.get(
    `/student/classroom/course/topic/level/${levelId}/exercises`,
    { headers: authHeaders() }
  );
  // Retorna: [{ exerciseId, exerciseNumber, question, optionA, optionB, optionC, optionD, optionE, correctOption }]
  return data;
};

// POST /student/classroom/course/topic/level/run/{levelRunId}/exercise/{exerciseNumber}/answer
export const studentMarkOption = async (levelRunId, exerciseNumber, markedOption) => {
  const { data, status } = await api.post(
    `/student/classroom/course/topic/level/run/${levelRunId}/exercise/${exerciseNumber}/answer`,
    { markedOption },
    { headers: authHeaders() }
  );
  return { status, data }; // status: 201, data: (vacío)
};

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

/** =========================
 *  User info (único endpoint para ambos roles)
 * ========================= */
// GET /user/info
export const getUserInfo = async () => {
  const { data } = await api.get("/user/info", { headers: authHeaders() });
  // data -> { name, lastNames, age }
  return data;
};
// Alias por conveniencia (mismo endpoint)
export const getStudentInfo = getUserInfo;
export const getTeacherInfo = getUserInfo;