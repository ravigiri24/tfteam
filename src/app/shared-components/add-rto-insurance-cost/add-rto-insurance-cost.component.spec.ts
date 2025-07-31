import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddRtoInsuranceCostComponent } from './add-rto-insurance-cost.component';

describe('AddRtoInsuranceCostComponent', () => {
  let component: AddRtoInsuranceCostComponent;
  let fixture: ComponentFixture<AddRtoInsuranceCostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRtoInsuranceCostComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRtoInsuranceCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
