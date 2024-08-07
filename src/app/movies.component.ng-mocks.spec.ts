import {TestBed} from "@angular/core/testing";
import {MoviesService} from "./movies.service";
import {MoviesComponent} from "./movies.component";
import {By} from "@angular/platform-browser";
import {MoviesStore} from "./movies-store";
import {Signal, signal} from "@angular/core";
import {Movie} from "./model";
import {createMock, createMockWithValues} from "@testing-library/angular/jest-utils";
import {MockProvider, MockService} from "ng-mocks";


describe('Movies Component', () => {
  it('should show movies (ng-mocks)', () => {
    const movies = signal(new Array<Movie>());
    const loading = signal(false);
    const moviesStore = MockService(MoviesStore, {
      movies,
      loading,
      load: jest.fn<void, [Signal<string>]>(),
    })

    TestBed.configureTestingModule({
      imports: [MoviesComponent],
      providers: [{provide: MoviesStore, useValue: moviesStore}],
    });

    const fixture = TestBed.createComponent(MoviesComponent);
    fixture.autoDetectChanges(true);

    const studio = moviesStore.load.mock.calls[0][0];
    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;

    expect(studio()).toBe('');

    input.value = 'Warner Bros';
    input.dispatchEvent(new Event('input'));
    expect(studio()).toBe('Warner Bros');

    movies.set(
      [
        {id: 1, name: 'Harry Potter'},
        {id: 2, name: 'The Dark Knight'},
      ]
    );
    fixture.detectChanges();

    const movieNames = fixture.debugElement.queryAll(By.css('p')).map((el) => el.nativeElement.textContent);
    expect(movieNames).toEqual(['1: Harry Potter', '2: The Dark Knight']);
  });
});
