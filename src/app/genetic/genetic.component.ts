import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-genetic',
  templateUrl: './genetic.component.html',
  styleUrls: ['./genetic.component.css']
})
export class GeneticComponent implements OnInit {

  constructor(public dataService: DataService) { }

  ngOnInit() {
  }

}