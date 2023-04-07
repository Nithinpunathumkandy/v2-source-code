import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwotAnalysisComponent } from './swot-analysis.component';

describe('SwotAnalysisComponent', () => {
  let component: SwotAnalysisComponent;
  let fixture: ComponentFixture<SwotAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwotAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwotAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
