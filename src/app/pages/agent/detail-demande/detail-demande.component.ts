import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Agent } from 'app/model/agent';
import { Demande } from 'app/model/demande';
import { AgentService } from 'app/service/agent.service';
import { DemandeService } from 'app/service/demande.service';

@Component({
  selector: 'app-detail-demande',
  templateUrl: './detail-demande.component.html',
  styleUrls: ['./detail-demande.component.scss']
})
export class DetailDemandeComponent implements OnInit {


   

   idDemande: number;
   demandeDetails:  Demande | any = [];

   demandeId: number;
   agentId: number;

   agentRecup:Agent | undefined;
 
   constructor(
     private route: ActivatedRoute,
     private demandeService: DemandeService,
     private agentService:AgentService
   ) {
  this.agentRecup = this.agentService.getAgentConnect();
   }
 
   ngOnInit(): void {
     // Récupérer l'ID de la demande à partir de l'URL
     this.idDemande = +this.route.snapshot.paramMap.get('id');
 
     // Appel du service pour récupérer les détails de la demande
     this.demandeService.getDetailDemande(this.idDemande).subscribe(detailDemande => {
       this.demandeDetails = detailDemande;
     });
   }

   validerDemande(agentId:number) {
    this.demandeService.validateDemande(this.demandeId, agentId=agentId).subscribe(
      (response) => {
        console.log('Demande validée avec succès :', response);
        // Gérer la validation réussie ici, par exemple, afficher un message à l'utilisateur
      },
      (error) => {
        console.error("Erreur lors de la validation de la demande :", error);
        // Gérer l'erreur ici si nécessaire
      }
    );
  }



}
