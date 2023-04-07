import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDetailsInfoComponent } from './master-details-info.component';

describe('MasterDetailsInfoComponent', () => {
  let component: MasterDetailsInfoComponent;
  let fixture: ComponentFixture<MasterDetailsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDetailsInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDetailsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
