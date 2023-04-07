import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessAccessibilityModalComponent } from './process-accessibility-modal.component';

describe('ProcessAccessibilityModalComponent', () => {
  let component: ProcessAccessibilityModalComponent;
  let fixture: ComponentFixture<ProcessAccessibilityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessAccessibilityModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessAccessibilityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
