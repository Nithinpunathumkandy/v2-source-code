import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsImpactAnalysisComponent } from './isms-impact-analysis.component';

describe('IsmsImpactAnalysisComponent', () => {
  let component: IsmsImpactAnalysisComponent;
  let fixture: ComponentFixture<IsmsImpactAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsImpactAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsImpactAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
