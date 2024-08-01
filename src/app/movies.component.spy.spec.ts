import {TestBed} from "@angular/core/testing";
import {MoviesComponent} from "./movies.component";
import {By} from "@angular/platform-browser";
import {MoviesStore} from "./movies-store";
import {MoviesService} from "./movies.service";
import {Observable} from "rxjs";
import {patchState} from "@ngrx/signals";

describe('Movies Component', () => {
  it('should show movies (spy)', () => {
    TestBed.configureTestingModule({
      imports: [MoviesComponent],
      providers: [
        {
          provide: MoviesService,
          useValue: {},
        },
      ],
    });

    const moviesStore = TestBed.inject(MoviesStore);
    const loadSpy = jest.spyOn(moviesStore, 'load');
    const fixture = TestBed.createComponent(MoviesComponent);

    fixture.autoDetectChanges(true);

    const studio = loadSpy.mock.calls[0][0];
    if (studio instanceof Observable || typeof studio === 'string') {
      throw new Error('Expected signal');
    }

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;

    expect(studio()).toBe('');

    input.value = 'Warner Bros';
    input.dispatchEvent(new Event('input'));
    expect(studio()).toBe('Warner Bros');

    patchState(moviesStore, {
        movies:
          [
            {id: 1, name: 'Harry Potter'},
            {id: 2, name: 'The Dark Knight'},
          ]
      }
    );

    fixture.detectChanges();

    const movies = fixture.debugElement.queryAll(By.css('p')).map((el) => el.nativeElement.textContent);
    expect(movies).toEqual(['1: Harry Potter', '2: The Dark Knight']);
  });
});
