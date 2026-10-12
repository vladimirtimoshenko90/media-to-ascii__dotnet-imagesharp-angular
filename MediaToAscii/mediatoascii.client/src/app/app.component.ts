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

      <section class="mb-4">
        <!-- upload-zone -->
      </section>

      <section class="mb-4">
        <!-- option-controls -->
      </section>

      <section class="mb-4">
        <!-- ascii-preview -->
      </section>

      <section class="mb-4">
        <!-- result-actions -->
      </section>

      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  title = 'media-to-ascii';
}
