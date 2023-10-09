import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dot';
  ngOnInit() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`);
  }
}
