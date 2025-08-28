import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerListDistrictWiseComponent } from './customer-list-district-wise.component';

describe('CustomerListDistrictWiseComponent', () => {
  let component: CustomerListDistrictWiseComponent;
  let fixture: ComponentFixture<CustomerListDistrictWiseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerListDistrictWiseComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerListDistrictWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
