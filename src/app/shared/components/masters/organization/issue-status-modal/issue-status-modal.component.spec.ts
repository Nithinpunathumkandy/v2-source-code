import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueStatusModalComponent } from './issue-status-modal.component';

describe('IssueStatusModalComponent', () => {
  let component: IssueStatusModalComponent;
  let fixture: ComponentFixture<IssueStatusModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueStatusModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
