import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVitalRecordsComponent } from './add-vital-records.component';

describe('AddVitalRecordsComponent', () => {
  let component: AddVitalRecordsComponent;
  let fixture: ComponentFixture<AddVitalRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVitalRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVitalRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
