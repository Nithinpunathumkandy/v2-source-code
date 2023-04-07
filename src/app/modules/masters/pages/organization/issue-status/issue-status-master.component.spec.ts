import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueStatusMasterComponent } from './issue-status-master.component';

describe('IssueStatusMasterComponent', () => {
  let component: IssueStatusMasterComponent;
  let fixture: ComponentFixture<IssueStatusMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueStatusMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueStatusMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
