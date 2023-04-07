import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiraComponent } from './hira.component';

describe('HiraComponent', () => {
  let component: HiraComponent;
  let fixture: ComponentFixture<HiraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
