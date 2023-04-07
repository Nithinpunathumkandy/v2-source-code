import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveTypeModalComponent } from './objective-type-modal.component';

describe('ObjectiveTypeModalComponent', () => {
  let component: ObjectiveTypeModalComponent;
  let fixture: ComponentFixture<ObjectiveTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectiveTypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
