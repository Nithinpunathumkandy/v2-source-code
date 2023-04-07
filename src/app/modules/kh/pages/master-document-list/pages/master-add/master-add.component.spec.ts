import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAddComponent } from './master-add.component';

describe('MasterAddComponent', () => {
  let component: MasterAddComponent;
  let fixture: ComponentFixture<MasterAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
