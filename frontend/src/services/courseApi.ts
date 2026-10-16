import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
});

export interface CourseDTO {
  id: number;
  title: string;
  category: string;
  description: string;
  level: string;
  duration: string;
  provider: string;
  url: string;
  type: string;
  tags: string;
}

export const fetchCourses = () => api.get<CourseDTO[]>('/api/courses');
export const fetchCoursesPaged = (page: number = 0, size: number = 12) =>
  api.get<CourseDTO[]>(`/api/education/courses/paged?page=${page}&size=${size}`);

export const filterCoursesByCategory = (cat: string) =>
  api.get<CourseDTO[]>(`/api/courses/category/${cat}`);
export const filterCoursesByProvider = (provider: string) =>
  api.get<CourseDTO[]>(`/api/courses/provider/${provider}`);
export const filterCoursesByLevel = (level: string) =>
  api.get<CourseDTO[]>(`/api/courses/level/${level}`);
export const startCourse = (userId: number, courseId: number) =>
  api.post<void>(`/api/courses/start?userId=${userId}&courseId=${courseId}`);
export const completeCourse = (userId: number, courseId: number) =>
  api.post<void>(`/api/courses/complete?userId=${userId}&courseId=${courseId}`);
