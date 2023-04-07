import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStakeholderNeedsExpectationsComponent } from './add-stakeholder-needs-expectations.component';

describe('AddStakeholderNeedsExpectationsComponent', () => {
  let component: AddStakeholderNeedsExpectationsComponent;
  let fixture: ComponentFixture<AddStakeholderNeedsExpectationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStakeholderNeedsExpectationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStakeholderNeedsExpectationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
