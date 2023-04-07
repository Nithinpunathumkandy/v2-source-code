import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicityModalComponent } from './periodicity-modal.component';

describe('PeriodicityModalComponent', () => {
  let component: PeriodicityModalComponent;
  let fixture: ComponentFixture<PeriodicityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodicityModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodicityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
