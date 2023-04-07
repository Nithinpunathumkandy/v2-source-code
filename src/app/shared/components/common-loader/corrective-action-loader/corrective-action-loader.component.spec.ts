import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectiveActionLoaderComponent } from './corrective-action-loader.component';

describe('CorrectiveActionLoaderComponent', () => {
  let component: CorrectiveActionLoaderComponent;
  let fixture: ComponentFixture<CorrectiveActionLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectiveActionLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectiveActionLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
