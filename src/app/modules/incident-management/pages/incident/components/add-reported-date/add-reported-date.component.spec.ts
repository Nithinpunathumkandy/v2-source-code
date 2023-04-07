import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReportedDateComponent } from './add-reported-date.component';

describe('AddReportedDateComponent', () => {
  let component: AddReportedDateComponent;
  let fixture: ComponentFixture<AddReportedDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReportedDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReportedDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
