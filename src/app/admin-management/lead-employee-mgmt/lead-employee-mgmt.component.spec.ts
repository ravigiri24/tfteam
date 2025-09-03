import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LeadEmployeeMgmtComponent } from './lead-employee-mgmt.component';

describe('LeadEmployeeMgmtComponent', () => {
  let component: LeadEmployeeMgmtComponent;
  let fixture: ComponentFixture<LeadEmployeeMgmtComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadEmployeeMgmtComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LeadEmployeeMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
