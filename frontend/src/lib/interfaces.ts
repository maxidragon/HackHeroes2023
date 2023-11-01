export interface Todo {
  id: number;
  text: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: number;
  lessonId: number;
  position: number;
  subject: {
    id: number;
    name: string;
    code: string;
  };
  teacher: {
    id: number;
    name: string;
  };
  date: string;
  presenceType: {
    symbol: string;
    presence: boolean;
    absence: boolean;
    exemption: boolean;
    late: boolean;
    justified: boolean;
    deleted: boolean;
  };
  time: string;
}

export interface Exam {
  id: number;
  subject: string;
  deadline: string;
  description: string;
  teacherName: string;
  type: string;
}

export interface Grade {
  id: number;
  grade: string;
  teacher: string;
  dateCreated: string;
  weight: number;
  name: string;
  type: string;
  subject?: string;
}

export interface Grades {
  [key: string]: Grade[];
}

export interface Homework {
  id: number;
  content: string;
  createdAt: string;
  teacher: string;
  deadline: string;
  subject: string;
}

export interface Lesson {
  id: number;
  position: number;
  subject: string;
  time: string;
  teacher: string;
  group: {
    id: number;
    shortcut: string;
  };
}

export interface Note {
  id: number;
  title: string;
  content: string;
  user: {
    id: number;
    username: string;
  };
  category: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
}

export interface Flashcard {
  key?: number,
  id?: number,
  isDelete?: boolean,
  question: string,
  answer: string
}

export interface FlashcardSet {
  title: string,
  description?: string,
  publicity: string,
  flashCards: Flashcard[]
}