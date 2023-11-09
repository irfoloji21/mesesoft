// applyCoupon() {
    
//     event.preventDefault();
//     this.couponCode = this.couponForm.get('couponCode').value;

//     const user = this.authService.getUser();
//     const appliedCoupons = user.user.coupons;
  
//     if (appliedCoupons && appliedCoupons.length > 0) {

//       const isCouponAlreadyUsed = appliedCoupons.some(appliedCoupon => appliedCoupon.couponID === this.couponCode._id );
    
//       if (isCouponAlreadyUsed) {
//         this.toastr.error('Bu kupon daha önce kullanıldı', 'Hata');
//         this.isCouponValid = false;
//         this.discountedTotal = this.totalAmount;
//         this.couponForm.reset();
//         return;
//       }
//     }
    
  
//     this.couponService.getCouponValueByName(this.couponCode).subscribe((response) => {
//       console.log(response, "kupon");
//       if (response && response.couponCode && response.couponCode.name === this.couponCode && response.couponCode.start_date && response.couponCode.end_date) {
//         const currentDate = new Date(); 
//         console.log(currentDate, "şuanki date");
//         const startDate = new Date(response.couponCode.start_date.year, response.couponCode.start_date.month - 1);
//         const endDate = new Date(response.couponCode.end_date.year, response.couponCode.end_date.month - 1);
  
//         if (currentDate >= startDate && currentDate <= endDate) {
//           this.isCouponValid = true;
//           this.showDiscountedTotal = true;
//           this.toastr.success('Kupon kodu başarıyla uygulandı', 'Başarılı');
//           this.couponForm.reset();
  
//           if (this.totalAmount >= response.couponCode.min) {
  
//             const appliedCoupon = {
//               code: this.couponCode,
//               discount: response.couponCode.quantity,
//             };
//             this.couponService.applyCoupon(response.couponCode);
  

//            const newAppliedCoupon = {
//              couponID: this.couponCode._id,
//              quantity: this.couponCode.quantity,
//            };
//             user.user.coupons.push(newAppliedCoupon);

//             this.authService.updateUser(user);
  
//             this.updateDiscountedTotal(response.couponCode);
//           } else {
//             this.toastr.error('Minimum alışveriş tutarı gerekliliği karşılanmıyor', 'Hata');
//             this.isCouponValid = false;
//             this.showDiscountedTotal = true;
//             this.discountedTotal = this.totalAmount;
//             this.couponForm.reset();
//           }
//         } else {
//           this.toastr.error('Bu kuponun süresi doldu', 'Hata');
//           this.isCouponValid = false;
//           this.showDiscountedTotal = true;
//           this.discountedTotal = this.totalAmount;
//           this.couponForm.reset();
//         }
//       } else {
//         this.toastr.error('Kupon kodu geçerli değil', 'Hata');
//         this.isCouponValid = false;
//         this.showDiscountedTotal = true;
//         this.discountedTotal = this.totalAmount;
//         this.couponForm.reset();
//       }
//     });
//     this.subscription.unsubscribe();
//   }