import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalIssuesComponent } from './internal-issues.component';

describe('InternalIssuesComponent', () => {
  let component: InternalIssuesComponent;
  let fixture: ComponentFixture<InternalIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
