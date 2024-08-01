import {Injectable} from '@angular/core';
import {delay, Observable, of} from "rxjs";
import {Movie} from "./model";

let currentId = 1;

function createMovie(...names: string[]): Movie[] {
  return names.map(name => ({
    id: currentId++,
    name
  }));
}

const moviesData: Record<string, Movie[]> = {
  'Warner Bros': createMovie('Harry Potter', 'The Dark Knight'),
  'Universal': createMovie('Jurassic Park', 'Fast & Furious'),
  'Paramount': createMovie('Transformers', 'Indiana Jones'),
  'Disney': createMovie('Star Wars', 'The Lion King')
}

@Injectable({providedIn: 'root'})
export class MoviesService {
  #studios = Object.keys(moviesData);

  load(studio: string): Observable<Movie[]> {
    const studioName = this.#studios.find(key => key.startsWith(studio));
    return of(studioName ? moviesData[studioName] : []).pipe(delay(0))
  }
}
