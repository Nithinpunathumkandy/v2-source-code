import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCorrectiveActionComponent } from './add-corrective-action.component';

describe('AddCorrectiveActionComponent', () => {
  let component: AddCorrectiveActionComponent;
  let fixture: ComponentFixture<AddCorrectiveActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCorrectiveActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCorrectiveActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
