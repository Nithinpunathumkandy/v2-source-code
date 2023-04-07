import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectiveActionInfoLoaderComponent } from './corrective-action-info-loader.component';

describe('CorrectiveActionInfoLoaderComponent', () => {
  let component: CorrectiveActionInfoLoaderComponent;
  let fixture: ComponentFixture<CorrectiveActionInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectiveActionInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectiveActionInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
