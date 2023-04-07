import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiraMappingComponent } from './hira-mapping.component';

describe('HiraMappingComponent', () => {
  let component: HiraMappingComponent;
  let fixture: ComponentFixture<HiraMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiraMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiraMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
