import { Component, OnInit } from '@angular/core';
import { ResponsableService } from '../sevices/responsable.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-responsable',
  templateUrl: './responsable.component.html',
  styleUrls: ['./responsable.component.css']
})
export class ResponsableComponent implements OnInit {
  listeresponsable: any;
  e:number=1

  constructor(private service: ResponsableService) { }

  ngOnInit(): void {
    this.allresponsable();
  }

  allresponsable() {
    this.service.getallresponsable().subscribe((res: any) => {
      this.listeresponsable = res;
      console.log("list of respopnsable :", this.listeresponsable);
    });
  }

  deleteResponsable(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // La suppression est confirmée, donc on procède à l'appel de l'API
        this.service.removeResponsable(id).subscribe({
          next: (res: any) => {
            // Log et rafraîchissement de la liste des employés en cas de succès
            console.log("Responsable deleted", res);
            this.allresponsable();
            // Afficher le message de succès après la confirmation de la suppression par le serveur
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );
          },
          error: (err) => {
            // Gestion des erreurs, par exemple si la suppression a échoué
            console.error("Error during deletion", err);
            Swal.fire(
              'Failed!',
              'There was a problem deleting your file. Please try again.',
              'error'
            );
          }
        });
      }
    });
}


}
