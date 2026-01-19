import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectSalesHeadCloneStaffComponent } from './select-sales-head-clone-staff.component';

describe('SelectSalesHeadCloneStaffComponent', () => {
  let component: SelectSalesHeadCloneStaffComponent;
  let fixture: ComponentFixture<SelectSalesHeadCloneStaffComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectSalesHeadCloneStaffComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectSalesHeadCloneStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
