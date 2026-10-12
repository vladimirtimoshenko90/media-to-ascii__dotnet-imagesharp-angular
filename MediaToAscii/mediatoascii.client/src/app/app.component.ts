import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main class="container py-4">
      <header class="mb-4">
        <h1>{{ title }}</h1>
        <p class="text-secondary mb-0">Convert images and video to ASCII art.</p>
      </header>

      <section class="mb-4" aria-label="Upload">
        <!-- upload-zone -->
      </section>

      <section class="mb-4" aria-label="Options">
        <!-- option-controls -->
      </section>

      <section class="mb-4" aria-label="Preview">
        <!-- ascii-preview -->
      </section>

      <section class="mb-4" aria-label="Actions">
        <!-- result-actions -->
      </section>

      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  title = 'media-to-ascii';
}
