'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockProjects } from '../mockData';
import { Project, WBSTask } from '../types';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  addTask: (projectId: string, task: WBSTask) => void;
  updateTask: (projectId: string, task: WBSTask) => void;
  deleteTask: (projectId: string, taskId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      setProjects(mockProjects);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(projects.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    ));
  };

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  const addTask = (projectId: string, newTask: WBSTask) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return { ...project, tasks: [...project.tasks, newTask] };
      }
      return project;
    }));
  };

  const updateTask = (projectId: string, updatedTask: WBSTask) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          )
        };
      }
      return project;
    }));
  };

  const deleteTask = (projectId: string, taskId: string) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.filter(task => task.id !== taskId)
        };
      }
      return project;
    }));
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      addProject,
      updateProject,
      deleteProject,
      addTask,
      updateTask,
      deleteTask
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};