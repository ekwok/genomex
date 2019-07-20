import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // serverURL = 'https://8080-dot-4701191-dot-devshell.appspot.com';
  serverURL = 'https://genomex.appspot.com';
  first_name: string;
  token: string;
  id: string;
  geneticPage = 1;
  snps = [];
  currChr: string;

  chrMap: {[key: string]: string} = {  // Map of chromosome names to accession numbers
    '1': 'NC_000001.10',
    '2': 'NC_000002.11',
    '3': 'NC_000003.11',
    '4': 'NC_000004.11'
  }

  constructor(private http: HttpClient) { }

  getData(code: string) {
    this.http.get<ResultsObj>(this.serverURL + '/' + code)
      .subscribe(data => {
          this.first_name = data.first_name;
          this.token = data.token;
          this.id = data.id;
        });
  }

  getSNPs(chr: string) {
    this.currChr = chr;
    const promise = new Promise((resolve, reject) => {
      this.http.get(this.serverURL + '/snps/' + this.token + '/' + this.id + '/' + this.chrMap[chr])
      .toPromise()
      .then(
        res => {
          this.snps = Object.keys(res).map(function(snpIndex) {
            const event = res[snpIndex];
            return event;
          });
          resolve();
        }
      );
    });
    this.geneticPage = 2;
  }

}

interface ResultsObj {
  first_name: string;
  token: string;
  id: string;
}
