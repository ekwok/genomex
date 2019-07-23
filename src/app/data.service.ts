import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // serverURL = 'https://8080-dot-4701191-dot-devshell.appspot.com';
  serverURL = 'https://genomex.appspot.com';
  dataLoading = false;
  snpsLoading = false;
  first_name: string;
  token: string;
  id: string;
  geneticPage = 1;
  snps = [];
  currChr: string;
  snpID: string;
  snpVariants: Array<any>;
  snpClicked = -1;

  chrMap: {[key: string]: string} = {  // Map of chromosome names to accession numbers
    '1': 'NC_000001.10',
    '2': 'NC_000002.11',
    '3': 'NC_000003.11',
    '4': 'NC_000004.11'
  }

  constructor(private http: HttpClient) { }

  getData(code: string) {
    this.dataLoading = true;
    this.http.get<ResultsObj>(this.serverURL + '/' + code)
      .subscribe(data => {
          this.first_name = data.first_name;
          this.token = data.token;
          this.id = data.id;
          this.dataLoading = false;
        });
  }

  getSNPs(chr: string) {
    this.snpsLoading = true;
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
          this.snpsLoading = false;
          resolve();
        }
      );
    });
    this.geneticPage = 2;
  }

  getSNPDetails(idx: number) {
    this.snpClicked = idx;
    this.geneticPage = 3;

    var snpObj = this.snps[idx];
    this.snpID = snpObj.id;
    this.snpVariants = snpObj.variants;
  }

}

interface ResultsObj {
  first_name: string;
  token: string;
  id: string;
}
