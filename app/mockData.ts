import { Project, WBSTask } from './types';

const mockTasks: WBSTask[] = [
  {
    id: '1',
    name: 'プロジェクト計画',
    description: 'プロジェクトの全体計画を立てる',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-06-07'),
    status: 'DONE',
    priority: 'HIGH',
    assignedTo: 'Alice',
    childTasks: [
      {
        id: '1.1',
        name: '要件定義',
        description: 'プロジェクトの要件を定義する',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-06-03'),
        status: 'DONE',
        priority: 'HIGH',
        assignedTo: 'Bob',
        parentTaskId: '1'
      },
      {
        id: '1.2',
        name: 'スケジュール作成',
        description: 'プロジェクトのスケジュールを作成する',
        startDate: new Date('2023-06-04'),
        endDate: new Date('2023-06-07'),
        status: 'DONE',
        priority: 'MEDIUM',
        assignedTo: 'Charlie',
        parentTaskId: '1'
      }
    ]
  },
  {
    id: '2',
    name: '設計',
    description: 'システムの設計を行う',
    startDate: new Date('2023-06-08'),
    endDate: new Date('2023-06-21'),
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignedTo: 'David',
    childTasks: [
      {
        id: '2.1',
        name: '基本設計',
        description: 'システムの基本設計を行う',
        startDate: new Date('2023-06-08'),
        endDate: new Date('2023-06-14'),
        status: 'DONE',
        priority: 'HIGH',
        assignedTo: 'Eve',
        parentTaskId: '2'
      },
      {
        id: '2.2',
        name: '詳細設計',
        description: 'システムの詳細設計を行う',
        startDate: new Date('2023-06-15'),
        endDate: new Date('2023-06-21'),
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignedTo: 'Frank',
        parentTaskId: '2'
      }
    ]
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'WBSマネジメントツール開発',
    description: 'WBSタスク管理の基本機能を持つプロトタイプアプリケーションの開発',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-07-31'),
    tasks: mockTasks
  }
];