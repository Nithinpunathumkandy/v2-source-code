import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmReportUpdateModalComponent } from './am-report-update-modal.component';

describe('AmReportUpdateModalComponent', () => {
  let component: AmReportUpdateModalComponent;
  let fixture: ComponentFixture<AmReportUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmReportUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmReportUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
