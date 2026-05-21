export interface AboutSection {
  id: number;
  title_th: string;
  title_en: string;
  description_th: string;
  description_en: string;
  learn_more_button_th: string;
  learn_more_button_en: string;
  view_button_th: string;
  view_button_en: string;
  member_details_th: string;
  member_details_en: string;
  cirriculum_th: string;
  cirriculum_en: string;
  student_project_th: string;
  student_project_en: string;
  research_project_th: string;
  research_project_en: string;
  is_active: boolean;
}

export interface FacultyMember {
  id: number;
  name_th: string;
  name_en: string;
  role_th: string;
  role_en: string;
  image: string;
  email: string;
  phone: string;
  is_leadership: boolean;
  is_staff: boolean;
  education: Array<{
    id: number;
    degree: string;
    program: string;
    university: string;
  }>;
  academic_works: Array<{
    id: number;
    title_th: string;
    title_en: string;
    description_th: string;
    description_en: string;
    year: number;
  }>;
  image_position?: string;
  x?: number;
  y?: number;
  zoom?: number;
}

export interface FacultyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: FacultyMember | null;
}

export interface ContactModalProps {
  name: string;
  address: string;
  phone: string;
  email: string;
  mapQuery: string;
  facebook?: string;
  instagram?: string;
}

export interface AdmissionList {
  group_key: string;
  label_th: string;
  label_en: string;
}

export interface AdmissionDate {
  semester_th: string;
  semester_en: string;
  deadline_th: string;
  deadline_en: string;
  notification_th: string;
  notification_en: string;
}

export interface AdmissionSection {
  id: number;
  title_th: string;
  title_en: string;
  apply_button_th: string;
  apply_button_en: string;
  tuition_domestic: string;
  tuition_international: string;
  is_active: boolean;
  lists: AdmissionList[];
  dates: AdmissionDate[];
}

export interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
  cta?: {
    text: string;
    url: string;
  };
}

export interface BannerSlide {
  id: number;
  title_th: string;
  title_en: string;
  description_th: string;
  description_en: string;
  image_path: string;
  cta_text_th: string;
  cta_text_en: string;
  cta_url: string;
  sort_order: number;
  is_active: boolean;
}

export interface EventItem {
  id: number;
  title_th: string;
  title_en: string;
  content_th: string;
  content_en: string;
  category: string;
  tags: string;
  event_date: string;
  event_time: string;
  location: string;
  is_active: boolean;
}

export interface NewsItem {
  id: number;
  title_th: string;
  title_en: string;
  content_th: string;
  content_en: string;
  image_path: string;
  category: string;
  publish_date: string;
  is_active: boolean;
}

export interface NewsDisplayItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  fullContent?: string;
}

export interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: NewsDisplayItem | null;
}

export interface Partner {
  id: number;
  name: string;
  logo: string;
  url: string;
  width: number;
  height: number;
  is_active: boolean;
}

export interface Topic {
  topic_th: string;
  topic_en: string;
}

export interface ProgramHighlight {
  id: number;
  title_th: string;
  title_en: string;
  description_th: string;
  description_en: string;
  image: string;
  event_name_th: string;
  event_name_en: string;
  event_date: string;
  event_time: string;
  event_location_th: string;
  event_location_en: string;
  registration_url: string;
  qr_code: string;
  topics: Topic[];
  archiveImages?: { image: string }[];
  is_active: boolean;
}

export interface Quote {
  id: number;
  title_th: string;
  title_en: string;
  description_th: string;
  description_en: string;
  button_th: string;
  button_en: string;
  is_active: boolean;
}

export interface AuthorAdvisor {
  name_th: string;
  name_en: string;
}

export interface StudentProject {
  id?: number;
  title_th: string;
  title_en: string;
  description_th?: string;
  description_en?: string;
  course?: string;
  details_th?: string;
  details_en?: string;
  year: number;
  image: string;
  link: string;
  is_active: boolean;
  authors?: AuthorAdvisor[];
  advisors?: AuthorAdvisor[];
}

export interface StudentProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: StudentProject | null;
}

export interface Publication {
  id?: number;
  title_th: string;
  title_en: string;
  description_th: string;
  description_en: string;
  year: number;
  authors?: AuthorAdvisor[];
  authors_th?: string;
  authors_en?: string;
  keywords?: string[];
  published_at?: string;
  link: string;
  is_active: boolean;
}

export interface DynamicStudentProject {
  id: number;
  title_th: string;
  title_en: string;
  description_th: string;
  description_en: string;
  year: number;
  image: string;
  link: string;
  is_active: boolean;
}

export interface DynamicPublication {
  id: number;
  title_th: string;
  title_en: string;
  description_th: string;
  description_en: string;
  year: number;
  authors_th: string;
  authors_en: string;
  link: string;
  is_active: boolean;
  authors?: { name_th: string; name_en: string }[];
  keywords?: string[];
}

export interface FooterLink {
  id: number;
  name_th: string;
  name_en: string;
  href: string;
  sort_order: number;
  is_active: boolean;
}

export interface FooterSocial {
  id: number;
  icon: string;
  href: string;
  sort_order: number;
  is_active: boolean;
}

export interface FooterContact {
  id: number;
  type: string;
  value_th: string;
  value_en: string;
  sort_order: number;
  is_active: boolean;
}

export interface NavbarItem {
  id: number;
  title_th: string;
  title_en: string;
  url: string;
  parent_id: number | null;
  order_index: number;
  is_active: boolean;
  is_dropdown: boolean;
  children?: NavbarItem[];
}

export interface Language {
  code: string;
  name: string;
}

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export interface AboutDepartmentData {
  id: number;
  overview_title_th: string;
  overview_description_th: string;
  overview_title_en: string;
  overview_description_en: string;
  mission_title_th: string;
  mission_description_th: string;
  vision_title_th: string;
  vision_description_th: string;
  mission_title_en: string;
  mission_description_en: string;
  vision_title_en: string;
  vision_description_en: string;
  faculty: FacultyMember[];
  facilities: any[];
  about: any[];
}

export interface Requirement {
  id?: number;
  requirement_th: string;
  requirement_en: string;
  sort_order?: number;
}

export interface Track {
  id: number;
  title_th: string;
  title_en: string;
  description_th: string;
  description_en: string;
  icon: string;
  sort_order?: number;
  is_active?: boolean;
  requirements: Requirement[];
  link?: string;
}

export interface TuitionFee {
  id: number;
  amount: string;
  description_th: string;
  description_en: string;
  is_active?: boolean;
}

export interface Scholarship {
  id: number;
  title_th: string;
  title_en: string;
  description_th: string;
  description_en: string;
  amount: string;
  is_active?: boolean;
}

export interface ImportantDate {
  id: number;
  round_th: string;
  round_en: string;
  application_period_th: string;
  application_period_en: string;
  interview_date_th: string;
  interview_date_en: string;
  result_date_th: string;
  result_date_en: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface CLO {
  clo_en: string;
  clo_th: string;
}

export interface UserData {
  id: number;
  username: string;
  role: string;
  full_name: string;
  email: string;
}

export interface CareerMetric {
  'Technical Skills': number;
  'Problem Solving': number;
  'Communication': number;
  'Leadership': number;
  'Research': number;
  'Business Impact': number;
}

export interface Career {
  name: string;
  description: string;
  salary: string;
  color: string;
  metrics: CareerMetric;
}
