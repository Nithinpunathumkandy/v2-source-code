import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDateAndTimeComponent } from './add-date-and-time.component';

describe('AddDateAndTimeComponent', () => {
  let component: AddDateAndTimeComponent;
  let fixture: ComponentFixture<AddDateAndTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDateAndTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDateAndTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
