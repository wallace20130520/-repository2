import { Component, OnInit } from '@angular/core';
import {SingletonService} from '../../services/singleton.service';
@Component({
  selector: 'app-balance-statement',
  templateUrl: './balance-statement.component.html',
  styleUrls: ['./balance-statement.component.scss']
})
export class BalanceStatementComponent implements OnInit {

  constructor(public singletonServ:SingletonService) { }

  ngOnInit() {
    
  }

}
