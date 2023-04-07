import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveAddModalComponent } from './objective-add-modal.component';

describe('ObjectiveAddModalComponent', () => {
  let component: ObjectiveAddModalComponent;
  let fixture: ComponentFixture<ObjectiveAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectiveAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
