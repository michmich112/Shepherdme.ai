import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl } from "@angular/forms";
import { FileValidators } from "ngx-file-drag-drop";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AbuseFlagger';
  url = "http://169.51.206.176:32451/model/predict";
  parsedjson = {}
  filetext;
  text;
  finalResult = "";
  isFileUploaded: boolean = false;
  file;
  fileControl = new FormControl(
    [],
    [FileValidators.required,
    FileValidators.maxFileCount(1)]
  );
  constructor(private http: HttpClient) { }



  ngOnInit() {
    this.fileControl.valueChanges.subscribe((files: File[]) => {
      this.file = this.fileControl.value;
      this.isFileUploaded = true;
      this.parseTextFile();
    }
    );
  }

   submitText(value) {
    console.log("captured value as ", value);
    this.parsedjson = this.convertTextToJSON(this.isFileUploaded ? this.filetext: this.text);
    console.log("json is", this.parsedjson);
    var response = this.getClassification();
    var resp = null;
    response.subscribe(res => {
      resp = res;
      console.log("post call response is ", resp);
      this.parseResult(resp);
      console.log("updated classification is , ", this.finalResult);
    })
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
        if (typeof value == "number")
          max = value;
        finalRes = key;
      }
    }
    if (max < 0.3) {
      this.finalResult = "Non Abusive content";
    } else {
      this.finalResult = (max * 100).toFixed(2) + "% " + finalRes
    }
  }

  parseTextFile() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
      this.filetext = fileReader.result;
    }
    fileReader.readAsText(this.file[0]);
  }

  onValueChange(file: File[]) {
    console.log("File changed!");
  }
}