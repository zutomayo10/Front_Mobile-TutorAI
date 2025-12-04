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

  const loadClassrooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getClassrooms();
      const sortedData = (data || []).sort((a, b) => a.id - b.id);
      setClassrooms(sortedData);
    } catch (err) {
      console.error('Error cargando aulas:', err);
      setError('Error al cargar las aulas');
    } finally {
      setIsLoading(false);
    }
  };

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

  const joinClassroom = async (classroomId) => {
    try {
      setIsLoading(true);
      setError(null);
      await studentJoinClassroom(classroomId);
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

  useEffect(() => {
    loadClassrooms();
  }, []);

  useEffect(() => {
    if (selectedClassroom) {
      loadCourses(selectedClassroom.id);
    } else {
      setCourses([]);
      setSelectedCourse(null);
    }
  }, [selectedClassroom]);

  useEffect(() => {
    if (selectedClassroom && selectedCourse) {
      loadTopics(selectedClassroom.id, selectedCourse.courseId);
    } else {
      setTopics([]);
    }
  }, [selectedClassroom, selectedCourse]);

  return {
    classrooms,
    selectedClassroom,
    courses,
    selectedCourse,
    topics,
    isLoading,
    error,
    
    setSelectedClassroom,
    setSelectedCourse,
    loadClassrooms,
    loadCourses,
    loadTopics,
    joinClassroom,
    
    clearError: () => setError(null)
  };
};