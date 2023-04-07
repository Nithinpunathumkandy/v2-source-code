import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorUserBoxComponent } from './auditor-user-box.component';

describe('AuditorUserBoxComponent', () => {
  let component: AuditorUserBoxComponent;
  let fixture: ComponentFixture<AuditorUserBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditorUserBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditorUserBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
