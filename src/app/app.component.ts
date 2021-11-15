import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AbuseFlagger';
  url = "https://heroku-deployment-shepherme.herokuapp.com/api";
  parsedjson = {}
  text;
  finalResult = "";
  constructor(private http: HttpClient) { }



  ngOnInit() {
    console.log("Initiated");
  }

   submitText(value) {
    console.log("captured value as ", value);
    if (value === "string") {
      this.parsedjson = this.convertTextToJSON(this.text);
      console.log("json is", this.parsedjson);
      var response = this.getClassification();
      var resp = null;
      response.subscribe(res=>{
        resp = res;
        console.log("post call response is ", resp);
      })
    } else if (value === "file") {
      this.parseTextFile(value);
    }
  }

  convertTextToJSON(text) {
    var json = {};
    json["text"] = [text];
    return json;
  }

  getClassification() {
    var response;
    return this.http.post(this.url, this.parsedjson)
    // .map(res => res.json())
    
    // .subscribe(res => {
    //   response = res;
    // })
    // return response;
  }

  // getSelectOptionValue(): any {
  //   let area_list_url = '/select_option_list/';

  //   return this.urlGet(area_list_url).map( /// <<<=== use `map` here
  //     (response) => {
  //       let data = response.text() ? response.json() : [{}];

  //       if (data) {
  //         Constant.areaList = data;
  //       }

  //       return JSON.stringify(Constant.areaList);
  //     }
  //   );
  // }

  parseResult(res) {
    var finalRes = "";
    var pred = res['results'][0]
    var max = 0;
    for (let [key, value] of Object.entries(pred)) {
      if (value > max && value > 0.3) {
        max = parseInt(value.toString());
        finalRes = key;
      }
    }
    if (max < 0.3) {
      this.finalResult = "Non Abusive content";
    } else {
      this.finalResult = (max * 100).toFixed(2) + "%" + " Abusive content"
    }
  }

  parseTextFile(file) {
    console.log("parsed file", file)
  }
}