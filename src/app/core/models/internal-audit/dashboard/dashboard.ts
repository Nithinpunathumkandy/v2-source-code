export interface StatusWiseAnalysisFindings {
  id: number
  type: string,
  label: string,
  title: string,
  findings: {
    count: number,
    percentage: number
  }
  count
}

export interface Top10Findings {
  id
  title
  risk_rating: {
    id,
    type,
    label,
    color_code,
    title
  }
}

export interface CorrectiveActionOpenCloseCount {
  total
  open: {
    count
    percentage
  },
  closed: {
    count
    percentage
  }
}

export interface ActionPlans {
  id
  title
  reference_code
  start_date
  target_date
  responsible_user: {
    id
    first_name
    last_name
    email
    image_url
    image_token
    designation: {
      title
      id
    }
  },
  corrective_action_status: {
    id
    type
    label
    color_code
    title
  }
}

export interface OverdueActionPlans {
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
  from: number;
  data: ActionPlans[];
}

export interface Top10List {
  id
  title
  risk_rating: {
    id
    type
    label
    color_code
    title
  }
}

export interface Top10PaginationResponse {
  current_page: number;
  per_page: number;
  total: number;
  data: Top10List[];
}

export interface DepartmentFindings {
  id
  title
  code
  color_code
  total
  extreme
  very_high
  high
  medium
  low
}

export interface CorrectiveActionsByDepartment {
  id
  color_code
  extreme
  low
  very_high
  title
  code
  medium
  total
}

export interface FindingDepartmentPagination {
  id
  color_code
  extreme
  low
  very_high
  high
  title
  code
  medium
  total
}

export interface CorrectiveActionsByResponsibleUser {
  id
  first_name
  last_name
  email
  image_url
  image_token
  designation: {
    title
    id
    code
  }
  medium
  total
}

export interface CorrectiveActionDepartment {
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
  from: number;
  data: CorrectiveActionsByDepartment[];
}

export interface FindingDepartmentPage {
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
  from: number;
  data: FindingDepartmentPagination[];
}

export interface CorrectiveActionResponsibleUser {
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
  from: number;
  data: CorrectiveActionsByResponsibleUser[];
}