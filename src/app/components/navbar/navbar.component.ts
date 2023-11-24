import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Enseignant } from 'app/model/enseignant';
import { EnseigantService } from 'app/service/enseigant.service';
import { AuthentificationService } from 'app/service/authentification.service';
import { Admin } from 'app/model/admin';
import { AdministrateurService } from 'app/service/administrateur.service';
import { AgentService } from 'app/service/agent.service';
import { SuperAdminService } from 'app/service/super-admin.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
      mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    listeEnseignants: Enseignant[]| any;
  nbrEnseignant: number;
  // adminConnecter: Admin|undefined;
  isBlankPage: boolean = false;
  isLoginPage: boolean = false;
  user: any;

    constructor(location: Location,private authService: AuthentificationService , private element: ElementRef, private router: Router, private enseignantService: EnseigantService, private adminService:AdministrateurService, private agentService:AgentService, private superAdminService:SuperAdminService) {
      this.location = location;
          this.sidebarVisible = false;
          // this.loadEnseignantList();
         this.user = this.authService.getLoggedInUserInfo();
         this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.isLoginPage = event.url.endsWith('login') || event.url === '/login';
          }
          if (event instanceof NavigationEnd) {
            this.isBlankPage = event.url.endsWith('/') || event.url === '/login';
          }
        });
    }

  



    ngOnInit(){
      this.listTitles = ROUTES.filter(listTitle => listTitle);
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
      this.router.events.subscribe((event) => {
        this.sidebarClose();
         var $layer: any = document.getElementsByClassName('close-layer')[0];
         if ($layer) {
           $layer.remove();
           this.mobile_menu_visible = 0;
         }
     });

     this.authService.update$.subscribe(() => {
      // this.adminConnecter = this.authService.getAdminConnect();
      // this.user = this.authService.getUserInfo();
      console.log(this.user);

    });

     this.enseignantService.update$.subscribe(() => {
      this.loadEnseignantList();
    });

    // const userData = JSON.parse(localStorage.getItem('userData'));

    const userData = this.authService.getLoggedInUserInfo();

    // Utiliser le rôle de l'utilisateur pour personnaliser le contenu
    if (userData) {
      switch (userData.userType) {
        case 'Admin':
          // Code spécifique pour les administrateurs
          this.user = userData.admin;
          break;
        case 'SuperAdmin':
          // Code spécifique pour les super-administrateurs
          this.user = userData.superAdmin;
          break;
        case 'Agent':
          // Code spécifique pour les agents
          this.user = userData.agent;
          break;
        default:
          console.error('Type d\'utilisateur non pris en charge :', userData.userType);
          break;
      }
    } else {
      console.error('Aucune information utilisateur trouvée dans le localStorage.');
    }
  
    console.log(this.user);

}

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function() {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function() {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            }else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function() {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function() { //asign a function
              body.classList.remove('nav-open');
              this.mobile_menu_visible = 0;
              $layer.classList.remove('visible');
              setTimeout(function() {
                  $layer.remove();
                  $toggle.classList.remove('toggled');
              }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }

      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }


    ////++++++++++++++++++++++++++
    // Exemple pour charger la liste des administrateurs
loadEnseignantList() {
    this.enseignantService.triggerUpdate();
    this.enseignantService.getEnseignantList().subscribe(
      (data) => {
        this.listeEnseignants = data;
        this.nbrEnseignant = this.counten(); // Appel à la fonction de comptage ici
        // ... le reste du code
        console.log("nombre :" , this.nbrEnseignant);
      },
      (error) => {
        console.error('Erreur lors du chargement de la liste des enseignants:', error);
      }
    );
  }
  
  counten(): number {
    return this.listeEnseignants.reduce((total, enseignant) => {
      if (enseignant.acces == false) {
        return total + 1;
      } else {
        return total;
      }
    }, 0);
  }
  
    ///////++++++++++++++++

}
