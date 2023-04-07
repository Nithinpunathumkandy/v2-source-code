import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmIssuesComponent } from './pm-issues.component';

describe('PmIssuesComponent', () => {
  let component: PmIssuesComponent;
  let fixture: ComponentFixture<PmIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmIssuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
