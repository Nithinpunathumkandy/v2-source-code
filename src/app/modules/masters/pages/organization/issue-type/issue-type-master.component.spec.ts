import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueTypeMasterComponent } from './issue-type-master.component';

describe('IssueTypeMasterComponent', () => {
  let component: IssueTypeMasterComponent;
  let fixture: ComponentFixture<IssueTypeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueTypeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
