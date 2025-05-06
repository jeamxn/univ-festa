export interface Guests {
  id: string;
  name: string;
  cover: string;
  icon: string;
  url: string;
}

export interface University {
  id: string;
  name: string;
  icon: string;
}

export type Calendar = {
  id: string;
  title: string;
  date: string;
  icon: string;
  university: University;
  guests: Guests[];
}