import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationZoneModalComponent } from './designation-zone-modal.component';

describe('DesignationZoneModalComponent', () => {
  let component: DesignationZoneModalComponent;
  let fixture: ComponentFixture<DesignationZoneModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignationZoneModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationZoneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
