import { Component, OnInit, OnDestroy, Input,  EventEmitter, Output, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CartItem } from './cart.model';
import Swal from 'sweetalert2'
import { PedidoService } from '../servicios/pedido.service'
import {CartitemComponent} from './cartitem/cartitem.component'

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
  // async pedido(){
  //   const { value: email } = await Swal.fire({
  //     title: 'Input email address',
  //     input: 'email',
  //     inputPlaceholder: 'Enter your email address'
  //   })
    
  //   if (email) {
  //     Swal.fire(`Entered email: ${email}`)
  //     // this.cartItem.guardarPedido();
  //     // console.log(email)
  //     this.guardarPedido()
  //   }
  // }
    //metodo guardar empleado
    
    // guardarPedido(){
      // const { value: email } = await Swal.fire({
      //   title: 'Input email address',
      //   input: 'email',
      //   inputPlaceholder: 'Enter your email address'
      // })
      
      // if (email) {
      //   Swal.fire(`Entered email: ${email}`)
      // }  
  //     this.pedidoServicio.insertarPedido(this.itemCarro.cartItem)
  //     .subscribe(res=>{
  //       alert("El pedido ha sido registrado con éxito")
  //       this.limpiarPedido()
  //       this.consultarPedido()
  //     },
  //     err=> console.log(err))
  //   }
  //     // metodo consultar
  
  //     consultarPedido(){
  //     this.pedidos=this.pedidoServicio.consultarTodoPedido();
  // }
  //   limpiarPedido(){
  //     //esto para que se limpien los campos
  //     this.pedidoo.id=""
  //     this.pedidoo.name=""
  //     this.pedidoo.quantity=""
  //     this.pedidoo.price=""
  //     this.pedidoo.total=""
  //     this.pedidoo.status=""
  //     this.pedidoo.correo=""
  //   }

  

  
  constructor(public itemCarro : CartitemComponent) {

    

  } 
 
  ngOnInit() {
    // console.log(this.cartItemC.cartItem)
    // this.consultarPedido()
    // // console.log(this.pedidoo)
    // // this.cartItems.forEach( (valorActual, indice, arr) =>{
    // //   console.log(valorActual, indice);
    // // });
    // console.log(this.itemCarro.cartItem)

  }
  

}
