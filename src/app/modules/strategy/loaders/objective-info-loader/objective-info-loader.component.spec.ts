import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveInfoLoaderComponent } from './objective-info-loader.component';

describe('ObjectiveInfoLoaderComponent', () => {
  let component: ObjectiveInfoLoaderComponent;
  let fixture: ComponentFixture<ObjectiveInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectiveInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
