import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhCountTypeComponent } from './kh-count-type.component';

describe('KhCountTypeComponent', () => {
  let component: KhCountTypeComponent;
  let fixture: ComponentFixture<KhCountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhCountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhCountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
