import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AclSettingComponent } from './acl-setting.component';

describe('AclSettingComponent', () => {
  let component: AclSettingComponent;
  let fixture: ComponentFixture<AclSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AclSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AclSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
