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
    
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.cart': 'Cart',
    'nav.profile': 'Profile',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.admin': 'Admin Panel',
    
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
    // 'admin.startDate': 'Subscription Start Date',
    // 'admin.status': 'Subscription Status',
    'admin.save': 'Save',
    'admin.cancel': 'Cancel',
    'admin.addFeature': 'Add Feature',
    'admin.saveSubscription': 'Save Subscription',
    'admin.fillSubscriptionDetails': 'Fill Subscription Details',
    
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
    
    // Navigation
    'nav.home': 'Sākums',
    'nav.products': 'Produkti',
    'nav.cart': 'Grozs',
    'nav.profile': 'Profils',
    'nav.login': 'Ieiet',
    'nav.register': 'Reģistrēties',
    'nav.logout': 'Iziet',
    'nav.admin': 'Administrācijas panelis',
    
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
    
    // Profile
    'profile.title': 'Mans profils',
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
    'admin.viewSubscriptions': 'Skatīt abonējumus',
    'admin.searchSubscriptions': 'Meklēt abonējumus pēc vārda vai apraksta...',
    'admin.noSubscriptionsFound': 'Nav atrasti abonējumi, kas atbilst meklēšanas kritērijiem.',
    'admin.createSubscription': 'Izveidot abonējumu',
    'admin.backToSubscriptions': 'Atgriezties uz abonējumu sarakstu',
    'admin.subscriptionName': 'Abonējuma nosaukums',
    'admin.description': 'Abonējuma apraksts',
    'admin.price': 'Abonējuma cena',
    'admin.features': 'Abonējuma funkcijas',
    'admin.save': 'Saglabāt',
    'admin.cancel': 'Atcelt',
    'admin.addFeature': 'Pievienot funkciju',
    'admin.saveSubscription': 'Saglabāt abonējumu',
    'admin.fillSubscriptionDetails': 'Izveidojiet abonējumu',
    'admin.subscriptionDetails': 'Abonējuma apraksts',
    'admin.subscriptionFeatures': 'Abonējuma funkcijas',
    'admin.subscriptionPrice': 'Abonējuma cena',
    'admin.subscriptionName': 'Abonējuma nosaukums',
    'admin.subscriptionDescription': 'Abonējuma apraksts',
    'admin.subscriptionFeatures': 'Abonējuma funkcijas',
    'admin.subscriptionPrice': 'Abonējuma cena',
    
    
    
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
