import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main class="page-shell">
      <header class="tool-header">
        <h1>Media to ASCII</h1>
        <p>Convert images and video to ASCII art.</p>
      </header>
      <router-outlet />
    </main>
  `,
})
export class AppComponent {}
