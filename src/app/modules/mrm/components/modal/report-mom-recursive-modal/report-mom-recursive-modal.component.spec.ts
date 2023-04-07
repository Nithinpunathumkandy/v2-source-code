import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMomRecursiveModalComponent } from './report-mom-recursive-modal.component';

describe('ReportMomRecursiveModalComponent', () => {
  let component: ReportMomRecursiveModalComponent;
  let fixture: ComponentFixture<ReportMomRecursiveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportMomRecursiveModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMomRecursiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
