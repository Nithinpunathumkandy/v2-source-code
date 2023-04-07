import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingAddModalComponent } from './finding-add-modal.component';

describe('FindingAddModalComponent', () => {
  let component: FindingAddModalComponent;
  let fixture: ComponentFixture<FindingAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindingAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
