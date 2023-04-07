import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateUpdateModalComponent } from './date-update-modal.component';

describe('DateUpdateModalComponent', () => {
  let component: DateUpdateModalComponent;
  let fixture: ComponentFixture<DateUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
