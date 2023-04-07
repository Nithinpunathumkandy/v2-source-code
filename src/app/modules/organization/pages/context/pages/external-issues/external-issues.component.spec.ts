import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalIssuesComponent } from './external-issues.component';

describe('ExternalIssuesComponent', () => {
  let component: ExternalIssuesComponent;
  let fixture: ComponentFixture<ExternalIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
