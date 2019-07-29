import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  signIn() {
    window.location.href = 'https://api.23andme.com/authorize/?redirect_uri=https://genomex.stackblitz.io/results/genetic/&response_type=code&client_id=5a1f0ce948126c290b1f6b10ecba07fe&scope=basic names report:all genomes phenotypes:read:all';
  }

}