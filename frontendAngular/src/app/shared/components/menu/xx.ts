// <div class="main-navbar">
//   <div id="mainnav">
//     <div class="toggle-nav" (click)="mainMenuToggle()">
//       <i class="fa fa-bars sidebar-bar"></i>
//     </div>
//     <ul class="nav-menu" [class.opennav]="navServices?.mainMenuToggle">
//       <li class="back-btn">
//         <div class="mobile-back text-end" (click)="mainMenuToggle()">
//           <span>Back</span>
//           <i class="fa fa-angle-right ps-2" aria-hidden="true"></i>
//         </div>
//       </li>
//       <li *ngFor="let category of menuItems">
//         <!-- Main Category -->
//         <a href="javascript:void(0)" class="nav-link" (click)="toggletNavActive(category)">
//           {{ category.name | translate }}
//           <span class="sub-arrow" *ngIf="category.subcategories"></span>
//         </a>
//         <!-- Subcategories -->
//         <ul class="nav-submenu" [class.opensubmenu]="category.active" *ngIf="category.subcategories">
//           <li *ngFor="let subcategory of category.subcategories">
//             <a [routerLink]="['/products', category._id, subcategory._id]">{{ subcategory.name }}</a>
//           </li>
//         </ul>
//       </li>
//     </ul>
//   </div>
// </div>