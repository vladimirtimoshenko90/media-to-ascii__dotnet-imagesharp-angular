import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <main>
      <h1>{{ title }}</h1>
      <p>Convert images and video to ASCII art.</p>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      max-width: 48rem;
      margin: 0 auto;
      padding: 2rem 1rem;
      font-family: system-ui, sans-serif;
    }

    h1 {
      margin: 0 0 0.5rem;
      font-size: 1.75rem;
    }

    p {
      margin: 0;
      color: #444;
    }
  `]
})
export class AppComponent {
  title = 'media-to-ascii';
}
