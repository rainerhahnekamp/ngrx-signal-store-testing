
export type Movie = {
  id: number;
  name: string;
};

export type State = { studio: string; movies: Movie[]; loading: boolean };
