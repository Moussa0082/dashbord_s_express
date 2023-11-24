import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Banque } from 'app/model/banque';
import { BanqueService } from 'app/service/banque.service';
import { TypeBanqueService } from 'app/service/type-banque.service';
import { error } from 'console';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ajouter-type-banque',
  templateUrl: './ajouter-type-banque.component.html',
  styleUrls: ['./ajouter-type-banque.component.scss']
})
export class AjouterTypeBanqueComponent implements OnInit {
  public imagePreview: string | ArrayBuffer | null = '../../../assets/img/preview.png';
   
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  

  isEditMode = false;
  isFormVisible = false;
  
  bank: Banque  | any  = [];
  isModification: boolean = false;

    image!:File;
     
    ImageChange(event:any){
      this.image = event.target.files[0];
      console.log(this.image);
    }
 
  typeBankForm! : FormGroup;
  constructor(private formBuilder: FormBuilder,private bankService:BanqueService,private typeBanqueService: TypeBanqueService) { 

    this.typeBankForm = this.formBuilder.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
      banque: ['', Validators.required],
    });
  }

  

  ngOnInit(): void {  
    
    this.bankService.getAllBanque().subscribe(
      (data) => {
        this.bank = data;
      },
      (error) => {
        console.error('Erreur lors du chargement de la liste des banques:', error);
      }
    );
   
  }

  onSubmit() {

    if (this.typeBankForm.valid && this.image) {
     const newTypeBanque = this.typeBankForm.value;
     console.log(this.typeBankForm.value);
    //  console.log(newTypeBanque);
        
    // this.typeBanqueService.createTypeBanque(newTypeBanque, this.image).subscribe(
    //   (response) => {
    //     console.log("Type banque crée", response);
    //     this.typeBankForm.reset();
    //     Swal.fire('Succès !...', 'Type Banque créer avec succes', 'success');
    // },
    // (error) => {
    //   console.error("Erreur", error);
    // });
      }

    }

    update(id:number) {
    if (this.typeBankForm.valid && this.image, id) {
     const newTypeBanque = this.typeBankForm.value;
     console.log(newTypeBanque);
        
    this.typeBanqueService.modifierTypeBanque(newTypeBanque, this.image).subscribe(
      (response) => {
        console.log("Type banque modifier", response);
        Swal.fire('Succès !...', 'Type Banque modifier avec succes', 'success');
    },
    (error) => {
      console.error("Erreur", error);
    });
     }

    }



   

      
    handleImageChange(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
      }
    }

  triggerImageUpload() {
    this.imageInput.nativeElement.click();
  }

}


