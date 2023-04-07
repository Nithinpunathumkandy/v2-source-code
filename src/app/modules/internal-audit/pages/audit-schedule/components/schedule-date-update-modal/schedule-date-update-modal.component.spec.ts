import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDateUpdateModalComponent } from './schedule-date-update-modal.component';

describe('ScheduleDateUpdateModalComponent', () => {
  let component: ScheduleDateUpdateModalComponent;
  let fixture: ComponentFixture<ScheduleDateUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleDateUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDateUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
