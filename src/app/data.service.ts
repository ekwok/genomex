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
  snpClicked: number;

  chrMap: {[key: string]: string} = {  // Map of chromosome names to accession numbers
    '1': 'NC_000001.10',
    '2': 'NC_000002.11',
    '3': 'NC_000003.11',
    '4': 'NC_000004.11',
    '5': 'NC_000005.9',
    '6': 'NC_000006.11',
    '7': 'NC_000007.13',
    '8': 'NC_000008.10',
    '9': 'NC_000009.11',
    '10': 'NC_000010.10',
    '11': 'NC_000011.9',
    '12': 'NC_000012.11',
    '13': 'NC_000013.10',
    '14': 'NC_000014.8',
    '15': 'NC_000015.9',
    '16': 'NC_000016.9',
    '17': 'NC_000017.10',
    '18': 'NC_000018.9',
    '19': 'NC_000019.9',
    '20': 'NC_000020.10',
    '21': 'NC_000021.8',
    '22': 'NC_000022.10',
    'X': 'NC_000023.10',
    'Y': 'NC_000024.9',
    'MT': 'NC_012920.1'
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
    this.snpClicked = -1;
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
