import {Component, effect, inject, signal, untracked} from '@angular/core';
import {MoviesStore} from './movies-store';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-movies',
  template: `
    <input type="text" [(ngModel)]="studio" [disabled]="store.loading()" placeholder="Name of Studio"/>
    <ul>
      @for (movie of store.movies(); track movie.id) {
        <p>{{ movie.id }}: {{ movie.name }}</p>
      }
    </ul>`,
  standalone: true,
  imports: [
    FormsModule
  ]
})
export class MoviesComponent {
  protected studio = signal('')
  protected readonly store = inject(MoviesStore);

  constructor() {
    this.store.load(this.studio);
  }
}
