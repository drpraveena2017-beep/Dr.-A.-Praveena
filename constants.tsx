import { Experience, Education, GuestLecture, SkillGroup } from './types';

// Vertical professional portrait placeholder
export const PROFILE_IMAGE = "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?q=80&w=1000&auto=format&fit=crop";

export const EXPERIENCES: Experience[] = [
  {
    company: "Tamil Nadu Education Fellowship | Senior Fellow",
    role: "Senior Fellow",
    period: "Oct 2022 – July 2024",
    responsibilities: [
      "Created District Action Plan based on priorities outlined by the School Education Department.",
      "Liaison with district officials and support the Fellows to carry out their responsibilities effectively.",
      "Supported in conducting review meetings at the district level.",
      "Managed Fellows and ensured effective coordination between them.",
      "Supported district officials in implementing education quality improvement projects as a POC.",
      "Coordinated with elementary and secondary education departments (Ennum Ezhuthum, Capacity Building)."
    ]
  },
  {
    company: "Idhaya Engineering College for Women, Chinnasalem",
    role: "Professor of Chemistry",
    period: "Aug 2005 – Aug 2022 | 19+ Yrs",
    responsibilities: [
      "Oversaw student services, including counseling, career services, and student activities.",
      "Managed recruitment, employee relations, and staff development programs.",
      "Implemented and maintained ISO 9001 standards, conducting regular audits.",
      "Conducted research and published findings in peer-reviewed journals.",
      "Mentored and advised students on academic and career goals."
    ]
  }
];

export const EDUCATION: Education[] = [
  {
    institution: "Anna University, Chennai",
    degree: "Ph.D. in Chemistry",
    completionDate: "November 2017"
  },
  {
    institution: "Dharmaram Academy for Distance Education (DADE)",
    degree: "PG - Diploma in Counselling Psychology",
    completionDate: "May 2017"
  },
  {
    institution: "Annamalai University, Chidambaram",
    degree: "M.Phil. in Chemistry",
    completionDate: "November 2004",
    grade: "CGPA 8.53"
  },
  {
    institution: "Annamalai University, Chidambaram",
    degree: "M.Sc. in Chemistry",
    completionDate: "May 2003",
    grade: "CGPA 8"
  },
  {
    institution: "Government Arts and Science College, C-Mutlur",
    degree: "B.Sc. in Chemistry",
    completionDate: "April 2001",
    grade: "66.26%"
  }
];

export const GUEST_LECTURES: GuestLecture[] = [
  { title: "Student Centric Learning", context: "Idhaya Engineering College for Women", year: "2021" },
  { title: "Dream Big", context: "Achariya College of Engineering Technology", year: "2021" },
  { title: "Success Unlimited", context: "Tagore Institute of Engineering and Technology", year: "2023" },
  { title: "Positive Workplace Culture", context: "TNEF Team Session", year: "2023" },
  { title: "Mental Health Awareness", context: "Maha Barathi Engineering College", year: "2023" }
];

export const SKILLS: SkillGroup[] = [
  {
    category: "Teaching & Training",
    items: ["Classroom Management", "Experiential Learning", "Faculty Mentoring", "POSH Training Delivery", "Guest Lecturing"]
  },
  {
    category: "Leadership & Administration",
    items: ["HR In-Charge", "IQAC & NAAC Work", "ISO Management", "Head of Department", "Event Coordination"]
  },
  {
    category: "Soft Skills",
    items: ["Public Speaking", "Problem Solving", "Team Building", "Decision Making", "Time Management"]
  },
  {
    category: "Digital Literacy",
    items: ["MS Office Suite", "Google Workspace", "Looker Studio", "Research Databases"]
  }
];

export const KEY_RESPONSIBILITIES = [
  "Senior Fellow | TNEF",
  "Dean (Student Affairs)",
  "HR In-charge",
  "Management Representative - QMS/ISO 9001",
  "IQAC Member",
  "NAAC Accreditation Work",
  "NSS Program Officer",
  "Head of Department | S&H"
];