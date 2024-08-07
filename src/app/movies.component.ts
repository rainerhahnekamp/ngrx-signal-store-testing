import {
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Movie } from './model';
import { MoviesService } from './movies.service';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, filter, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { withPlayTracking } from './with-play-tracking';

const MoviesStore = signalStore(
  { providedIn: 'root' },
  withPlayTracking(),
  withState({ studio: '', movies: new Array<Movie>(), loading: false }),
  withComputed((state) => ({
    movieCount: computed(() => state.movies().length),
  })),
  withMethods((store, moviesService = inject(MoviesService)) => ({
    load: rxMethod<string>(
      pipe(
        filter((studio) => studio.length >= 2),
        debounceTime(500),
        tap(() => patchState(store, { loading: true })),
        switchMap((studio) =>
          moviesService.load(studio).pipe(
            tapResponse({
              next: (movies) => patchState(store, { movies, loading: false }),
              error: console.error,
            }),
          ),
        ),
      ),
    ),
  })),
);

@Component({
  selector: 'app-movies',
  template: ` <input
      type="text"
      [(ngModel)]="studio"
      [disabled]="store.loading()"
      placeholder="Name of Studio"
    />
    <ul>
      @for (movie of store.movies(); track movie.id) {
        <p>{{ movie.id }}: {{ movie.name }}</p>
      }
    </ul>`,
  standalone: true,
  imports: [FormsModule],
})
export class MoviesComponent {
  protected readonly store = inject(MoviesStore);
  protected readonly studio = signal('');

  constructor() {
    this.store.load(this.studio);
  }
}
