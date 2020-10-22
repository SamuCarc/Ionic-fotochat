import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Room, Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { RoomMessagesComponent } from '../room-messages/room-messages.component';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit {

  @Input() rooms: Room[] = [];
  actualUser:Usuario = {};

  constructor(  private usuarioService:UsuarioService,
                private modalCtr:ModalController ) { }

  ngOnInit() {
    this.actualUser = this.usuarioService.getUsuario();
  }

  async verChat(room:Room) {
    const modal = await this.modalCtr.create({
      component: RoomMessagesComponent,
      componentProps: {
        id:room._id,
        idUsuario: this.actualUser._id
      }
    });
    modal.present();

  }

}
