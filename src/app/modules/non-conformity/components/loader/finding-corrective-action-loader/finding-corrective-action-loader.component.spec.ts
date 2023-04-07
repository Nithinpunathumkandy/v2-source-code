import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingCorrectiveActionLoaderComponent } from './finding-corrective-action-loader.component';

describe('FindingCorrectiveActionLoaderComponent', () => {
  let component: FindingCorrectiveActionLoaderComponent;
  let fixture: ComponentFixture<FindingCorrectiveActionLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindingCorrectiveActionLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingCorrectiveActionLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
