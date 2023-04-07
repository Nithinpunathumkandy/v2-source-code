import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByAuditorComponent } from './by-auditor.component';

describe('ByAuditorComponent', () => {
  let component: ByAuditorComponent;
  let fixture: ComponentFixture<ByAuditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ByAuditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ByAuditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
