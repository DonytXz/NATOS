import { Component, OnInit, OnDestroy, Input,  EventEmitter, Output, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CartItem } from './cart.model';
import Swal from 'sweetalert2'
import { PedidoService } from '../servicios/pedido.service'
import {CartitemComponent} from './cartitem/cartitem.component'
import { LoginService } from '../servicios/login.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  pedidos;

  pedidoo={
    id: "",
    name: "",
    quantity: "",
    price: "",
    total: "",
    status: "",
    correo: ""
  }
  // vacio =true;
  total: number = 0;
  @Input() cartTotal: number;
  @Input() cartItem: CartItem;
  @Input() cartItems: CartItem[];
  @Output() cartItemDeleted = new EventEmitter<{
    productId: number
  }>();
  @Output() cartItemChanged = new EventEmitter<{
    productId: number
  }>();  
  entrar: any;

  onCartItemDeleted(productData:{productId: number}) {
    this.cartItemDeleted.emit({
        productId: productData.productId
      });    

  }

  onCartItemChanged(productData:{productId: number}) {
    this.cartItemChanged.emit({
        productId: productData.productId
      });    
  }

  print(){
    // window.print();
    var printContents = document.getElementById('printDiv').innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    location.reload();
  }

  consultarPedido(){
    this.pedidos=this.pedidoServicio.consultarTodoPedido();
}

  
  constructor(public itemCarro : CartitemComponent, private pedidoServicio:PedidoService, private loginservicio:LoginService) {
    // this.vacio = this.itemCarro.vacio;
    // if(this.vacio) this.vacio =false
    

  } 
 
  ngOnInit() {
    this.loginservicio.change.subscribe(isOpen =>{
      this.entrar = isOpen;
    })
    this.llenarentrar();
    this.consultarPedido();

  }
  llenarentrar(){
    this.entrar=this.loginservicio.eslogueado();

  }

}
