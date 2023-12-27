import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Menu
export interface Menu {
	path?: string;
	title?: string;
	type?: string;
	megaMenu?: boolean;
	image?: string;
	active?: boolean;
	badge?: boolean;
	badgeText?: string;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})

export class NavService {

	constructor() { }

	public screenWidth: any;
	public leftMenuToggle: boolean = false;
	public mainMenuToggle: boolean = false;

	// Windows width
	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}

	MENUITEMS: Menu[] = [
		{
			title: 'Category 1', type: 'sub', megaMenu: true, active: false, children: []
		},
		{
			title: 'Category 3',
			type: 'sub', megaMenu: true, badge: true, badgeText: 'new', active: false, children: []
		}
	];

	LEFTMENUITEMS: Menu[] = [
		{
			title: 'clothing', type: 'sub', megaMenu: true, active: false, children: [
				{
					title: 'mens fashion', type: 'link', active: false, children: [
						{ path: '/home/fashion', title: 'sports wear', type: 'link' },
						{ path: '/home/fashion', title: 'top', type: 'link' },
						{ path: '/home/fashion', title: 'bottom', type: 'link' },

					]
				}
			]
		},
		{
			title: 'bags', type: 'sub', active: false, children: [
				{ path: '/home/fashion', title: 'shopper bags', type: 'link' },
				{ path: '/home/fashion', title: 'laptop bags', type: 'link' },
				{ path: '/home/fashion', title: 'clutches', type: 'link' },

			]
		},
		{
			title: 'footwear', type: 'sub', active: false, children: [
				{ path: '/home/fashion', title: 'sport shoes', type: 'link' },
				{ path: '/home/fashion', title: 'formal shoes', type: 'link' },
				{ path: '/home/fashion', title: 'casual shoes', type: 'link' }
			]
		},
		{
			path: '/home/fashion', title: 'watches', type: 'link'
		},

		{
			path: '/home/fashion', title: 'house of design', type: 'link'
		},
		{
			title: 'beauty & personal care', type: 'sub', active: false, children: [
				{ path: '/home/fashion', title: 'makeup', type: 'link' },
				{ path: '/home/fashion', title: 'skincare', type: 'link' },
				{ path: '/home/fashion', title: 'premium beaty', type: 'link' },
				{
					path: '/home/fashion', title: 'more..', type: 'link', active: false, children: [
						{ path: '/home/fashion', title: 'fragrances', type: 'link' },
						{ path: '/home/fashion', title: 'luxury beauty', type: 'link' },
						{ path: '/home/fashion', title: 'hair care', type: 'link' },
						{ path: '/home/fashion', title: 'tools & brushes', type: 'link' }
					]
				},
			]
		},
		{
			path: '/home/fashion', title: 'home & decor', type: 'link'
		},
		{
			path: '/home/fashion', title: 'kitchen', type: 'link'
		}
	];

	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
	leftMenuItems = new BehaviorSubject<Menu[]>(this.LEFTMENUITEMS);

}
