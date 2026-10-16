import { Component, input } from '@angular/core';
import { AsciiFrame } from '@services/convert-api.service';

@Component({
  selector: 'app-ascii-frame-viewer',
  template: `
    <pre class="ascii-frame-viewer">{{ frame().ascii }}</pre>
  `,
  styles: `
    :host {
      display: block;
      width: max-content;
      max-width: none;
      height: auto;
      max-height: none;
      overflow: visible;
    }

    /* Override Bootstrap reboot pre { overflow: auto } — never scroll here */
    .ascii-frame-viewer {
      display: block;
      margin: 0;
      font-family: var(--font-mono);
      font-size: 11px;
      line-height: 1;
      white-space: pre;
      color: var(--fg);
      overflow: visible;
      max-height: none;
      height: auto;
    }
  `,
})
export class AsciiFrameViewerComponent {
  readonly frame = input.required<AsciiFrame>();
}
