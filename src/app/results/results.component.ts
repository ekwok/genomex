import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  constructor(public dataService: DataService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const code: string = this.activatedRoute.snapshot.queryParams['code'];
    this.dataService.getData(code);
  }

}
