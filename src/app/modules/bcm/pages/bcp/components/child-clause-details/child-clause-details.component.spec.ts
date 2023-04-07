import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildClauseDetailsComponent } from './child-clause-details.component';

describe('ChildClauseDetailsComponent', () => {
  let component: ChildClauseDetailsComponent;
  let fixture: ComponentFixture<ChildClauseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildClauseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildClauseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
