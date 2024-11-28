// User related types
export type User = {
    id: number;
    name: string;
    email: string;
  };
  
  // Company related types
  export type Company = {
    id: number;
    name: string;
    projects: Project[];
  };
  
  // Project related types
  export type Project = {
    id: number;
    companyId: number;
    projectCode: string;
    name: string;
    startDate: Date;
    endDate: Date;
    company: Company;
    wbs?: WBS[];
  };
  
  export type CreateProjectInput = Omit<Project, 'id' | 'company' | 'wbs' | 'startDate' | 'endDate'> & {
    startDate: string;
    endDate: string;
  };
  
  export type FormProjectInput = Omit<CreateProjectInput, 'companyId'> & {
    companyId: string;
  };
  
  // WBS related types
  export type WBS = {
    id: number;
    projectId: string;
    project: Project;
    phases: WBSPhase[];
    tasks: WBSTask[];
  };
  
  export type CreateWBSInput = Pick<WBS, 'projectId'>;
  
  // WBS Phase related types
  export type WBSPhase = {
    id: number;
    wbsId: number;
    phaseTemplateId: number | null;
    seq: number;
    name: string;
    isCustom: boolean;
    wbs: WBS;
    phaseTemplate?: PhaseTemplate;
    tasks: WBSTask[];
  };
  
  export type CreateWBSPhaseInput = Omit<WBSPhase, 'id' | 'wbs' | 'phaseTemplate' | 'tasks'>;
  
  // Phase Template related types
  export type PhaseTemplate = {
    id: number;
    name: string;
    order: number;
    wbsPhases: WBSPhase[];
  };
  
  export type CreatePhaseTemplateInput = Omit<PhaseTemplate, 'id' | 'wbsPhases'>;
  
  // WBS Task related types
  export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  
  export type WBSTask = {
    id: string;
    wbsId: number;
    phaseId: number;
    name: string;
    tantoId: number | null;
    kijunStartDate: Date;
    kijunEndDate: Date;
    kijunKosu: number;
    status: TaskStatus;
    wbs: WBS;
    phase: WBSPhase;
    assignee?: User;
    statusLogs: TaskStatusLog[];
  };
  
  export type CreateWBSTaskInput = Omit<WBSTask, 'id' | 'wbs' | 'phase' | 'assignee' | 'statusLogs' | 'kijunStartDate' | 'kijunEndDate'> & {
    kijunStartDate: string;
    kijunEndDate: string;
  };
  
  export type FormWBSTaskInput = Omit<CreateWBSTaskInput, 'tantoId' | 'wbsId' | 'phaseId'> & {
    tantoId: string;
    wbsId: string;
    phaseId: string;
  };
  
  // Task Status Log related types
  export type TaskStatusLog = {
    id: number;
    taskId: string;
    status: TaskStatus;
    changedAt: Date;
    changedBy: number | null;
    task: WBSTask;
    changer?: User;
  };
  
  export type CreateTaskStatusLogInput = Omit<TaskStatusLog, 'id' | 'task' | 'changer' | 'changedAt'> & {
    changedAt: string;
  };
  
  