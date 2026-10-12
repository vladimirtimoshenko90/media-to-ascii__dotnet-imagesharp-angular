import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main>
      <h1>{{ title }}</h1>
      <p>Convert images and video to ASCII art.</p>
      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  title = 'media-to-ascii';
}
