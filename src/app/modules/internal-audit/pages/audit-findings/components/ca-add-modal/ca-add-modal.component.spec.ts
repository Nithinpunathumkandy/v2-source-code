import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaAddModalComponent } from './ca-add-modal.component';

describe('CaAddModalComponent', () => {
  let component: CaAddModalComponent;
  let fixture: ComponentFixture<CaAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
