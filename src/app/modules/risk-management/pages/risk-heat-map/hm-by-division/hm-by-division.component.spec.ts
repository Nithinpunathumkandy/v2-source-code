import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmByDivisionComponent } from './hm-by-division.component';

describe('HmByDivisionComponent', () => {
  let component: HmByDivisionComponent;
  let fixture: ComponentFixture<HmByDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HmByDivisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HmByDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
