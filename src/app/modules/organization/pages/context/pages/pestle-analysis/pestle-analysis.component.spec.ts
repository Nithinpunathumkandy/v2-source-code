import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PestleAnalysisComponent } from './pestle-analysis.component';

describe('PestleAnalysisComponent', () => {
  let component: PestleAnalysisComponent;
  let fixture: ComponentFixture<PestleAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PestleAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PestleAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
