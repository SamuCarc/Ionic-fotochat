import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RespuestaPosts, Post, ResponseSubida } from '../interfaces/interfaces';
import { UsuarioService } from './usuario.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';


const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  paginaPosts = 0;

  nuevoPost = new EventEmitter<Post>();

  constructor( private http:HttpClient,
                private usuarioService:UsuarioService,
                private fileTransfer:FileTransfer ) { }

  getPosts( pull:boolean = false ) {

    if ( pull ) {
      this.paginaPosts = 0;
    }

    this.paginaPosts ++;
    return this.http.get<RespuestaPosts>(`${ URL }/posts/?pagina=${ this.paginaPosts }`);

  }

  crearPost( post ) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });

    return new Promise( resolve => {      
      this.http.post(`${ URL }/posts`, post, {headers})
          .subscribe( res => {
  
            this.nuevoPost.emit( res['post'] );
            resolve(true);
  
          });
    });
  }


  subirImagen( img:string ):Promise<ResponseSubida> {
    const options:FileUploadOptions = {
      fileKey: 'image',
      headers: {
        'x-token': this.usuarioService.token
      }
    };

    return new Promise((resolve,reject) => {

      const fileTransfer:FileTransferObject = this.fileTransfer.create();
      fileTransfer.upload( img, `${ URL }/posts/upload`, options )
                  .then( data => {
                    let json:ResponseSubida = JSON.parse( data.response );
                    resolve(json);
                  }).catch( err => {
                    reject();
                  });
    })

  }

  borrarTemps() {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });

    return new Promise( resolve => {      
      this.http.delete(`${ URL }/posts/imagen/deleteTemp`, {headers})
          .subscribe( res => {
              resolve(res);
          });
    });
  }

  borrarFoto(img) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });

    return new Promise( resolve => {      
      this.http.delete(`${ URL }/posts/imagen/delete/${img}`, {headers})
          .subscribe( res => {
              resolve(res);
          }, err => {
            resolve(false);
          });
    });
  }

}
