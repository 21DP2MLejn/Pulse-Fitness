'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'lv';

// Define translations interface
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Create translations object
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
    
    // Products
    'products.title': 'Products',
    'products.search': 'Search products...',
    'products.filter': 'Filter',
    'products.sort': 'Sort',
    'products.addToCart': 'Add to Cart',
    'products.addedToCart': 'Added to Cart',
    'products.outOfStock': 'Out of Stock',
    'products.inStock': 'In Stock',
    'products.features': 'Key Features',
    'products.specifications': 'Specifications',
    'products.reviews': 'Customer Reviews',
    'products.noReviews': 'No reviews yet. Be the first to review this product!',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.emptyMessage': 'Add some products to your cart and they will show up here',
    'cart.continueShopping': 'Continue Shopping',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    
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
    
    // Language
    'language.select': 'Select Language',
    'language.english': 'English',
    'language.latvian': 'Latvian',
  },
  lv: {
    // Common
    'app.name': 'Pulse Fitness',
    'app.tagline': 'Tavs ceļš uz veselīgāku dzīvesveidu sākas šeit',
    'app.loading': 'Ielāde...',
    'loading': 'Ielāde...',
    'error': 'Kļūda',
    'tryAgain': 'Mēģināt vēlreiz',

    // Home page
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
    
    // Products
    'products.title': 'Produkti',
    'products.search': 'Meklēt produktus...',
    'products.filter': 'Filtrēt',
    'products.sort': 'Kārtot',
    'products.addToCart': 'Pievienot grozam',
    'products.addedToCart': 'Pievienots grozam',
    'products.outOfStock': 'Nav noliktavā',
    'products.inStock': 'Ir noliktavā',
    'products.features': 'Galvenās iezīmes',
    'products.specifications': 'Specifikācijas',
    'products.reviews': 'Klientu atsauksmes',
    'products.noReviews': 'Vēl nav atsauksmju. Esi pirmais, kas novērtē šo produktu!',
    
    // Cart
    'cart.title': 'Iepirkumu grozs',
    'cart.empty': 'Tavs grozs ir tukšs',
    'cart.emptyMessage': 'Pievieno dažus produktus savam grozam, un tie parādīsies šeit',
    'cart.continueShopping': 'Turpināt iepirkties',
    'cart.subtotal': 'Starpsumma',
    'cart.shipping': 'Piegāde',
    'cart.total': 'Kopā',
    'cart.checkout': 'Doties uz kasi',
    
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
    'admin.subscriptions': 'Abonējumi',
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
    'admin.manageOrders': 'Skatiet un pārvaldiet visas klientu pasūtījumu, izsekojiet pasūtījumu statusu un izpildi.',
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
    
    // Language
    'language.select': 'Izvēlies valodu',
    'language.english': 'Angļu',
    'language.latvian': 'Latviešu',
  }
};

// Create language context
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'lv')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[language][key] || key;
    
    // Replace parameters if provided
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

// Create hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
