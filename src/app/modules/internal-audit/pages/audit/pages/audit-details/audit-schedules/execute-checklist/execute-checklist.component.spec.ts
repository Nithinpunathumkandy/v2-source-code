import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuteChecklistComponent } from './execute-checklist.component';

describe('ExecuteChecklistComponent', () => {
  let component: ExecuteChecklistComponent;
  let fixture: ComponentFixture<ExecuteChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecuteChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecuteChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
