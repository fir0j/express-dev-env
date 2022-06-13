export type MoviesItemType = { id: number; name?: string; year?: number };
export type MoviesItemsType = MoviesItemType[];

const movies = [
  { id: 1, name: "Inception", year: 2010 },
  { id: 2, name: "Interstellar", year: 2014 },
  { id: 3, name: "Dunkirk", year: 2017 },
];

export default movies;
