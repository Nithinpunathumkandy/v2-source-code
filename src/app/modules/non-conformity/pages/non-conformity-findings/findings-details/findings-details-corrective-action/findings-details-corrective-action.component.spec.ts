import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsDetailsCorrectiveActionComponent } from './findings-details-corrective-action.component';

describe('FindingsDetailsCorrectiveActionComponent', () => {
  let component: FindingsDetailsCorrectiveActionComponent;
  let fixture: ComponentFixture<FindingsDetailsCorrectiveActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindingsDetailsCorrectiveActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingsDetailsCorrectiveActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
