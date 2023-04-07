import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmBySourceComponent } from './hm-by-source.component';

describe('HmBySourceComponent', () => {
  let component: HmBySourceComponent;
  let fixture: ComponentFixture<HmBySourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HmBySourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HmBySourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
