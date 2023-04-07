import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildClauseComponent } from './child-clause.component';

describe('ChildClauseComponent', () => {
  let component: ChildClauseComponent;
  let fixture: ComponentFixture<ChildClauseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildClauseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildClauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
