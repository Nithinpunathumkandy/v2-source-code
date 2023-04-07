import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessActivityDetailsModalComponent } from './process-activity-details-modal.component';

describe('ProcessActivityDetailsModalComponent', () => {
  let component: ProcessActivityDetailsModalComponent;
  let fixture: ComponentFixture<ProcessActivityDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessActivityDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessActivityDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
