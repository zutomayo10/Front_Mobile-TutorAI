// src/hooks/useClassroomData.js
import { useState, useEffect } from 'react';
import { getClassrooms, getCourses, getTopics, studentJoinClassroom } from '../services/api';

export const useClassroomData = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar aulas del estudiante
  const loadClassrooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getClassrooms();
      setClassrooms(data || []);
    } catch (err) {
      console.error('Error cargando aulas:', err);
      setError('Error al cargar las aulas');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar cursos de un aula específica
  const loadCourses = async (classroomId) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCourses(classroomId);
      setCourses(data || []);
    } catch (err) {
      console.error('Error cargando cursos:', err);
      setError('Error al cargar los cursos');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar temas de un curso específico
  const loadTopics = async (classroomId, courseId) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTopics(classroomId, courseId);
      setTopics(data || []);
    } catch (err) {
      console.error('Error cargando temas:', err);
      setError('Error al cargar los temas');
    } finally {
      setIsLoading(false);
    }
  };

  // Unirse a un aula
  const joinClassroom = async (classroomId) => {
    try {
      setIsLoading(true);
      setError(null);
      await studentJoinClassroom(classroomId);
      // Recargar las aulas para ver la nueva
      await loadClassrooms();
      return { success: true };
    } catch (err) {
      console.error('Error uniéndose al aula:', err);
      setError('Error al unirse al aula');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar aulas automáticamente al montar el hook
  useEffect(() => {
    loadClassrooms();
  }, []);

  // Cargar cursos cuando se selecciona un aula
  useEffect(() => {
    if (selectedClassroom) {
      loadCourses(selectedClassroom.id);
    } else {
      setCourses([]);
      setSelectedCourse(null);
    }
  }, [selectedClassroom]);

  // Cargar temas cuando se selecciona un curso
  useEffect(() => {
    if (selectedClassroom && selectedCourse) {
      loadTopics(selectedClassroom.id, selectedCourse.courseId);
    } else {
      setTopics([]);
    }
  }, [selectedClassroom, selectedCourse]);

  return {
    // Estados
    classrooms,
    selectedClassroom,
    courses,
    selectedCourse,
    topics,
    isLoading,
    error,
    
    // Acciones
    setSelectedClassroom,
    setSelectedCourse,
    loadClassrooms,
    loadCourses,
    loadTopics,
    joinClassroom,
    
    // Utilidades
    clearError: () => setError(null)
  };
};