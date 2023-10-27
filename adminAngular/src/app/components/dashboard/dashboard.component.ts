import { Component, OnInit } from '@angular/core';
import * as chartData from '../../shared/data/chart';
import { doughnutData, pieData } from '../../shared/data/chart';
import { AuthService } from 'src/app/shared/service/auth.service';
import { ProductService } from 'src/app/shared/service/product.service';
import { OrderService } from 'src/app/shared/service/order.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public shop: any;
  public products: any[] = [];
  public productCount: number = 0;
  public orders: any[] = [];



  public doughnutData = doughnutData;
  public pieData = pieData;


  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private orderService: OrderService
  ) {
    Object.assign(this, { doughnutData, pieData })
  }

  // doughnut 2
  public view = chartData.view;
  public doughnutChartColorScheme = chartData.doughnutChartcolorScheme;
  public doughnutChartShowLabels = chartData.doughnutChartShowLabels;
  public doughnutChartGradient = chartData.doughnutChartGradient;
  public doughnutChartTooltip = chartData.doughnutChartTooltip;

  public chart5 = chartData.chart5;


  // lineChart
  public lineChartData = chartData.lineChartData;
  public lineChartLabels = chartData.lineChartLabels;
  public lineChartOptions = chartData.lineChartOptions;
  public lineChartColors = chartData.lineChartColors;
  public lineChartLegend = chartData.lineChartLegend;
  public lineChartType = chartData.lineChartType;

  // lineChart
  public smallLineChartData = chartData.smallLineChartData;
  public smallLineChartLabels = chartData.smallLineChartLabels;
  public smallLineChartOptions = chartData.smallLineChartOptions;
  public smallLineChartLegend = chartData.smallLineChartLegend;
  public smallLineChartType = chartData.smallLineChartType;

  // lineChart
  public smallLine2ChartData = chartData.smallLine2ChartData;
  public smallLine2ChartLabels = chartData.smallLine2ChartLabels;
  public smallLine2ChartOptions = chartData.smallLine2ChartOptions;
  public smallLine2ChartLegend = chartData.smallLine2ChartLegend;
  public smallLine2ChartType = chartData.smallLine2ChartType;

  // lineChart
  public smallLine3ChartData = chartData.smallLine3ChartData;
  public smallLine3ChartLabels = chartData.smallLine3ChartLabels;
  public smallLine3ChartOptions = chartData.smallLine3ChartOptions;
  public smallLine3ChartLegend = chartData.smallLine3ChartLegend;
  public smallLine3ChartType = chartData.smallLine3ChartType;

  // lineChart
  public smallLine4ChartData = chartData.smallLine4ChartData;
  public smallLine4ChartLabels = chartData.smallLine4ChartLabels;
  public smallLine4ChartOptions = chartData.smallLine4ChartOptions;
  public smallLine4ChartColors = chartData.smallLine4ChartColors;
  public smallLine4ChartLegend = chartData.smallLine4ChartLegend;
  public smallLine4ChartType = chartData.smallLine4ChartType;

  public chart3 = chartData.chart3;



  // events
  public chartClicked(e: any): void {
  }
  public chartHovered(e: any): void {
  }

  ngOnInit() {
    this.auth();
   

  }

  auth() {
    this.authService.loadShop().subscribe(
      (shop) => {
        this.shop = shop.seller;
        console.log(this.shop);
        this.getShopProducts();
        this.getShopOrders();
      },
      (error) => {
        console.error('Kullanıcı kimliği belirleme hatası:', error);
      }
    );
  }

  getShopProducts() {
    console.log(this.shop._id)
    this.productService.getShopProduct(this.shop._id).subscribe(
      (res) => {
        this.products = res.products;
        this.productCount = this.products.length;
        console.log(this.productCount);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getShopOrders() {
    console.log(this.shop._id)
    this.orderService.getShopOrders(this.shop._id).subscribe(
      (res) => {
        console.log(res);
        this.orders = res.orders;

      },
      (error) => {
        console.log(error);
      }
    );
  }

}
