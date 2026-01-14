export type Role = {
  id: number;
  name: "alumno" | "profesor" | "moderador";
};

export type User = {
  id: number;
  name: string;
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
  sex?: "masculino" | "femenino";
  background?: string;
  note?: string;
  theme?: string;
  role?: Role;
  alias?: string;
};

export type Contact = {
  user: User;
  last_message?: string;
  read?: string;
  last_time?: string;
};

//POSTS
export type Media = {
  id: number;
  name: string;
  url: string;
};

export type Comment = {
  id: number;
  user: User;
  content: string;
  image?: string; // <--- Añadimos esto (es opcional con el ?)
  media?: Media[];
  time: string;
  likes: number;
  dislikes?: number;
  views: number;
  messages: number;
  replies?: Comment[];
};

export type Like = {
  id: number;
  user: User;
  post: Post;
};

export type Bibliography = {
  id: number;
  title: string;
  description: string;
  url: string;
};

export type Post = {
  id: number;
  title: string;
  description: string;
  time: string;
  categories?: string[];
  views: number;
  messages: number;
  likes: number;
  dislikes?: number;
  media?: Media[];
  comments?: Comment[];
  user: User;
  institution?: string;
  type?: string;
  documentUrl?: string;
  bibliography?: Bibliography[];
};

//COMUNICATIONS
export type Message = {
  id: number;
  conversation_id: number;
  from_user: User;
  to_user: User;
  content: string;
  attachments?: Media[];
  time: string;
};

export type Chat = {
  id: number;
  user: User;
  messages: Message[];
  time: string;
};

//OTHERS
export type Share = {
  id: number;
  user: User;
  post: Post;
  comment: Comment;
  destination: string;
  time: string;
  // url: string;
};

export type Notification = {
  id: number;
  user_id: number;
  type: "follow" | "event";
  time: string;
  email: string;
  title: string;
  description: string;
};

export type Event = {
  id: number;
  organizer_id: number;
  title: string;
  description: string;
  date_start: string;
  date_end: string;
  location: string;
  privacy: "public" | "private" | "secret";
};

export type Group = {
  id: number;
  name: string;
  description: string;
  type: "open" | "private" | "secret";
  members: number;
  moderators: number;
  rules: string;
};

export type Mention = {
  id: number;
  entity_type: "user" | "post" | "comment";
  entity_id: number;
  referenced_user_id: number;
  context: string;
};

export type Poll = {
  id: number;
  post_id: number;
  options: string[];
  votes: number[];
  time_expiration: string;
  anonymous: boolean;
};

export type Favorite = {
  id: number;
  user_id: number;
  post_id: number;
};

export type Report = {
  id: number;
  reporter_id: number;
  target_type: "user" | "post" | "comment";
  target_id: number;
  reason: string;
  state: "pending" | "accepted" | "rejected";
  actions: string[];
};

export type Policy = {
  id: number;
  name: string;
  description: string;
  rules: string;
  date: string;
};

export type Blacklist = {
  id: number;
  user_id: number;
};

export type Option = {
  id: string | number;
  label: string;
  Icon?: React.ComponentType<{ className?: string }>;
};

export type ActiveAction = {
  type: "EDIT" | "REPLY";
  id: number;
} | null;
