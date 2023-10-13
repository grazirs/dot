import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    //Hack for Safari iOS
    setTimeout(() => {
      this.onResize();
    }, 50)
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`);
  }
}
