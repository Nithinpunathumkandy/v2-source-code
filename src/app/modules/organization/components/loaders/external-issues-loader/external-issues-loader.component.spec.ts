import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalIssuesLoaderComponent } from './external-issues-loader.component';

describe('ExternalIssuesLoaderComponent', () => {
  let component: ExternalIssuesLoaderComponent;
  let fixture: ComponentFixture<ExternalIssuesLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalIssuesLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalIssuesLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
