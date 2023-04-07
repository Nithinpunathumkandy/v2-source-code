import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuelistMainComponent } from './issuelist-main.component';

describe('IssuelistMainComponent', () => {
  let component: IssuelistMainComponent;
  let fixture: ComponentFixture<IssuelistMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuelistMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuelistMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
