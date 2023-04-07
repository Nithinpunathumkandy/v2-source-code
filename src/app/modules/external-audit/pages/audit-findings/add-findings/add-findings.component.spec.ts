import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFindingsComponent } from './add-findings.component';

describe('AddFindingsComponent', () => {
  let component: AddFindingsComponent;
  let fixture: ComponentFixture<AddFindingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFindingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFindingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
