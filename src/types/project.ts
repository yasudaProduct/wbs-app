export type Company = {
    id: number;
    name: string;
  };
  
  export type Project = {
    id: string;
    companyId: number;
    projectCode: string;
    name: string;
    startDate: Date;
    endDate: Date;
    company: Company;
  };
  
  export type CreateProjectInput = Omit<Project, 'id' | 'company' | 'startDate' | 'endDate'> & {
    startDate: string;
    endDate: string;
  };
  
  export type FormProjectInput = Omit<CreateProjectInput, 'companyId'> & {
    companyId: string;
  };
  
  