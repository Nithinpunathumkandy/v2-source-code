import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiraRcaComponent } from './hira-rca.component';

describe('HiraRcaComponent', () => {
  let component: HiraRcaComponent;
  let fixture: ComponentFixture<HiraRcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiraRcaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiraRcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
