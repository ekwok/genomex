// NOTE: This file is not part of the Angular application on Stackblitz; it is
// a server-side script that the front-end calls for data retrieval.

const express = require('express');
const cors = require('cors');
var request = require('request');

const app = express();
app.use(cors());

const chrMap = {  // Map of accession numbers to chromosome names
  'NC_000001.10': '1',
  'NC_000002.11': '2',
  'NC_000003.11': '3',
  'NC_000004.11': '4',
  'NC_000005.9': '5',
  'NC_000006.11': '6',
  'NC_000007.13': '7',
  'NC_000008.10': '8',
  'NC_000009.11': '9',
  'NC_000010.10': '10',
  'NC_000011.9': '11',
  'NC_000012.11': '12',
  'NC_000013.10': '13',
  'NC_000014.8': '14',
  'NC_000015.9': '15',
  'NC_000016.9': '16',
  'NC_000017.10': '17',
  'NC_000018.9': '18',
  'NC_000019.9': '19',
  'NC_000020.10': '20',
  'NC_000021.8': '21',
  'NC_000022.10': '22',
  'NC_000023.10': 'X',
  'NC_000024.9': 'Y',
  'NC_012920.1': 'MT'
};

app.get('/:auth_code', (req, res) => {
  postData = {
    client_id: 'xxxxx',  // Hidden
    client_secret: 'xxxxx',  // Hidden
    code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk',
    grant_type: 'authorization_code',
    code: req.params.auth_code,
    redirect_uri: 'https://genomex.stackblitz.io/results/genetic/',
    scope: 'basic names report:all genomes phenotypes:read:all'
  };
  postData['grant_type'] = 'authorization_code';
  request({
    method: 'POST',
    uri: 'https://api.23andme.com/token/',
    form: postData,
    json: true
  }, function (error1, response1, body1) {
    if (!error1 && response1.statusCode === 200) {
      token = body1.access_token;
      request({
        method: 'GET',
        uri: 'https://api.23andme.com/3/account/',
        headers: {
          Authorization: 'Bearer ' + token
        },
        json: true
      }, function (error2, response2, body2) {
        if (!error2 && response2.statusCode === 200) {
          obj = {}
          obj.first_name = body2.data[0].first_name;
          obj.token = token;
          obj.profile_id = body2.data[0].profiles[0].id;
          res.send(obj);
        } else {
          res.status(404).send(body2);
        }
      });
    } else {
      res.status(404).send(body1);
    }
  });
});

app.get('/account/:token', (req, res) => {
  request({
    method: 'GET',
    uri: 'https://api.23andme.com/3/account/',
    headers: {
      Authorization: 'Bearer ' + req.params.token
    },
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      obj = {}
      obj.first_name = body.data[0].first_name;
      obj.token = req.params.token;
      obj.profile_id = body.data[0].profiles[0].id;
      res.send(obj);
    } else {
      res.status(404).send(body);
    }
  });
});

app.get('/snps/:token/:profile_id/:accession_id', (req, res) => {
  request({
    method: 'GET',
    uri: 'https://api.23andme.com/3/profile/' + req.params.profile_id + '/marker/?accession_id=' + req.params.accession_id,
    headers: {
      Authorization: 'Bearer ' + req.params.token
    },
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(body.data);
    } else {
      res.status(404).send(body);
    }
  });
});

app.get('/wellness/:token/:profile_id', (req, res) => {
  request({
    method: 'GET',
    uri: 'https://api.23andme.com/3/profile/' + req.params.profile_id + '/report/',
    headers: {
      Authorization: 'Bearer ' + req.params.token
    },
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      final = [];
      for (report of body.data) {
        obj = {};
        obj.id = report.report_id;
        obj.title = report.title;
        obj.report_type = report.report_type;
        if (report.report_type === 'genetic_weight') {
          obj.result = report.summary.outcome.text;
          obj.predictor_id = report.details.genetics_predictor.id;
          obj.bin_num = report.details.genetics_predictor.bin_number;
        } else {
          obj.result = report.summary.assessment.message;
          obj.genes = report.details.genes;
          obj.markers = [];
          for (marker of report.details.markers) {
            m = {}
            m.id = marker.id;
            m.label = marker.label;
            m.gene_description = marker.gene_description;
            m.explanation = marker.biological_explanation;
            m.chr = chrMap[marker.accession_id];
            m.known_mutations = marker.known_mutations;
            obj.markers.push(m);
          }
          obj.effect_allele_count = report.summary.effect_allele_count;
        }
        final.push(obj);
      }
      res.send(final);
    } else {
      res.status(404).send(body);
    }
  });
});

app.get('/gpri/:predictor_id/:bin_num', (req, res) => {
  request({
    method: 'GET',
    uri: 'https://api.23andme.com/3/genetic_phenotype_range_interaction/?predictor_id=' + req.params.predictor_id,
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      final = [];
      for (gpri of body.data) {
        obj = {}
        obj.id = gpri.id;
        obj.name = gpri.name;
        obj.max_diff_val = gpri.bins[req.params.bin_num].maximum_difference_value;
        obj.max_diff_exp = gpri.bins[req.params.bin_num].maximum_difference_explanation;
        final.push(obj);
      }
      final.sort(function(a, b) {  // Sort by descending order of max_diff_val
        return parseFloat(b.max_diff_val) - parseFloat(a.max_diff_val);
      });
      res.send(final);
    } else {
      res.status(404).send(body);
    }
  });
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
