import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueActivityLogComponent } from './issue-activity-log.component';

describe('IssueActivityLogComponent', () => {
  let component: IssueActivityLogComponent;
  let fixture: ComponentFixture<IssueActivityLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueActivityLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
