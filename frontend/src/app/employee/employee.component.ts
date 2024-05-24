import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EmployeeService } from '../sevices/employee.service';
import Swal from 'sweetalert2';
import { UserService } from '../sevices/user.service';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeComponent implements OnInit {

  listemployee: any;
  e:number=1
  search: string = '';
  isInputFocused = false;
  imageUrl: string | ArrayBuffer = '';

  constructor(private service: EmployeeService, private userService: UserService) { }

  ngOnInit(): void {
    this.allemployee(); // Correction ici: Ajoutez les parenthèses pour appeler la méthode.

  }

  allemployee() {
    this.service.getallemployee().subscribe((res: any) => {
      this.listemployee = res;
      // console.log("list of employee :", this.listemployee);
    });
  }

  deleteemployee(id: any) {
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
        this.service.removeEmployee(id).subscribe({
          next: (res: any) => {
            // Log et rafraîchissement de la liste des employés en cas de succès
            console.log("Employee deleted", res);
            this.allemployee();
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
updateSearch(): void {
  // This method is triggered on each input event
  // It can contain logic to filter data or simply trigger Angular's change detection
}

clearSearch(): void {
  this.search = '';  // Clears the search input
  this.updateSearch();  // Optionally update list or icons
}
toggleStatus(employee: any) {
  employee.status = !employee.status;
  this.service.updateUserStatus(employee.id, employee.status)
    .subscribe(response => {
      console.log('Status updated', response);
    }, error => {
      console.error('Error updating status', error);
    });
}

}
