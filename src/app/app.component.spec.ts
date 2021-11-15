import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'AbuseFlagger'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('AbuseFlagger');
  });

  it("should transfer input text data", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const value = "string"; 
    const comp = fixture.componentInstance;
    const spy = spyOn(comp, "convertTextToJSON").and.callFake(()=>{return null;});
    comp.submitText(value);
    expect(spy).toHaveBeenCalled();
  });

  it("should convert text to json", () =>{
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const text = "SampleText"; 
    const resJson = {
      "text" : ["SampleText"]
    }
    const comp = fixture.componentInstance;
    var result = comp.convertTextToJSON(text);
    expect(result).toEqual(resJson);
  });

  it("should parse result to get final result as abusive or harrassing", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const res = {
      "status": "ok",
      "results": [
        {
          "original_text": "I would like to punch you.",
          "predictions": {
            "toxic": 0.9796434044837952,
            "severe_toxic": 0.97256634533405304,
            "obscene": 0.958431386947631836,
            "threat": 0.8635178804397583,
            "insult": 0.11121545732021332,
            "identity_hate": 0.913826466165482998
          }
        }
      ]
    }
    const comp = fixture.componentInstance;
    comp.parseResult(res);
    expect(comp.finalResult).toEqual("Non Abusive content")
  });

  it("should parse result to get final result an non abusive or harrassing", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const res = {
      "status": "ok",
      "results": [
        {
          "original_text": "I would like to punch you.",
          "predictions": {
            "toxic": 0,
            "severe_toxic": 0,
            "obscene": 0.0,
            "threat": 0,
            "insult": 0,
            "identity_hate": 0
          }
        }
      ]
    }
    const comp = fixture.componentInstance;
    comp.parseResult(res);
    expect(comp.finalResult).toEqual("Non Abusive content")
  });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('AbuseFlagger app is running!');
  // });
});
