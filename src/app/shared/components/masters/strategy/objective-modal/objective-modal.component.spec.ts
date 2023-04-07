import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveModalComponent } from './objective-modal.component';

describe('ObjectiveModalComponent', () => {
  let component: ObjectiveModalComponent;
  let fixture: ComponentFixture<ObjectiveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectiveModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
