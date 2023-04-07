import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectiveActionsListComponent } from './corrective-actions-list.component';

describe('CorrectiveActionsListComponent', () => {
  let component: CorrectiveActionsListComponent;
  let fixture: ComponentFixture<CorrectiveActionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectiveActionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectiveActionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
