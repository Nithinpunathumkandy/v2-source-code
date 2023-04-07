import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalCountTypeComponent } from './external-count-type.component';

describe('ExternalCountTypeComponent', () => {
  let component: ExternalCountTypeComponent;
  let fixture: ComponentFixture<ExternalCountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalCountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalCountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
