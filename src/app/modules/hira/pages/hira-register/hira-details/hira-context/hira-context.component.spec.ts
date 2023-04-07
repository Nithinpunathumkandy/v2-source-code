import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiraContextComponent } from './hira-context.component';

describe('HiraContextComponent', () => {
  let component: HiraContextComponent;
  let fixture: ComponentFixture<HiraContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiraContextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiraContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
