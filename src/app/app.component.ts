import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AbuseFlagger';
  url = "http://localhost:4200/api";
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
        this.parseResult(resp);
        console.log("updated classification is , ", this.finalResult);
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
    return this.http.post(this.url, this.parsedjson)
  }

 
  parseResult(res) {
    var finalRes = "";
    var pred = res['results'][0]['predictions']
    var max = 0;
    for (let [key, value] of Object.entries(pred)) {
      if (value > max && value > 0.3) {
        if(typeof value == "number")
        max = value;
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