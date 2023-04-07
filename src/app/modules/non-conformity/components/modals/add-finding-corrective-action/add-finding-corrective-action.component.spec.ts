import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFindingCorrectiveActionComponent } from './add-finding-corrective-action.component';

describe('AddFindingCorrectiveActionComponent', () => {
  let component: AddFindingCorrectiveActionComponent;
  let fixture: ComponentFixture<AddFindingCorrectiveActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFindingCorrectiveActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFindingCorrectiveActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
