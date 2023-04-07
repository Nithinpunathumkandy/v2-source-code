import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationLevelModalComponent } from './designation-level-modal.component';

describe('DesignationLevelModalComponent', () => {
  let component: DesignationLevelModalComponent;
  let fixture: ComponentFixture<DesignationLevelModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignationLevelModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationLevelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
