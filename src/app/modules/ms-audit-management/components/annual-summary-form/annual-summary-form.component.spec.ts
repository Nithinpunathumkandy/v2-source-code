import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualSummaryFormComponent } from './annual-summary-form.component';

describe('AnnualSummaryFormComponent', () => {
  let component: AnnualSummaryFormComponent;
  let fixture: ComponentFixture<AnnualSummaryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualSummaryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualSummaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
