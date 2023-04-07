import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessAccessibilityComponent } from './process-accessibility.component';

describe('ProcessAccessibilityComponent', () => {
  let component: ProcessAccessibilityComponent;
  let fixture: ComponentFixture<ProcessAccessibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessAccessibilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessAccessibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
