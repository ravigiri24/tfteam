import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewMaintainanceCostComponent } from './view-maintainance-cost.component';

describe('ViewMaintainanceCostComponent', () => {
  let component: ViewMaintainanceCostComponent;
  let fixture: ComponentFixture<ViewMaintainanceCostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMaintainanceCostComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMaintainanceCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
