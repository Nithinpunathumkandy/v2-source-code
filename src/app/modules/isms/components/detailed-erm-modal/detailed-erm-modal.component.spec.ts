import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedErmModalComponent } from './detailed-erm-modal.component';

describe('DetailedErmModalComponent', () => {
  let component: DetailedErmModalComponent;
  let fixture: ComponentFixture<DetailedErmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedErmModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedErmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
