import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaAddModalComponent } from './criteria-add-modal.component';

describe('CriteriaAddModalComponent', () => {
  let component: CriteriaAddModalComponent;
  let fixture: ComponentFixture<CriteriaAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriteriaAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriteriaAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
