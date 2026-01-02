
export interface Experience {
  company: string;
  role: string;
  period: string;
  responsibilities: string[];
}

export interface Education {
  institution: string;
  degree: string;
  completionDate: string;
  grade?: string;
}

export interface GuestLecture {
  title: string;
  context: string;
  year: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}
