import {patchState, signalStore, withComputed, withMethods, withState} from "@ngrx/signals";
import {computed, inject} from "@angular/core";
import {MoviesService} from "./movies.service";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {debounce, debounceTime, distinct, distinctUntilChanged, filter, pipe, switchMap, tap} from "rxjs";
import {tapResponse} from "@ngrx/operators";
import {State} from "./model";
import {withPlayTracking} from "./with-play-tracking";


export const MoviesStore = signalStore(
  {providedIn: 'root', protectedState: false},
  withState<State>({
    studio: '',
    movies: [],
    loading: false,
  }),
  withMethods((store, moviesService = inject(MoviesService)) => ({
    load: rxMethod<string>(
      pipe(
        filter((studio) => !!studio),
        debounceTime(300),
        tap(() => patchState(store, {loading: true})),
        switchMap((studio) => moviesService.load(studio)),
        tapResponse({
          next: (movies) =>
            patchState(store, {
              movies,
              loading: false,
            }),
          error: console.error,
        })
      )
    ),
  })),
  withComputed((state) => ({
    moviesCount: computed(() => state.movies().length),
  })),
  withPlayTracking()
);
