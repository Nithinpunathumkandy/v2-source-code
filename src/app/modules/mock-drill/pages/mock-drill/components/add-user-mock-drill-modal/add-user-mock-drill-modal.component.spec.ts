import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserMockDrillModalComponent } from './add-user-mock-drill-modal.component';

describe('AddUserMockDrillModalComponent', () => {
  let component: AddUserMockDrillModalComponent;
  let fixture: ComponentFixture<AddUserMockDrillModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserMockDrillModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserMockDrillModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
