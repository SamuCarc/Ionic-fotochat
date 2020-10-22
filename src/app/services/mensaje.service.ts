import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UsuarioService } from './usuario.service';
import { RespuestaMensaje } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  
  paginaMensaje = 0;
  
  constructor(  private http:HttpClient,
                private usuarioService:UsuarioService ) {}

  getMessageRooms( roomID:string ) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });

    this.paginaMensaje ++;
    return this.http.post<RespuestaMensaje>(`${ URL }/message/`, {roomID:roomID,pagina:this.paginaMensaje},{headers});
  }

}
