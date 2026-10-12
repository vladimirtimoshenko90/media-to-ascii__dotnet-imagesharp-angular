import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main class="container py-4">
      <header class="mb-4">
        <h1>Media to ASCII</h1>
        <p class="text-secondary mb-0">Convert images and video to ASCII art.</p>
      </header>
      <router-outlet />
    </main>
  `,
})
export class AppComponent {}
