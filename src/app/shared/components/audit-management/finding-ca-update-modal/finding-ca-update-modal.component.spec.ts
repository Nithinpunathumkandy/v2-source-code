import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingCaUpdateModalComponent } from './finding-ca-update-modal.component';

describe('FindingCaUpdateModalComponent', () => {
  let component: FindingCaUpdateModalComponent;
  let fixture: ComponentFixture<FindingCaUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindingCaUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingCaUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
