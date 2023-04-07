import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCriteriaModalComponent } from './add-criteria-modal.component';

describe('AddCriteriaModalComponent', () => {
  let component: AddCriteriaModalComponent;
  let fixture: ComponentFixture<AddCriteriaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCriteriaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCriteriaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
