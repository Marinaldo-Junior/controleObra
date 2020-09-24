import { Equipment } from './../../interfaces/equipment';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EquipmentService } from '../../services/equipment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.page.html',
  styleUrls: ['./equipment-list.page.scss'],
})
export class EquipmentListPage implements OnInit {
  equipmentCollection: Equipment[];
  equipmentLoadedCollection: Equipment[];

  private equipmentSubscription: Subscription;
  private textSearch = '';

  constructor(
    private router: Router,
    private service: EquipmentService,

  ) { }

  ngOnInit() { 
    this.loadEquipmanet();
   }

   ngOnDestroy(): void {
     this.equipmentSubscription.unsubscribe();
   }

   loadEquipmanet() {
     this.equipmentSubscription =  this.service.getAll().subscribe(data => {
      this.equipmentCollection = data;
      this.equipmentLoadedCollection  = data;
    });
  }
 
  updateEquipment(equipment: Equipment) {
    this.router.navigate(['/equipment', equipment]);
  }

  saveEquipment(equipment: Equipment) {
    console.table(equipment)
  }

  addEquipment(){
    this.router.navigate(['/equipment'])
  }

  deleteEquipment(equipment: Equipment) {
  }

  search(event){
    console.log('equipment find: ',event.target.value);
    this.initializeEquipment();
    this.textSearch = event.target.value;
    if (!this.textSearch){ return }

    this.equipmentCollection = this.service.searchEquipment(this.equipmentCollection, this.textSearch);
  }

  initializeEquipment() {
    this.equipmentCollection = this.equipmentLoadedCollection;
  }
}
