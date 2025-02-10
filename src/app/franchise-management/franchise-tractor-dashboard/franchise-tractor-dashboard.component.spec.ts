import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FranchiseTractorDashboardComponent } from './franchise-tractor-dashboard.component';

describe('FranchiseTractorDashboardComponent', () => {
  let component: FranchiseTractorDashboardComponent;
  let fixture: ComponentFixture<FranchiseTractorDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FranchiseTractorDashboardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FranchiseTractorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
