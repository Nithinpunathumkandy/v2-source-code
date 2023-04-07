import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectivesLoaderComponent } from './objectives-loader.component';

describe('ObjectivesLoaderComponent', () => {
  let component: ObjectivesLoaderComponent;
  let fixture: ComponentFixture<ObjectivesLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectivesLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectivesLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
