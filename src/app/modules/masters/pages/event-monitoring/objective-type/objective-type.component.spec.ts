import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveTypeComponent } from './objective-type.component';

describe('ObjectiveTypeComponent', () => {
  let component: ObjectiveTypeComponent;
  let fixture: ComponentFixture<ObjectiveTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectiveTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
