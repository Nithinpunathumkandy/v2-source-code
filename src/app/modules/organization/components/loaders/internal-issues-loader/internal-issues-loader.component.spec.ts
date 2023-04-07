import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalIssuesLoaderComponent } from './internal-issues-loader.component';

describe('InternalIssuesLoaderComponent', () => {
  let component: InternalIssuesLoaderComponent;
  let fixture: ComponentFixture<InternalIssuesLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalIssuesLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalIssuesLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
