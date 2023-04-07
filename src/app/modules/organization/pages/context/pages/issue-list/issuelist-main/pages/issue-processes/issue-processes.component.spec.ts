import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueProcessesComponent } from './issue-processes.component';

describe('IssueProcessesComponent', () => {
  let component: IssueProcessesComponent;
  let fixture: ComponentFixture<IssueProcessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueProcessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueProcessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
