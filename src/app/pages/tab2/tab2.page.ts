import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { UiServiceService } from '../../services/ui-service.service';
import { ActionSheetController } from '@ionic/angular';

declare var window:any;

interface tempImage {
  tempImage:string;
  img:string;
};

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  
  tempImages:tempImage[] = [];
  cargandoGeo = false;

  post = {
    mensaje:'',
    coords: null,
    posicion: false
  }

  constructor( private postsService:PostsService,
                private route:Router,
                private geolocation:Geolocation,
                private camera:Camera,
                private imagePicker: ImagePicker,
                private uiService:UiServiceService,
                private actionSheetController: ActionSheetController ) {}


  cancelar() {
    this.postsService.borrarTemps();
    this.tempImages = [];

    this.route.navigateByUrl('/main/tabs/tab1');

  }

  async borrarImg(image:tempImage) {
    const actionSheet = await this.actionSheetController.create({
      header: '¿Desea borrar esta imagen?',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.postsService.borrarFoto( image.tempImage )
                .then(res=>{
                  if ( res['ok'] ) {
                    this.tempImages = this.tempImages.filter( img => img.tempImage !== image.tempImage );
                  } else {
                    this.uiService.alertaInformativa('No ha podido eliminarse la foto');
                  }
                });
        }
      }, 
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

  }

  async crearPost() {
    const creado = await this.postsService.crearPost( this.post );

    if (creado) {
      this.post = {
        mensaje:'',
        coords: null,
        posicion: false
      };
  
      let borrado = await this.postsService.borrarTemps();
      if ( borrado ) {
        this.tempImages = [];
      } else {
        this.uiService.alertaInformativa('Ha habido un error al borrar las imágenes temporales');
      }
      this.route.navigateByUrl('/main/tabs/tab1');
    } else {
      this.uiService.alertaInformativa('Ha habido un error al publicar el Post');
    }
  }

  getGeo() {

    if ( !this.post.posicion ) {
      this.post.coords = null;
      this.cargandoGeo = false;
      return;
    }

    this.cargandoGeo = true;

    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      this.cargandoGeo = false;
      const coords = `${ resp.coords.latitude },${ resp.coords.longitude }`;
      this.post.coords = coords;
    }).catch((error) => {
       console.log('Error getting location', error);
       this.cargandoGeo = false;
     });
  }

  camara() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
      targetWidth: 450,
      targetHeight: 450,
    }

    this.camera.getPicture(options).then(( imageData ) => {
      const img = window.Ionic.WebView.convertFileSrc( imageData );
      
      this.postsService.subirImagen( imageData )
          .then(res=>{
            if (res.ok) {
              this.tempImages.push( {tempImage:res.file,img:img} );
            } else {
              this.uiService.alertaInformativa('Ha ocurrido un error al obtener la foto');
            }
          }, err => {
            this.uiService.alertaInformativa('Ha ocurrido un error al obtener la foto');
          })
    }, (err) => {
      this.uiService.alertaInformativa('Ha ocurrido un error al intentar abrir tu camara');
    });
  }

  libreria() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 450,
      targetHeight: 450,
    }

    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
          const img = window.Ionic.WebView.convertFileSrc( results[i] );

          this.postsService.subirImagen( results[i] )
              .then( data => {
                if (data.ok) {
                  this.tempImages.push( {tempImage:data.file,img:img} );
                } else {
                this.uiService.alertaInformativa('Ha ocurrido un error al obtener la foto');
                }
              }, error => {
                this.uiService.alertaInformativa('Ha ocurrido un error al obtener la foto');
              });
      }
    }, (err) => { 
      this.uiService.alertaInformativa('Ha ocurrido un error al intentar abrir tu galeria');
    });
  }
}
