import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { CommonMethodService } from 'src/app/common-method.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-outward-transport',
  templateUrl: './outward-transport.component.html',
  styleUrl: './outward-transport.component.scss'
})
export class OutwardTransportComponent implements OnInit {
  @Input() tractorDetails: any;
  @Input() record: any;
  @Input() readOnly = false;
  @Input() canChangeReached = true;
  @Input() listColorClass: any = 'sixColor';
  form: FormGroup;
  saving = false;
  wareHouseLocationList: any[] = [];
  private allotment?: { warehouse: unknown; date: string; historySaved: boolean };

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private share: ShareService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private commonMethod:CommonMethodService
  ) {}

  close() {
    return this.modalCtrl.dismiss(undefined, 'cancel');
  }

  ngOnInit() {
    const details = this.record;
    this.initialize(details ? {
      ...details,
      transport_start_date: String(details.transport_start_date ?? '').slice(0, 10),
      expectedReachDate: String(details.expectedReachDate ?? '').slice(0, 10),
      reachDate: String(details.reachDate ?? '').slice(0, 10),
    } : details);
    this.getWareHouseLocationList();
  }

  sameWarehouse(first: unknown, second: unknown) {
    return String(first) === String(second);
  }

  get destinationWarehouse() {
    const id = this.form.get('transportDestinationId')?.value;
    return this.wareHouseLocationList.find(warehouse => String(warehouse.id) === String(id))?.name ?? id;
  }

  get canEditDestination() {
    return !this.readOnly && this.record?.isReached != 1;
  }

  get canEditReached() {
    return this.canEditDestination && this.canChangeReached;
  }

  get reachedLabel() {
    const reached = this.form.get('isReached')?.value;
    return reached == null ? '' : reached ? 'Yes' : 'No';
  }

  initialize(data: any = null) {
    this.form = this.fb.group({
      transport_start_date: new FormControl(data?.transport_start_date || null, [Validators.required]),
      transport_src_place: new FormControl(data?.transport_src_place || null, [Validators.required]),
      reachDate: new FormControl(data?.reachDate || null),
      remark: new FormControl(data?.remark ?? null),
      expectedReachDate: new FormControl(data?.expectedReachDate || null),
      transportDestinationId: new FormControl({
        value: data?.transportDestinationId ?? null,
        disabled: !this.canEditDestination,
      }),
      isReached: new FormControl(
        { value: data?.isReached == 1, disabled: !this.canEditReached },
        { nonNullable: true },
      ),
    });
  }

  async save() {
    this.commonMethod.reloadMethod=true
    if (this.readOnly || this.saving) return;

    const data = this.form.getRawValue();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.share.presentToast('Enter the Transport Start Date and Transport Source Place.');
      return;
    }

    if (data.isReached === true && !data.reachDate) {
      this.form.get('reachDate')?.markAsTouched();
      this.share.presentToast('Enter the Reach Date when Is Reached is Yes.');
      return;
    }

    const tractorId = this.tractorDetails?.id;
    if (this.record ? this.record.id == null : tractorId == null) {
      this.share.presentToast('Unable to save outward transport because its record or tractor ID is missing.');
      return;
    }

    if (this.canEditReached) {
      data.isReached = data.isReached ?? false;
    } else {
      delete data.isReached;
    }
    if (!this.canEditDestination) delete data.transportDestinationId;

    this.saving = true;
    try {
      if (data.isReached === true) {
        const alert = await this.alertCtrl.create({
          header: 'Allot Store?',
          message: 'Do you want to allot the destination warehouse to this tractor?',
          buttons: [
            { text: 'No', role: 'skip' },
            { text: 'Yes', role: 'allot' },
          ],
        });
        await alert.present();
        const { role } = await alert.onDidDismiss();
        if (role !== 'skip' && role !== 'allot') return;
        if (role === 'allot') {
          if (!data.transportDestinationId || !data.reachDate) {
            this.form.get('transportDestinationId')?.markAsTouched();
            this.form.get('reachDate')?.markAsTouched();
            this.share.presentToast('Select a Destination Warehouse and enter the Reach Date to allot the store.');
            return;
          }
          await this.updateWarehouseAllotement(data.transportDestinationId, data.reachDate);
        }
      }

      const src = 'transport_history';
      const res: any = await firstValueFrom(this.record
        ? this.api.postapi('updateOpp', { src, id: this.record.id, data })
        : this.api.postapi('addOpp', { src, data: { ...data, tractor_id: tractorId } }));
      if (!res?.status) {
        this.share.presentToast(res?.msg || 'Unable to save outward transport. Please try again.');
        return;
      }
      this.share.presentToast('Outward transport saved.');
      await this.modalCtrl.dismiss(res.data ?? true, 'confirm');
    } catch (error) {
      this.share.presentToast(error instanceof Error ? error.message : 'Unable to save outward transport. Please try again.');
    } finally {
      this.saving = false;
    }
  }

  getWareHouseLocationList() {
    const obj = this.share.getListObj('warehouselocation', false, [], true);
    this.api.postapi('getList', obj).subscribe({
      next: (res: any) => {
        this.wareHouseLocationList = res?.data || [];
      },
      error: () => {
        this.share.presentToast('Unable to load warehouse locations. Please try again.');
      },
    });
  }
  private async updateWarehouseAllotement(warehouse: unknown, date: string) {
    const tractorId = this.tractorDetails?.id;
    const adminId = this.tractorDetails?.tractordetailadmin?.id;
    if (tractorId == null || adminId == null) {
      throw new Error('Unable to allot the store because the tractor or admin record is missing.');
    }

    if (this.allotment?.warehouse !== warehouse || this.allotment?.date !== date) {
      const result: any = await firstValueFrom(this.api.postapi('updateOpp', {
        src: 'tractordetailadmin',
        id: adminId,
        data: { wareHouseLocation: warehouse, assign_date: date },
      }));
      if (!result?.status) throw new Error(result?.msg || 'Unable to allot the store.');
      this.allotment = { warehouse, date, historySaved: false };
    }

    if (!this.allotment.historySaved) {
      const result: any = await firstValueFrom(this.api.postapi('addOpp', {
        src: 'tractor_assiging_history',
        data: { store_id: warehouse, tractor_id: tractorId, assign_date: date },
      }));
      if (!result?.status) throw new Error(result?.msg || 'Store allotted, but its assignment history could not be saved.');
      this.allotment.historySaved = true;
    }
  }
}
