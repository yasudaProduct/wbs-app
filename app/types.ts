export interface Project {
    id: string;
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    tasks: WBSTask[];
  }
  
  export interface WBSTask {
    id: string;
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    assignedTo?: string;
    parentTaskId?: string;
    childTasks?: WBSTask[];
  }  