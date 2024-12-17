import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MaintainanceManagementComponent } from './maintainance-management.component';

describe('MaintainanceManagementComponent', () => {
  let component: MaintainanceManagementComponent;
  let fixture: ComponentFixture<MaintainanceManagementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainanceManagementComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaintainanceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
