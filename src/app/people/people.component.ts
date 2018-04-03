import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from '@firebase/util';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  user: any;
  itemRef: AngularFireObject<any>;
  item: Observable<any>;
  tableData: Array<any> = [];
  newRow: any = {};
  keys: Array<string> = ['id', 'firstName', 'lastName', 'city', 'email', 'drivingLicenceNumber', 'money', 'status'];
  newHuman: any = {
    id: 'ID', firstName: 'Firstname', lastName: 'Lastname', city: 'City', email: 'Email',
    drivingLicenceNumber: 'Driving Licence NO.', money: 'Money', status: 'Status'
  }
  lastKey: string = "";
  sorts: any = {};
  order: number = 1;
  currentData: any;

  constructor(private db: AngularFireDatabase) {
    this.db.object('uzemanyag').valueChanges().subscribe(value => console.log(value['people']));

    for (let k of this.keys) {

      this.sorts[k] = {};

    }
    this.itemRef = db.object('uzemanyag/people')

    this.itemRef.valueChanges().subscribe(values => {
      this.tableData = [];

      for (let k in values) {
        this.tableData.push({ key: k, adat: values[k] });

      }
      console.log(this.tableData);

    });

  }

  ngOnInit() {
  }

  sortTable(key): void {

    for (let k in this.sorts) {
      this.sorts[k] = "";
    }
    if (this.lastKey == key) {
      this.order *= -1;
    }
    else {
      this.order = 1;
    }
    this.lastKey = key;
    this.tableData.sort((a, b) => {
      return a.adat[key].toString().localeCompare(b.adat[key].toString()) * this.order;
    });
  }

  getHuman(key): void {
    return this.newHuman[key];
  }

  /**
   * 
   * @param row adatfrissítés
   */

  dataUpdate(row): void {
    this.db.object('uzemanyag/people/' + row.key).update(row.adat);
  }

  /**
   * adatsor törlése
   */

  dataDelete(key: string): void {
    this.db.object('uzemanyag/people/' + key).remove();
  }

  /**
   * 
   * új adatsor felvitele
   */

  dataAdd(record) {
    this.db.list('uzemanyag/people/').push(record).then(r => this.newRow = {});
  }

  /**
   * kártya feltöltése fixen 50000Ft-al.
   */
  creditUpload(key): void {
    this.db.object('uzemanyag/people/' + key).update({ money: 50000 });
  }

}