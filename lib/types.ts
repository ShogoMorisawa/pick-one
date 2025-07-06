export interface Question {
  id: number;
  question_text: string;
  choice_a_text: string;
  choice_b_text: string;
  choice_a_count: number;
  choice_b_count: number;
}

export interface Comment {
  id: number;
  comment_text: string;
  created_at: string;
  question_id: string;
}
