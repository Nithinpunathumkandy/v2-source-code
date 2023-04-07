import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveTargetBreakdownLoaderComponent } from './objective-target-breakdown-loader.component';

describe('ObjectiveTargetBreakdownLoaderComponent', () => {
  let component: ObjectiveTargetBreakdownLoaderComponent;
  let fixture: ComponentFixture<ObjectiveTargetBreakdownLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectiveTargetBreakdownLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveTargetBreakdownLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
