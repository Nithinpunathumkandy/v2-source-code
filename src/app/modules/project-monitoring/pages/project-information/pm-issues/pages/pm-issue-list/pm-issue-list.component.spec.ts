import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmIssueListComponent } from './pm-issue-list.component';

describe('PmIssueListComponent', () => {
  let component: PmIssueListComponent;
  let fixture: ComponentFixture<PmIssueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmIssueListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmIssueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
