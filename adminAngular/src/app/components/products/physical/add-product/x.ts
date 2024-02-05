// editProduct() {
//     if (this.productForm.valid) {
//       const formData = this.productForm.value;
  
//       // Diğer form değerlerini alırken olduğu gibi al
//       const shop = this.authService.getShop();
//       formData.shopId = shop.seller._id;
//       formData.shop = shop;
//       formData.category = this.selectedCategory;
  
//       // StockStatus'u JSON nesnesi olarak oluştur
//       const stockStatusData = {
//         stockStatus: formData.stockStatus,
//       };
  
//       // StockStatus JSON nesnesini formData'ya ekle
//       formData.stockStatus = stockStatusData;
  
//       console.log('FormData:', formData);
  
//       // Backend ile iletişime geçmeden önce stockStatus'u response içine ekleyelim
//       const mockResponse = {
//         success: true,
//         product: {
//           ...formData,
//           stockStatus: stockStatusData,
//         },
//       };
  
//       // Simüle edilmiş mockResponse'u kullanarak işlemi devam ettirin
//       this.handleResponse(mockResponse);
//     }
//   }
  
//   updateStockStatus(value: string) {
//     this.productForm.get('stockStatus').setValue(value);
//   }
//   handleResponse(response) {
//     console.log('Response:', response);
  
//     this.ngZone.run(() => {
//       if (response.product && response.product.stockStatus) {
//         this.productForm.get('stockStatus').setValue(response.product.stockStatus.stockStatus);
//         console.log('Stock Status Updated:', response.product.stockStatus.stockStatus);
//       } else {
//         console.error('Response içinde stockStatus bulunamadı veya tanımsız:', response);
//       }
  
//       this.router.navigate(['/products/physical/productss']);
//       console.log('Ürün başarıyla güncellendi:', response);
//     });
//   }


//   submitForm() {
//     if (this.productForm.valid) {
//       const formData = this.productForm.value;

//       // Diğer form değerlerini alırken olduğu gibi al
//       const shop = this.authService.getShop();
//       formData.shopId = shop.seller._id;
//       formData.shop = shop;
//       formData.category = this.selectedCategory;

//       // stockStatus'u JSON nesnesi olarak oluştur
//       const stockStatusData = {
//         stockStatus: formData.stockStatus,
//       };

//       // stockStatus JSON nesnesini formData'ya ekle
//       formData.stockStatus = stockStatusData;

//       console.log('FormData:', formData);

//       this.productService.createProduct(formData).subscribe(
//         (response) => {
//           console.log('Backend Response:', response);
//           this.router.navigate(['/products/physical/productss']);
//           console.log('Ürün başarıyla oluşturuldu:', response);
//         },
//         (error) => {
//           console.error('Ürün oluşturulurken hata oluştu:', error);
//         }
//       );
//     }
//   }


//   prepareFormData(): void {
//     const formValue = this.productForm.value;

//     // StockStatus değerine göre JSON oluşturuluyor
//     const jsonToSend = {
//       // Diğer form alanları buraya eklenir
//       stockStatus: formValue.stockStatus === 'In Stock' ? true : false,
//     };

//     // JSON'u istediğiniz şekilde kullanabilir veya gönderebilirsiniz
//     console.log(jsonToSend);
//   }