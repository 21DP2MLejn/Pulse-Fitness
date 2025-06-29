'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'lv';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Common
    'app.name': 'Pulse Fitness',
    'app.tagline': 'Your journey to a healthier lifestyle starts here',
    'app.loading': 'Loading...',
    'loading': 'Loading...',
    'error': 'Error',
    'tryAgain': 'Try Again',

    // Home page
    'header.quote': 'Transform Your Body, Transform Your Life',
    'subheader.quote': 'Your journey to a healthier lifestyle starts here',
    'getstarted.quote': 'Join Pulse Fitness and start your journey to a healthier, stronger you. Expert trainers, state-of-the-art equipment, and a supportive community await.',
    'getstarted.button': 'Get Started',
    'featuredproducts.title' : 'Featured Products',
    'featuredproucts.desc' : 'Discover our premium selection of fitness equipment and apparel',
    'trainers.card.title' : ' Expert Trainers',
    'trainers.card.desc' : 'Work with certified professionals who are passionate about helping you achieve your goals.',
    'equipment.card.title' : 'Modern Equipment',
    'equipment.card.desc' : 'Access to state-of-the-art fitness equipment and facilities.',
    'subscriptions.card.title' : 'Flexible Plans',
    'subscriptions.card.desc' : 'Choose from various membership options that suit your needs and schedule.',
    'ready.to.start' : 'Ready to Start Your Journey?',
    'join.now' : 'Join Now',

    //Footer
    'footer.quote' : 'Your journey to fitness starts here. Join us and transform your life with expert guidance and support.',
    'quick.links' : 'Quick Links',
    'quick.links.workouts' : 'Workouts',
    'quick.links.subscriptions' : 'Subscriptions',
    'quick.links.products' : 'Products',
    'quick.links.contact' : 'Contact',
    'quick.links.about' : 'About',
    'privacy.policy' : 'Privacy Policy',
    'email' : 'Email',
    'phone' : 'Phone',
    'address' : 'Address',
    'all.rights.reserved' : 'All rights reserved',

    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.cart': 'Cart',
    'nav.profile': 'Profile',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.admin': 'Admin Panel',
    'nav.subscriptions': 'Subscriptions',
    'nav.schedule': 'Schedule',
    'nav.manage.sessions': 'Manage Sessions	',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.rememberMe': 'Remember Me',
    'auth.dontHaveAccount': 'Don\'t have an account?',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.createAccount': 'Create Account',
    'auth.accountDetails': 'Account Details',
    'auth.personalInfo': 'Personal Information',
    'auth.continue': 'Continue',
    'auth.completeRegistration': 'Complete Registration',
    'auth.rememberYourPassword': 'Remember Your Password?',
    'auth.signIn': 'Sign In',
    'auth.sendResetLink': 'Send Reset Link',
    'auth.resetPassword': 'Reset Password',
    'auth.resetPasswordSuccess': 'Password reset successfully!',
    'auth.resetPasswordError': 'Failed to reset password. Please try again.',
    'auth.resetPasswordLinkSent': 'Reset password link sent to your email!',
    'auth.resetPasswordLinkExpired': 'Reset password link expired. Please try again.',
    'auth.resetPasswordLinkInvalid': 'Invalid reset password link. Please try again.',
    'auth.phone' : 'Phone',
    'auth.country' : 'Country',
    'auth.dob' : 'Date of Birth',
    'auth.gender' : 'Gender',
    'auth.city' : 'City',
    'auth.address' : 'Address',
    'auth.postalcode' : 'Postal Code',
    'auth.accountDetailsDescription' : 'Basic information to create your account.',
    'auth.personalInfoDescription' : 'Additional information for shipping and communication.',
    'auth.accountinformation' : 'Account Information',
    'auth.personalinformation' : 'Personal Information',
    'auth.fillAllFields' : 'Fill all fields',
    'auth.passwordsDoNotMatch' : 'Passwords do not match',
    'auth.step' : 'Step',
    'auth.of2' : 'of 2',
    'auth.back' : 'Back',
    'login.to.pulsefitness' : 'Login to Pulse Fitness',
    'auth.selectCountry' : 'Select Country',

     
    // Subscriptions
    'subscriptions.title': 'Membership Plans',
    'subscriptions.subtitle': 'Choose the perfect membership plan to achieve your fitness goals',
    'subscriptions.features': 'Features',
    'subscriptions.specifications': 'Specifications',
    'subscriptions.currentPlan': 'Your Current Plan',
    'subscriptions.selectPlan': 'Select This Plan',
    'subscriptions.loginToSubscribe': 'Login to Subscribe',
    'subscriptions.noPlansAvailable': 'No subscription plans are currently available',
    'subscriptions.backToPlans': 'Back to Plans',
    'subscriptions.notFound': 'Subscription plan not found',
    'subscriptions.summary': 'Order Summary',
    'subscriptions.plan': 'Plan',
    'subscriptions.billing': 'Billing',
    'subscriptions.monthly': 'Monthly',
    'subscriptions.total': 'Total',
    'subscriptions.subscribe': 'Subscribe Now',
    'subscriptions.processing': 'Processing...',
    'subscriptions.alreadySubscribed': 'You are already subscribed to this plan',
    'subscriptions.termsNotice': 'By subscribing, you agree to our Terms of Service and Privacy Policy',
    'subscriptions.subscribeSuccess': 'Successfully subscribed to the plan!',
    'subscriptions.subscribeError': 'Failed to subscribe. Please try again.',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.editProfile': 'Edit Profile',
    'profile.orders': 'My Orders',
    'profile.settings': 'Settings',
    'profile.save': 'Save',
    'profile.emailCannotChange': 'Email cannot be changed',
    'profile.notProvided': 'Not provided',
    'profile.addressInfo': 'Address Information',
    'profile.subscription': 'Subscription',
    'profile.subscriptionName': 'Subscription Name',
    'profile.noActiveSubscription': 'No active subscription',
    'profile.deleteAccount': 'Delete Account',
    'profile.deleteAccountMessage': 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
    'profile.cancel': 'Cancel',
    'profile.personalInfo' : 'Personal information',
    
    // Products
    'products.title': 'Products',
    'products.search': 'Search products...',
    'products.filter': 'All',
    'products.sort': 'Sort',
    'products.addToCart': 'Add to Cart',
    'products.addedToCart': 'Added to Cart',
    'products.outOfStock': 'Out of Stock',
    'products.inStock': 'In Stock',
    'products.features': 'Key Features',
    'products.specifications': 'Specifications',
    'products.reviews': 'Customer Reviews',
    'products.noReviews': 'No reviews yet. Be the first to review this product!',
    'products.category.equipment': 'Equipment',
    'products.category.clothing': 'Clothing',
    'products.category.accessories': 'Accessories',
    'products.category.supplements': 'Supplements',
    'products.category.apparel' : 'Apparel',
    'products.sort.priceAsc' : 'Price: Low to High',
    'products.sort.priceDesc' : 'Price: High to Low',
    'products.sort.topRated' : 'Top Rated',
    'products.noProductsFound': 'No products found',

    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.emptyMessage': 'Add some products to your cart and they will show up here',
    'cart.continueShopping': 'Continue Shopping',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.orderSummary': 'Order Summary',

    // HOME
    'welcome.back.home' : 'Welcome back, {name}!👋',
    'see.latest.products' : 'See the latest products',
    'see.latest.products.desc' : 'Check out our latest products and get ready to take your fitness journey to the next level.',
    'view.products.button' : 'View Products',

    'my.subscriptions' : 'My Subscriptions',
    'my.subscriptions.desc' : 'Manage your subscriptions and find the best subscription for you.',
    'view.subscriptions' : 'View Subscriptions',

    'group.workout' : 'Group Workout',
    'group.workout.desc' : 'Make a reservation for a group workout',
    'make.reservation' : 'Make Reservation',

    'my.orders' : 'My Orders',
    'my.orders.desc' : 'View your order history and manage your orders.',
    'view.orders' : 'View Orders',

    // Training Sessions
    'sessions.title': 'Training Sessions',
    'sessions.loading': 'Loading schedule...',
    'sessions.previousWeek': 'Previous Week',
    'sessions.nextWeek': 'Next Week',
    'sessions.currentWeek': 'Current Week',
    'sessions.noSessions': 'No sessions scheduled',
    'sessions.cancelled': 'Cancelled',
    'sessions.location': 'Location',
    'sessions.trainer': 'Trainer',
    'sessions.capacity': 'Capacity',
    'sessions.reservations': 'Reservations',
    'sessions.addSession': 'Add Session',
    'sessions.editSession': 'Edit Session',
    'sessions.deleteSession': 'Delete Session',
    'sessions.cancelSession': 'Cancel Session',
    'sessions.sessionTitle': 'Session Title',
    'sessions.description': 'Description',
    'sessions.startTime': 'Start Time',
    'sessions.endTime': 'End Time',
    'sessions.difficultyLevel': 'Difficulty Level',
    'sessions.difficulty': 'Difficulty',
    'sessions.difficulty.beginner': 'Beginner',
    'sessions.difficulty.intermediate': 'Intermediate',
    'sessions.difficulty.advanced': 'Advanced',
    'sessions.type': 'Type',
    'sessions.type.group': 'Group',
    'sessions.type.personal': 'Personal',
    'sessions.save': 'Save',
    'sessions.cancel': 'Cancel',
    'sessions.delete': 'Delete',
    'sessions.confirmDelete': 'Are you sure you want to delete this session?',
    'sessions.confirmCancel': 'Are you sure you want to cancel this session?',
    'sessions.success': 'Session saved successfully',
    'sessions.error': 'Failed to save session',
    'sessions.deleteSuccess': 'Session deleted successfully',
    'sessions.deleteError': 'Failed to delete session',
    'sessions.cancelSuccess': 'Session cancelled successfully',
    'sessions.cancelError': 'Failed to cancel session',
    'sessions.viewReservations': 'View Reservations',
    'sessions.reservationsTitle': 'Session Reservations',
    'sessions.reservationsCount': 'Reservations: {count} / {capacity}',
    'sessions.date': 'Date',
    'sessions.time': 'Time',
    'sessions.close': 'Close',
    'sessions.days.monday': 'Monday',
    'sessions.days.tuesday': 'Tuesday',
    'sessions.days.wednesday': 'Wednesday',
    'sessions.days.thursday': 'Thursday',
    'sessions.days.friday': 'Friday',
    'sessions.days.saturday': 'Saturday',
    'sessions.days.sunday': 'Sunday',
    'sessions.full': 'Session Full',
    'sessions.ended': 'Session Ended',
    'sessions.noSessionsForDay': 'No sessions scheduled for this day',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.shippingAddress': 'Shipping Address',
    'checkout.billingAddress': 'Billing Address',
    'checkout.paymentMethod': 'Payment Method',
    'checkout.orderSummary': 'Order Summary',
    'checkout.firstName': 'First Name',
    'checkout.lastName': 'Last Name',
    'checkout.email': 'Email',
    'checkout.phone': 'Phone',
    'checkout.address': 'Address',
    'checkout.city': 'City',
    'checkout.state': 'State/Province',
    'checkout.postalCode': 'Postal Code',
    'checkout.country': 'Country',
    'checkout.sameAsShipping': 'Same as shipping address',
    'checkout.cardNumber': 'Card Number',
    'checkout.cardName': 'Name on Card',
    'checkout.expiryDate': 'Expiry Date',
    'checkout.cvv': 'CVV',
    'checkout.placeOrder': 'Place Order',
    'checkout.back': 'Back',
    'checkout.next': 'Next',
    'checkout.step': 'Step',
    'checkout.of': 'of',
    'checkout.items': 'Items',
    'checkout.shipping': 'Shipping',
    'checkout.tax': 'Tax',
    'checkout.total': 'Total',
    'checkout.orderSuccess': 'Order Placed Successfully!',
    'checkout.orderError': 'Error placing order. Please try again.',
    'checkout.orderSuccessMessage': 'Thank you for your order. We have received your payment and will process your order shortly.',
    'checkout.returnToShopping': 'Return to Shopping',
    'checkout.viewOrder': 'View Order',
    'checkout.paymentProcessing': 'Processing payment...',
    'checkout.requiredField': 'This field is required',
    'checkout.invalidEmail': 'Please enter a valid email address',
    'checkout.invalidPhone': 'Please enter a valid phone number',
    'checkout.invalidCard': 'Please enter a valid card number',
    'checkout.invalidExpiry': 'Please enter a valid expiry date',
    'checkout.invalidCVV': 'Please enter a valid CVV',
    'checkout.contactInformation': 'Contact Information',
    'checkout.zipCode': 'ZIP Code',
    'checkout.notes': 'Notes',
    'checkout.specialInstructions': 'Any special instructions for your order...',
    'checkout.backToCart': 'Back to Cart',
    'checkout.thankYou': 'Thank you for your order',
    'checkout.orderConfirmation': 'We have received your payment and will process your order.',
    'checkout.orderDetails': 'Your order details and tracking information will be sent to your email.',
    'checkout.shortly': 'shortly',
    'checkout.continueShopping': 'Continue Shopping',
    'checkout.backToHome': 'Back to Home',
    'checkout.subtotal': 'Subtotal',

    
    // Admin
    'admin.dashboard': 'Admin Dashboard',
    'admin.welcome': 'Welcome back, {name}! Here\'s an overview of your store.',
    'admin.products': 'Products',
    'admin.users': 'Users',
    'admin.orders': 'Orders',
    'admin.settings': 'Settings',
    'admin.totalProducts': 'Total Products',
    'admin.totalUsers': 'Total Users',
    'admin.totalOrders': 'Total Orders',
    'admin.manageProducts': 'Manage your product inventory, add new products, update prices and stock levels.',
    'admin.manageUsers': 'View and manage user accounts, check customer details and purchase history.',
    'admin.manageSettings': 'Configure store settings, payment methods, shipping options and more.',
    'admin.viewProducts': 'View Products',
    'admin.viewUsers': 'View Users',
    'admin.viewSettings': 'View Settings',
    'admin.searchUsers': 'Search users by name or email...',
    'admin.joined': 'Joined',
    'admin.noUsersFound': 'No users found matching your search.',
    'admin.subscriptions': 'Subscriptions',
    'admin.manageSubscriptions': 'Manage your subscriptions, add new subscriptions, update prices and more.',
    'admin.viewSubscriptions': 'View Subscriptions',
    'admin.searchSubscriptions': 'Search subscriptions by name or description...',
    'admin.noSubscriptionsFound': 'No subscriptions found matching your search.',
    'admin.createSubscription': 'Create Subscription',
    'admin.createFirstSubscription': 'Create your first subscription',
    'admin.backToSubscriptions': 'Back to Subscriptions',
    'admin.subscriptionName': 'Subscription Name',
    'admin.description': 'Subscription Description',
    'admin.price': 'Subscription Price',
    'admin.features': 'Subscription Features',
    'admin.save': 'Save',
    'admin.cancel': 'Cancel',
    'admin.addFeature': 'Add Feature',
    'admin.saveSubscription': 'Save Subscription',
    'admin.fillSubscriptionDetails': 'Fill Subscription Details',
    
    // Orders translations
    'admin.manageOrders': 'View and manage all customer orders, track order status and fulfillment.',
    'admin.viewOrders': 'View Orders',
    'admin.searchOrders': 'Search orders by customer name, email or order ID...',
    'admin.noOrdersFound': 'No orders found matching your search.',
    'admin.orderId': 'Order ID',
    'admin.customer': 'Customer',
    'admin.amount': 'Amount',
    'admin.status': 'Status',
    'admin.date': 'Date',
    'admin.orderStatus.pending': 'Pending',
    'admin.orderStatus.processing': 'Processing',
    'admin.orderStatus.shipped': 'Shipped',
    'admin.orderStatus.delivered': 'Delivered',
    'admin.orderStatus.cancelled': 'Cancelled',
    'cart.quantity' : 'Quantity',
    
    // Language
    'language.select': 'Select Language',
    'language.english': 'English',
    'language.latvian': 'Latvian',

    // Reservations
    'reservations.createTitle': 'Make Reservation',
    'reservations.cancelTitle': 'Cancel Reservation',
    'reservations.adminCancelTitle': 'Cancel Training Session',
    'reservations.confirmCreate': 'Are you sure you want to reserve a spot for this session?',
    'reservations.confirmCancel': 'Are you sure you want to cancel this reservation?',
    'reservations.adminConfirmCancel': 'Are you sure you want to cancel "{title}"? All reservations will be cancelled.',
    'reservations.cancelReason': 'Reason for cancellation',
    'reservations.adminCancelReason': 'Reason for cancelling the session',
    'reservations.cancelReasonPlaceholder': 'Please provide a reason for cancellation...',
    'reservations.adminCancelReasonPlaceholder': 'Please provide a reason for cancelling the session...',
    'reservations.reserveSpot': 'Reserve Spot',
    'common.cancel' : 'Cancel',
    'common.save' : 'Save',
    'common.confirm' : 'Confirm',
  },
  lv: {
    // Common
    'app.name': 'Pulse Fitness',
    'app.tagline': 'Tavs ceļš uz veselīgāku dzīvesveidu sākas šeit',
    'app.loading': 'Ielāde...',
    'loading': 'Ielāde...',
    'error': 'Kļūda',
    'tryAgain': 'Mēģināt vēlreiz',

    // landing page
    'header.quote': 'Pārveido savu ķermeni, pārveido savu dzīvi',
    'subheader.quote': 'Tavs ceļš uz veselīgāku dzīvesveidu sākas šeit',
    'getstarted.quote': 'Pievienojies Pulse Fitness un sāc savu ceļojumu uz veselīgāku un stiprāku sevi. Tevi gaida pieredzējuši treneri, modernākais aprīkojums un atbalstoša kopiena.',
    'getstarted.button': 'Sākt',
    'featuredproducts.title' : 'Piedāvātie produkti',
    'featuredproucts.desc' : 'Atklājiet mūsu augstākās klases fitnesa aprīkojuma un apģērbu klāstu',
    'trainers.card.title' : 'Pieredzējuši treneri',
    'trainers.card.desc' : 'Strādājiet ar sertificētiem profesionāļiem, kuri ar aizrautību palīdzēs jums sasniegt savus mērķus.',
    'equipment.card.title' : 'Moderns aprīkojums',
    'equipment.card.desc' : 'Piekļuve modernākajam fitnesa aprīkojumam un iestādēm.',
    'subscriptions.card.title' : 'Elastīgi abonomenti',
    'subscriptions.card.desc' : 'Izvēlieties no dažādām abonomnentu iespējām, kas atbilst jūsu vajadzībām un grafikam.',
    'ready.to.start' : 'Vai esat gatavs sākt savu ceļojumu?',
    'join.now' : 'Pievienoties',

    //Footer
    'footer.quote' : 'Tavs ceļojums uz fizisko sagatavotību sākas šeit. Pievienojies mums un pārveido savu dzīvi ar ekspertu palīdzību un atbalstu.',
    'quick.links' : 'Ātrās saites',
    'quick.links.workouts' : 'Treniņi',
    'quick.links.subscriptions' : 'Abonomenti',
    'quick.links.products' : 'Produkti',
    'quick.links.contact' : 'Kontakti',
    'quick.links.about' : 'Par mums',
    'privacy.policy' : 'Privacy Policy',
    'email' : 'E-pasts',
    'phone' : 'Tālrunis',
    'address' : 'Adrese',
    'all.rights.reserved' : 'Visas tiesības aizsargātas.',
    
    
    // Navigation
    'nav.home': 'Sākums',
    'nav.products': 'Produkti',
    'nav.cart': 'Grozs',
    'nav.profile': 'Profils',
    'nav.login': 'Ieiet',
    'nav.register': 'Reģistrēties',
    'nav.logout': 'Iziet',
    'nav.admin': 'Administrācijas panelis',
    'nav.subscriptions': 'Abonomenti',
    'nav.schedule': 'Nodarbības',
    'nav.manage.sessions': 'Pārvaldīt nodarbības	',
    
    // Auth
    'auth.login': 'Ieiet',
    'auth.register': 'Reģistrēties',
    'auth.email': 'E-pasts',
    'auth.password': 'Parole',
    'auth.confirmPassword': 'Apstiprināt paroli',
    'auth.firstName': 'Vārds',
    'auth.lastName': 'Uzvārds',
    'auth.forgotPassword': 'Aizmirsi paroli?',
    'auth.rememberMe': 'Atcerēties mani',
    'auth.dontHaveAccount': 'Nav konta?',
    'auth.alreadyHaveAccount': 'Jau ir konts?',
    'auth.createAccount': 'Izveidot kontu',
    'auth.accountDetails': 'Konta informācija',
    'auth.personalInfo': 'Personīgā informācija',
    'auth.continue': 'Turpināt',
    'auth.completeRegistration': 'Pabeigt reģistrāciju',
    'auth.signIn': 'Ieiet',
    'auth.rememberYourPassword': 'Atcerējāties paroli?',
    'auth.resetPassword': 'Atiestatīt paroli',
    'auth.sendResetLink': 'Sūtīt atiestatīšanas saiti',
    'auth.resetPasswordSuccess': 'Parole veiksmīgi atiestatīta!',
    'auth.resetPasswordError': 'Neizdevās atiestatīt paroli. Lūdzu, mēģini vēlreiz.',
    'auth.resetPasswordLinkSent': 'Atiestatīšanas saits veiksmīgi nosūtīts uz jūsu e-pastu!',
    'auth.resetPasswordLinkExpired': 'Atiestatīšanas saits ir beidzies. Lūdzu, mēģini vēlreiz.',
    'auth.resetPasswordLinkInvalid': 'Atiestatīšanas saits ir nederīgs. Lūdzu, mēģini vēlreiz.',
    'auth.gender' : 'Dzimums',
    'auth.country' : 'Valsts',
    'auth.dob' : 'Dzimšanas datums',
    'auth.phone' : 'Tālrunis',
    'auth.city' : 'Pilsēta',
    'auth.address' : 'Adrese',
    'auth.postalcode' : 'Pasta indekss',
    'auth.or' : 'Vai',
    'auth.agreeToTerms' : 'Izveidojot kontu, jūs piekrītat mūsu noteikumiem un privātuma politikai',
    'auth.accountDetailsDescription' : 'Pamatinformācija konta izveidei.',
    'auth.personalInfoDescription' : 'Papildinformācija par piegādi un saziņu.',
    'auth.accountinformation' : 'Konta informācija',
    'auth.personalinformation' : 'Personīgā informācija',
    'auth.fillAllFields' : 'Aizpildiet visus laukus',
    'auth.passwordsDoNotMatch' : 'Paroles nesakrīt',
    'auth.step' : 'Solis',
    'auth.of2' : 'no 2',
    'auth.back' : 'Atpakaļ',
    'auth.selectCountry' : 'Izvēlies valsti',
    'login.to.pulsefitness' : 'Pieteikties Pulse Fitness',
    'auth.SelectCountry' : 'Izvēlies valsti',

    
    // Subscriptions
    'subscriptions.title': 'Abonomenti',
    'subscriptions.subtitle': 'Izvēlies piemērotāko abonomentu, lai sasniegtu savus fitnesa mērķus',
    'subscriptions.features': 'Iespējas',
    'subscriptions.specifications': 'Specifikācijas',
    'subscriptions.currentPlan': 'Tavs Pašreizējais Abonoments',
    'subscriptions.selectPlan': 'Izvēlēties Šo Abonomentu',
    'subscriptions.loginToSubscribe': 'Ielogojies, lai abonētu',
    'subscriptions.noPlansAvailable': 'Pašlaik nav pieejami abonomenti',
    'subscriptions.backToPlans': 'Atpakaļ uz abonomentiem',
    'subscriptions.notFound': 'Abonoment nav atrasts',
    'subscriptions.summary': 'Pasūtījuma kopsavilkums',
    'subscriptions.plan': 'Abonoments',
    'subscriptions.billing': 'Maksājums',
    'subscriptions.monthly': 'Ikmēneša',
    'subscriptions.total': 'Kopā',
    'subscriptions.subscribe': 'Abonēt tagad',
    'subscriptions.processing': 'Apstrāde...',
    'subscriptions.alreadySubscribed': 'Tu jau esi abonējis šo abonomentu',
    'subscriptions.termsNotice': 'Abonējot tu piekrīti mūsu pakalpojumu noteikumiem un privātuma politikai',
    'subscriptions.subscribeSuccess': 'Veiksmīgi abonēts!',
    'subscriptions.subscribeError': 'Neizdevās abonēt. Lūdzu, mēģini vēlreiz.',
    
    // Profile
    'profile.title': 'Mans Profils',
    'profile.editProfile': 'Rediģēt profilu',
    'profile.orders': 'Mani pasūtījumi',
    'profile.settings': 'Iestatījumi',
    'profile.save': 'Saglabāt',
    'profile.emailCannotChange': 'E-pastu nevar mainīt',
    'profile.notProvided': 'Nav norādīts',
    'profile.addressInfo': 'Adrese',
    'profile.subscription': 'Abonements',
    'profile.subscriptionName': 'Abonementa nosaukums',
    'profile.noActiveSubscription': 'Nav aktīva abonementa',
    'profile.deleteAccount': 'Dzēst kontu',
    'profile.deleteAccountMessage': 'Vai tiešām vēlaties dzēst savu kontu? Šo darbību nevar atsaukt un visi jūsu dati tiks neatgriezeniski dzēsti.',
    'profile.cancel': 'Atcelt',
    'profile.personalInfo' : 'Personīgā informācija',
    
    // Products
    'products.title': 'Produkti',
    'products.search': 'Meklēt produktus...',
    'products.filter': 'Visi',
    'products.sort': 'Kārtot',
    'products.addToCart': 'Pievienot grozam',
    'products.addedToCart': 'Pievienots grozam',
    'products.outOfStock': 'Nav noliktavā',
    'products.inStock': 'Ir noliktavā',
    'products.features': 'Galvenās iezīmes',
    'products.specifications': 'Specifikācijas',
    'products.reviews': 'Klientu atsauksmes',
    'products.noReviews': 'Vēl nav atsauksmju. Esi pirmais, kas novērtē šo produktu!',
    'products.category.equipment': 'Ekipējums',
    'products.category.clothing': 'Clothing',
    'products.category.accessories': 'Aksesuāri',
    'products.category.supplements': 'Uzturvielas',
    'products.category.apparel' : 'Apģērbs',
    'products.sort.priceAsc' : 'Cena: Augošā secībā',
    'products.sort.priceDesc' : 'Cena: Dilstošā secībā',
    'products.sort.topRated' : 'Augstākais Reitings',
    'products.noProductsFound': 'Netika atrasts neviens produkts',
    
    // Cart
    'cart.title': 'Iepirkumu grozs',
    'cart.empty': 'Tavs grozs ir tukšs',
    'cart.emptyMessage': 'Pievieno dažus produktus savam grozam, un tie parādīsies šeit',
    'cart.continueShopping': 'Turpināt iepirkties',
    'cart.subtotal': 'Summa',
    'cart.shipping': 'Piegāde',
    'cart.total': 'Kopā',
    'cart.checkout': 'Doties uz kasi',
    'cart.orderSummary': 'Pasūtījuma kopsavilkums',
    
    // Checkout
    'checkout.title': 'Norēķināšanās',
    'checkout.shippingAddress': 'Piegādes adrese',
    'checkout.billingAddress': 'Norēķinu adrese',
    'checkout.paymentMethod': 'Maksājuma veids',
    'checkout.orderSummary': 'Pasūtījuma kopsavilkums',
    'checkout.firstName': 'Vārds',
    'checkout.lastName': 'Uzvārds',
    'checkout.email': 'E-pasts',
    'checkout.phone': 'Tālrunis',
    'checkout.address': 'Adrese',
    'checkout.city': 'Pilsēta',
    'checkout.state': 'Novads/Reģions',
    'checkout.postalCode': 'Pasta indekss',
    'checkout.country': 'Valsts',
    'checkout.sameAsShipping': 'Tāda pati kā piegādes adrese',
    'checkout.cardNumber': 'Kartes numurs',
    'checkout.cardName': 'Vārds uz kartes',
    'checkout.expiryDate': 'Derīguma termiņš',
    'checkout.cvv': 'CVV',
    'checkout.placeOrder': 'Veikt pasūtījumu',
    'checkout.back': 'Atpakaļ',
    'checkout.next': 'Tālāk',
    'checkout.step': 'Solis',
    'checkout.of': 'no',
    'checkout.items': 'Preces',
    'checkout.shipping': 'Piegāde',
    'checkout.tax': 'Nodoklis',
    'checkout.total': 'Kopā',
    'checkout.orderSuccess': 'Pasūtījums veiksmīgi veikts!',
    'checkout.orderError': 'Kļūda veicot pasūtījumu. Lūdzu, mēģiniet vēlreiz.',
    'checkout.orderSuccessMessage': 'Paldies par jūsu pasūtījumu. Mēs esam saņēmuši jūsu maksājumu un drīzumā apstrādāsim jūsu pasūtījumu.',
    'checkout.returnToShopping': 'Atgriezties pie iepirkšanās',
    'checkout.viewOrder': 'Apskatīt pasūtījumu',
    'checkout.paymentProcessing': 'Maksājuma apstrāde...',
    'checkout.requiredField': 'Šis lauks ir obligāts',
    'checkout.invalidEmail': 'Lūdzu, ievadiet derīgu e-pasta adresi',
    'checkout.invalidPhone': 'Lūdzu, ievadiet derīgu tālruņa numuru',
    'checkout.invalidCard': 'Lūdzu, ievadiet derīgu kartes numuru',
    'checkout.invalidExpiry': 'Lūdzu, ievadiet derīgu derīguma termiņu',
    'checkout.invalidCVV': 'Lūdzu, ievadiet derīgu CVV',
    'checkout.contactInformation': 'Kontaktinformācija',
    'checkout.zipCode': 'Pasta indekss',
    'checkout.notes': 'Piezīmes',
    'checkout.backToCart': 'Atgriezties uz grozu',
    'checkout.specialInstructions': 'Jebkādas speciālas piezīmes jūsu pasūtījumam...',
    
    // Admin
    'admin.dashboard': 'Administrācijas panelis',
    'admin.welcome': 'Sveiks, {name}! Šeit ir pārskats par tavu veikalu.',
    'admin.products': 'Produkti',
    'admin.users': 'Lietotāji',
    'admin.orders': 'Pasūtījumi',
    'admin.settings': 'Iestatījumi',
    'admin.totalProducts': 'Kopējais produktu skaits',
    'admin.totalUsers': 'Kopējais lietotāju skaits',
    'admin.totalOrders': 'Kopējais pasūtījumu skaits',
    'admin.manageProducts': 'Pārvaldi savu produktu inventāru, pievieno jaunus produktus, atjaunini cenas un krājumu līmeņus.',
    'admin.manageUsers': 'Skati un pārvaldi lietotāju kontus, pārbaudi klientu informāciju un pirkumu vēsturi.',
    'admin.manageSettings': 'Konfigurē veikala iestatījumus, maksājumu metodes, piegādes opcijas un vairāk.',
    'admin.viewProducts': 'Skatīt produktus',
    'admin.viewUsers': 'Skatīt lietotājus',
    'admin.viewSettings': 'Skatīt iestatījumus',
    'admin.searchUsers': 'Meklēt lietotājus pēc vārda vai e-pasta...',
    'admin.joined': 'Pievienojās',
    'admin.noUsersFound': 'Nav atrasti lietotāji, kas atbilst meklēšanas kritērijiem.',
    'admin.subscriptions': 'Abonomenti',
    'admin.manageSubscriptions': 'Pārvaldi abonomentus, pievieno jaunus abonomentus, atjaunini cenas un abonomentu līmeņus.',
    'admin.viewSubscriptions': 'Skatīt abonomentus',
    'admin.searchSubscriptions': 'Meklēt abonomentus pēc vārda vai apraksta...',
    'admin.noSubscriptionsFound': 'Nav atrasti abonomenti, kas atbilst meklēšanas kritērijiem.',
    'admin.createSubscription': 'Izveidot abonomentu',
    'admin.backToSubscriptions': 'Atgriezties uz abonomentu sarakstu',
    'admin.subscriptionName': 'Abonomenta nosaukums',
    'admin.description': 'Abonomenta apraksts',
    'admin.price': 'Abonomenta cena',
    'admin.features': 'Abonomenta funkcijas',
    'admin.save': 'Saglabāt',
    'admin.cancel': 'Atcelt',
    'admin.addFeature': 'Pievienot funkciju',
    'admin.saveSubscription': 'Saglabāt abonomentu',
    'admin.fillSubscriptionDetails': 'Izveidojiet abonomentu',
    'admin.subscriptionDetails': 'Abonomenta apraksts',
    'admin.subscriptionFeatures': 'Abonomenta funkcijas',
    'admin.subscriptionPrice': 'Abonomenta cena',
    'admin.subscriptionDescription': 'Abonomenta apraksts',
  
    // Orders translations
    'admin.manageOrders': 'Skatiet un pārvaldiet visus klientu pasūtījumus, izsekojiet pasūtījumu statusu un izpildi.',
    'admin.viewOrders': 'Skatīt Pasūtījumus',
    'admin.searchOrders': 'Meklēt pasūtījumus pēc klienta vārda, e-pasta vai pasūtījuma ID...',
    'admin.noOrdersFound': 'Nav atrasts neviens pasūtījums, kas atbilst jūsu meklējumam.',
    'admin.orderId': 'Pasūtījuma ID',
    'admin.customer': 'Klients',
    'admin.amount': 'Summa',
    'admin.status': 'Statuss',
    'admin.date': 'Datums',
    'admin.orderStatus.pending': 'Gaida',
    'admin.orderStatus.processing': 'Apstrādā',
    'admin.orderStatus.shipped': 'Nosūtīts',
    'admin.orderStatus.delivered': 'Piegādāts',
    'admin.orderStatus.cancelled': 'Atcelts',
    'cart.quantity' : 'Daudzums',

    'welcome.back.home': 'Sveicināts atpakaļ, {name}! 👋',
    'see.latest.products': 'Jaunākie produkti',
    'see.latest.products.desc': 'Apskaties mūsu jaunākos produktus un sagatavojies uzlabot savu fitnesa ceļojumu.',
    'view.products.button': 'Skatīt produktus',
    'group.workout': 'Grupas treniņš',
    'group.workout.desc': 'Veic rezervāciju grupveida treniņam',
    'make.reservation': 'Veikt rezervāciju',
    'my.subscriptions': 'Mani abonomenti',
    'my.subscriptions.desc': 'Pārvaldi savus abonementus un apskati citas abonomentu iespējas.',
    'view.subscriptions': 'Skatīt abonementus',
    'my.orders': 'Mani pasūtījumi',
    'my.orders.desc': 'Skaties savu pasūtījumu vēsturi un pārvaldi pasūtījumus.',
    'view.orders': 'Skatīt pasūtījumus',
    
    // Training Sessions
    'sessions.title': 'Treniņu nodarbības',
    'sessions.loading': 'Ielādē grafiku...',
    'sessions.previousWeek': 'Iepriekšējā nedēļa',
    'sessions.nextWeek': 'Nākamā nedēļa',
    'sessions.currentWeek': 'Pašreizējā nedēļa',
    'sessions.noSessions': 'Nav plānotu nodarbību',
    'sessions.cancelled': 'Atcelts',
    'sessions.location': 'Vieta',
    'sessions.trainer': 'Treneris',
    'sessions.capacity': 'Ietilpība',
    'sessions.reservations': 'Rezervācijas',
    'sessions.addSession': 'Pievienot nodarbību',
    'sessions.editSession': 'Rediģēt nodarbību',
    'sessions.deleteSession': 'Dzēst nodarbību',
    'sessions.cancelSession': 'Atcelt nodarbību',
    'sessions.sessionTitle': 'Nodarbības nosaukums',
    'sessions.description': 'Apraksts',
    'sessions.startTime': 'Sākuma laiks',
    'sessions.endTime': 'Beigu laiks',
    'sessions.difficultyLevel': 'Grūtības pakāpe',
    'sessions.difficulty': 'Grūtība',
    'sessions.difficulty.beginner': 'Iesācējs',
    'sessions.difficulty.intermediate': 'Vidējs',
    'sessions.difficulty.advanced': 'Augsts',
    'sessions.type': 'Tips',
    'sessions.type.group': 'Grupa',
    'sessions.type.personal': 'Personīgs',
    'sessions.save': 'Saglabāt',
    'sessions.cancel': 'Atcelt',
    'sessions.delete': 'Dzēst',
    'sessions.confirmDelete': 'Vai tiešām vēlaties dzēst šo nodarbību?',
    'sessions.confirmCancel': 'Vai tiešām vēlaties atcelt šo nodarbību?',
    'sessions.success': 'Nodarbība veiksmīgi saglabāta',
    'sessions.error': 'Neizdevās saglabāt nodarbību',
    'sessions.deleteSuccess': 'Nodarbība veiksmīgi dzēsta',
    'sessions.deleteError': 'Neizdevās dzēst nodarbību',
    'sessions.cancelSuccess': 'Nodarbība veiksmīgi atcelta',
    'sessions.cancelError': 'Neizdevās atcelt nodarbību',
    'sessions.viewReservations': 'Skatīt rezervācijas',
    'sessions.reservationsTitle': 'Nodarbības rezervācijas',
    'sessions.reservationsCount': 'Rezervācijas: {count} / {capacity}',
    'sessions.date': 'Datums',
    'sessions.time': 'Laiks',
    'sessions.close': 'Aizvērt',
    'sessions.days.monday': 'Pirmdiena',
    'sessions.days.tuesday': 'Otrdiena',
    'sessions.days.wednesday': 'Trešdiena',
    'sessions.days.thursday': 'Ceturtdiena',
    'sessions.days.friday': 'Piektdiena',
    'sessions.days.saturday': 'Sestdiena',
    'sessions.days.sunday': 'Svētdiena',
    'sessions.full': 'Nodarbība ir pilna',
    'sessions.ended': 'Nodarbība ir beigusies',
    'sessions.noSessionsForDay': 'Šai dienai nav plānotu nodarbību',
    'common.cancel' : 'Atcelt',
    'common.save' : 'Saglabāt',
    'common.confirm' : 'Apstiprināt',
    'common.loading' : 'Ielādē...',	
    
    // Checkout
    'checkout.thankYou': 'Paldies par jūsu pasūtījumu',
    'checkout.orderConfirmation': 'Mēs esam saņēmuši jūsu maksājumu un drīzumā apstrādāsim jūsu pasūtījumu.',
    'checkout.orderDetails': 'Jūsu pasūtījuma detalizēta informācija un sekošanas informācija tiks nosūtīta jūsu e-pastā.',
    'checkout.shortly': 'drīzumā',
    'checkout.continueShopping': 'Turpināt iepirkšanās',
    'checkout.backToHome': 'Atgriezties uz sākumu',
    
    // Language
    'language.select': 'Izvēlies valodu',
    'language.english': 'Angļu',
    'language.latvian': 'Latviešu',

    // Reservations
    'reservations.createTitle': 'Veikt Rezervāciju',
    'reservations.cancelTitle': 'Atcelt Rezervāciju',
    'reservations.adminCancelTitle': 'Atcelt Treniņa Sesiju',
    'reservations.confirmCreate': 'Vai tiešām vēlaties rezervēt vietu šai sesijai?',
    'reservations.confirmCancel': 'Vai tiešām vēlaties atcelt šo rezervāciju?',
    'reservations.adminConfirmCancel': 'Vai tiešām vēlaties atcelt "{title}"? Visas rezervācijas tiks atceltas.',
    'reservations.cancelReason': 'Atcelšanas iemesls',
    'reservations.adminCancelReason': 'Sesijas atcelšanas iemesls',
    'reservations.cancelReasonPlaceholder': 'Lūdzu, norādiet atcelšanas iemeslu...',
    'reservations.adminCancelReasonPlaceholder': 'Lūdzu, norādiet sesijas atcelšanas iemeslu...',
    'reservations.reserveSpot': 'Rezervēt Vietu',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'lv' || savedLanguage === 'es')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[language][key] || key;
    
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{${paramKey}}`, paramValue);
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
