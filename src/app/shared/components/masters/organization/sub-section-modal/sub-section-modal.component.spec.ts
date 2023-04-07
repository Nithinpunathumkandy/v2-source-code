import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSectionModalComponent } from './sub-section-modal.component';

describe('SubSectionModalComponent', () => {
  let component: SubSectionModalComponent;
  let fixture: ComponentFixture<SubSectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubSectionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubSectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
