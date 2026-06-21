/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ad, FuelType, TransmissionType, VehicleCategory, User, UserRole, ChatRoom, FraudReport, Transaction } from "../types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Jean Dupont",
    email: "jean.dupont@gmail.com",
    role: UserRole.PARTICULIER,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
    phone: "06 12 34 56 78",
    location: "Paris (75)",
    joinedDate: "12 Mars 2026",
    subscription: {
      planId: "sub-part-5",
      name: "Particulier Pack 5",
      adsCount: 2,
      maxAds: 5,
      expiryDate: "2026-07-15",
    }
  },
  {
    id: "user-2",
    name: "Aero Motors SAS",
    email: "contact@aeromotors.fr",
    role: UserRole.PROFESSIONNEL,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop",
    phone: "01 45 67 89 10",
    location: "Lyon (69)",
    joinedDate: "05 Janvier 2026",
    subscription: {
      planId: "sub-pro-30",
      name: "Professionnel Pro 30",
      adsCount: 14,
      maxAds: 30,
      expiryDate: "2026-11-30",
    }
  },
  {
    id: "user-3",
    name: "Clara Martin",
    email: "clara.martin@orange.fr",
    role: UserRole.PARTICULIER,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop",
    phone: "07 89 45 12 23",
    location: "Marseille (13)",
    joinedDate: "22 Avril 2026",
  },
  {
    id: "admin-user",
    name: "Super Admin Vehi World",
    email: "admin@vehiworld.fr",
    role: UserRole.ADMIN,
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop",
    phone: "01 02 03 04 05",
    location: "Bordeaux (33)",
    joinedDate: "01 Janvier 2026",
  }
];

export const mockAds: Ad[] = [
  {
    id: "ad-1",
    title: "Porsche 911 Carrera S - État Concours",
    description: "Superbe Porsche 911 Carrera S type 992. Première main française, suivie exclusivement en Centre Porsche. Modèle non-fumeur, toujours couché en garage fermé sous bâche d'origine. Échappement sport déconnectable (PSE), toit ouvrant électrique en verre, jantes Carrera Classic 20/21 pouces, intérieur tout cuir étendu noir.",
    category: VehicleCategory.CAR,
    price: 124900,
    brand: "Porsche",
    model: "911 Carrera S",
    year: 2021,
    mileage: 26500,
    fuel: FuelType.ESSENCE,
    transmission: TransmissionType.AUTOMATIC,
    location: "Paris (75016)",
    latitude: 48.8627,
    longitude: 2.2876,
    images: [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format&fit=crop"
    ],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    isFeatured: true,
    status: "approved",
    sellerId: "user-1",
    sellerName: "Jean Dupont",
    sellerRole: UserRole.PARTICULIER,
    viewsCount: 342,
    createdDate: "2026-06-10",
    specifications: {
      "Puissance Din": "450 ch",
      "Cylindrée": "2 981 cm³",
      "Émission CO2": "205 g/km",
      "Nombre de portes": "2",
      "Places assises": "4",
      "Couleur extérieure": "Gris Craie",
    }
  },
  {
    id: "ad-2",
    title: "Ducati Streetfighter V4 S 1100",
    description: "Ducati Streetfighter V4 S de mai 2022 en état absolument parfait. Sort de révision annuelle en concession Ducati officielle (factures à l'appui). Suspensions électroniques Öhlins révisées, jantes forgées Marchesini en aluminium tricolore d'origine, silencieux homologué Akrapovič en titane, support de plaque court, clignotants LED dynamiques.",
    category: VehicleCategory.MOTO,
    price: 19500,
    brand: "Ducati",
    model: "Streetfighter V4 S",
    year: 2022,
    mileage: 7800,
    fuel: FuelType.ESSENCE,
    transmission: TransmissionType.MANUAL,
    location: "Lyon (69002)",
    latitude: 45.7578,
    longitude: 4.8351,
    images: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop"
    ],
    isFeatured: true,
    status: "approved",
    sellerId: "user-2",
    sellerName: "Aero Motors SAS",
    sellerRole: UserRole.PROFESSIONNEL,
    viewsCount: 189,
    createdDate: "2026-06-12",
    specifications: {
      "Puissance Din": "208 ch",
      "Cylindrée": "1 103 cm³",
      "Poids": "178 kg sans fluides",
      "Hauteur de selle": "845 mm",
      "Couleur": "Rouge Ducati Corse"
    }
  },
  {
    id: "ad-3",
    title: "Peugeot e-208 GT électrique",
    description: "Vente pour cause de double emploi. Peugeot e-208 en finition haut de gamme GT 100% électrique. Batterie 50 kWh garantissant une autonomie mixte WLTP de 340 km réels. Chargeur embarqué triphasé de 11 kW, régulateur vitesse adaptatif, phares full LED 3 griffes, écran tactile capacitif 10 pouces HD avec Apple CarPlay et Android Auto.",
    category: VehicleCategory.CAR,
    price: 24200,
    brand: "Peugeot",
    model: "e-208 GT",
    year: 2023,
    mileage: 18400,
    fuel: FuelType.ELECTRIC,
    transmission: TransmissionType.AUTOMATIC,
    location: "Marseille (13008)",
    latitude: 43.2678,
    longitude: 5.3854,
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop"
    ],
    isFeatured: false,
    status: "approved",
    sellerId: "user-3",
    sellerName: "Clara Martin",
    sellerRole: UserRole.PARTICULIER,
    viewsCount: 95,
    createdDate: "2026-06-15",
    specifications: {
      "Capacité batterie": "50 kWh autonomie réels",
      "Puissance moteur": "136 ch (100 kW)",
      "Vitesse max": "150 km/h",
      "Temps de recharge": "30 min sur borne 100 kW (80%)",
      "Garantie batterie": "8 ans ou 160 000 km"
    }
  },
  {
    id: "ad-4",
    title: "Renault Master III dCi L2H2",
    description: "Renault Master III L2H2 aménagé avec étagères professionnelles modulables, parfait commercial ou artisan plombier, électricien. Première main de décembre 2019, révision intégrale effectuée le mois dernier dans le réseau Renault Pro. TVA récupérable pour les assujettis. Régulateur de vitesse, radars arrière, climatisation.",
    category: VehicleCategory.UTILITY,
    price: 15900,
    brand: "Renault",
    model: "Master III dCi",
    year: 2019,
    mileage: 98600,
    fuel: FuelType.DIESEL,
    transmission: TransmissionType.MANUAL,
    location: "Vaulx-en-Velin (69120)",
    latitude: 45.7831,
    longitude: 4.9221,
    images: [
      "https://images.unsplash.com/photo-1516576881926-2183cae4cae6?w=800&auto=format&fit=crop"
    ],
    isFeatured: false,
    status: "approved",
    sellerId: "user-2",
    sellerName: "Aero Motors SAS",
    sellerRole: UserRole.PROFESSIONNEL,
    viewsCount: 78,
    createdDate: "2026-06-14",
    specifications: {
      "Volume utile": "10.8 m³",
      "Charge utile": "1 450 kg",
      "Crit'Air": "Classe 2 (Diesel récent)",
      "Puissance fiscale": "8 CV",
      "TVA récupérable": "Oui (prix HT 13 250 €)"
    }
  },
  {
    id: "ad-5",
    title: "Camion Benne Volvo FH 460 - 8x4",
    description: "Volvo FH 460 Multi-benne à bras hydraulique Marrel. Châssis renforcé pour travaux publics intensifs, boîte automatique i-shift avec réducteur chantier, ralentisseur VEB+, caméra de recul haute définition intégrée, climatisation de stationnement autonome. Double réservoir carburant, contrôle technique vierge.",
    category: VehicleCategory.TRUCK,
    price: 84000,
    brand: "Volvo",
    model: "FH 460",
    year: 2018,
    mileage: 245000,
    fuel: FuelType.DIESEL,
    transmission: TransmissionType.AUTOMATIC,
    location: "Rungis (94150)",
    latitude: 48.7492,
    longitude: 2.3486,
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop"
    ],
    isFeatured: false,
    status: "approved",
    sellerId: "user-2",
    sellerName: "Aero Motors SAS",
    sellerRole: UserRole.PROFESSIONNEL,
    viewsCount: 31,
    createdDate: "2026-06-16",
    specifications: {
      "Norme Euro": "Euro VI",
      "Essieux": "Configuration 8x4 renforcée",
      "Benne": "Ampliroll Marrel 20t",
      "Cabine": "Couchette de stationnement"
    }
  },
  {
    id: "ad-6",
    title: "Tracteur Agricole John Deere 6155R",
    description: "Tracteur John Deere 6155R très soigné d'exploitation maraîchère. Heures moteur : 3100 h certified. Pont avant suspendu TLS Plus, cabine sur suspensions pneumatiques actives, relevage avant d'origine avec prise de force. Écrans tactiles CommandCenter 10 pouces, guidage GPS StarFire 6000 AutoTrac ready.",
    category: VehicleCategory.AGRICULTURAL,
    price: 79500,
    brand: "John Deere",
    model: "6155R",
    year: 2020,
    mileage: 3100, // Heures pour matériel agricole
    fuel: FuelType.DIESEL,
    transmission: TransmissionType.AUTOMATIC,
    location: "Reims (51100)",
    latitude: 49.2583,
    longitude: 4.0317,
    images: [
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop"
    ],
    isFeatured: false,
    status: "approved",
    sellerId: "user-2",
    sellerName: "Aero Motors SAS",
    sellerRole: UserRole.PROFESSIONNEL,
    viewsCount: 45,
    createdDate: "2026-06-11",
    specifications: {
      "Puissance nominale": "155 ch (max 172 ch)",
      "Hydraulique": "Pompe PFC 114 L/min",
      "Distributeurs": "4 distributeurs à commande électrique",
      "Heures réelles": "3 120 h certifiées"
    }
  },
  {
    id: "ad-7",
    title: "Camping-Car Chausson 720 Titanium",
    description: "Magnifique profilé de marque Chausson, modèle 720 Titanium Premium. Motorisation Ford Transit 170ch fiable et dynamique en boîte automatique séquentielle. Salon Smart Lounge très spacieux face-à-face, lit de pavillon électrique (2 places) + lits superposés réglables EasyBox à l'arrière. Douche séparée, grand réfrigérateur tri-mixte auto 141L.",
    category: VehicleCategory.CAMPER,
    price: 54900,
    brand: "Chausson",
    model: "720 Titanium",
    year: 2021,
    mileage: 29800,
    fuel: FuelType.DIESEL,
    transmission: TransmissionType.AUTOMATIC,
    location: "Nantes (44000)",
    latitude: 47.2184,
    longitude: -1.5536,
    images: [
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&auto=format&fit=crop"
    ],
    isFeatured: true,
    status: "approved",
    sellerId: "user-3",
    sellerName: "Clara Martin",
    sellerRole: UserRole.PARTICULIER,
    viewsCount: 154,
    createdDate: "2026-06-08",
    specifications: {
      "Longueur totale": "7.19 m",
      "Places Carte Grise": "5 places autorisées",
      "Places couchage": "5 lits réels",
      "Énergies aménagement": "Chauffage chauffe-eau sur carburant",
      "Accessoires": "Panneau solaire 140W, caméra recul, store extérieur"
    }
  },
  {
    id: "ad-8",
    title: "Voilier Jeanneau Sun Odyssey 349",
    description: "Jeanneau Sun Odyssey 349 en version 2 cabines très logeable et claire, tirant d'eau standard 1.98m de 2017. Première main de croisière familiale, jamais loué ni régaté. Moteur Diesel Yanmar 3YM20 (21ch - 480 heures de fonctionnement). Voiles d'origine révisées par maître voilier, Centrale de navigation B&G Triton, pilote automatique.",
    category: VehicleCategory.BOAT,
    price: 110000,
    brand: "Jeanneau",
    model: "Sun Odyssey 349",
    year: 2017,
    mileage: 480, // Heures moteur de bateau
    fuel: FuelType.DIESEL,
    transmission: TransmissionType.MANUAL,
    location: "La Rochelle (17000)",
    latitude: 46.1603,
    longitude: -1.1511,
    images: [
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&auto=format&fit=crop"
    ],
    isFeatured: false,
    status: "approved",
    sellerId: "user-1",
    sellerName: "Jean Dupont",
    sellerRole: UserRole.PARTICULIER,
    viewsCount: 202,
    createdDate: "2026-06-05",
    specifications: {
      "Longueur de coque": "9.97 m",
      "Largeur de maître-bau": "3.44 m",
      "Tirant d'eau": "1.98 m performance",
      "Chauffage": "Air pulsé Webasto cabine et carré",
      "Réservoir d'eau": "206 L d'eau douce"
    }
  },
  {
    id: "ad-9",
    title: "Jetski Yamaha FX Cruiser SVHO",
    description: "Jet-ski Yamaha FX Cruiser SVHO (moteur Super Vortex High Output de 250 ch). Version de luxe Cruiser avec selle à niveaux ergonomiques, système audio d'origine étanche Bluetooth intégré, écran couleur tactile 7 pouces avec GPS intégré. État neuf, rinçage soigné systématique après chaque sortie en eau salée avec du Stop Sel.",
    category: VehicleCategory.JETSKI,
    price: 18900,
    brand: "Yamaha",
    model: "FX Cruiser SVHO",
    year: 2022,
    mileage: 64, // heures réelles
    fuel: FuelType.ESSENCE,
    transmission: TransmissionType.AUTOMATIC,
    location: "Nice (06000)",
    latitude: 43.7102,
    longitude: 7.2620,
    images: [
      "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&auto=format&fit=crop"
    ],
    isFeatured: false,
    status: "approved",
    sellerId: "user-3",
    sellerName: "Clara Martin",
    sellerRole: UserRole.PARTICULIER,
    viewsCount: 115,
    createdDate: "2026-06-18",
    specifications: {
      "Puissance administrative": "20 CV",
      "Heures d'utilisation": "64 h d'utilisation",
      "Capacité réservoir": "70 L super-carburant",
      "Passagers": "3 places adultes",
      "Remorque comprise": "Oui (Riba galvanisée roulements lubrifiés)"
    }
  },
  {
    id: "ad-10",
    title: "Moustache Lundi 27.5 électrique - Ultra Soigné",
    description: "Vélo à assistance électrique (VAE) de la marque française de référence Moustache. Modèle Lundi 27.5 d'avril 2023. Guidon iconique ultra confortable type Moustache, moteur central Bosch Performance Line avec couple puissant de 65Nm. Batterie amovible Bosch PowerPack 500 Wh en parfait état sanitaire de 96% de santé.",
    category: VehicleCategory.BIKE,
    price: 2450,
    brand: "Moustache",
    model: "Lundi 27.5",
    year: 2023,
    mileage: 1200, // km parcourus
    fuel: FuelType.ELECTRIC,
    transmission: TransmissionType.AUTOMATIC,
    location: "Strasbourg (67000)",
    latitude: 48.5734,
    longitude: 7.7521,
    images: [
      "https://images.unsplash.com/photo-1571068316341-33ae27e45ad7?w=800&auto=format&fit=crop"
    ],
    isFeatured: false,
    status: "approved",
    sellerId: "user-1",
    sellerName: "Jean Dupont",
    sellerRole: UserRole.PARTICULIER,
    viewsCount: 88,
    createdDate: "2026-06-19",
    specifications: {
      "Transmission": "Envyolo progressive intégrée dans le moyeu",
      "Autonomie réelle": "Jusqu'à 120 km en mode Eco",
      "Moteur": "Bosch Performance 250W",
      "Poids": "25.2 kg accessoires inclus",
      "Accessoires": "Sacoches étanches Basil arrière offertes"
    }
  },
  {
    id: "ad-11",
    title: "Bus Mercedes Citaro Euro 6",
    description: "Annonce test validation en attente par l'administrateur. Excellent autocars de ligne urbaine Mercedes Citaro de 2016 en parfait état de fonctionnement.",
    category: VehicleCategory.BUS,
    price: 38000,
    brand: "Mercedes-Benz",
    model: "Citaro Urban",
    year: 2016,
    mileage: 382000,
    fuel: FuelType.DIESEL,
    transmission: TransmissionType.AUTOMATIC,
    location: "Toulouse (31000)",
    latitude: 43.6047,
    longitude: 1.4442,
    images: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop"
    ],
    isFeatured: false,
    status: "pending", // AD EN ATTENTE DE VALIDATION ADMIN
    sellerId: "user-2",
    sellerName: "Aero Motors SAS",
    sellerRole: UserRole.PROFESSIONNEL,
    viewsCount: 0,
    createdDate: "2026-06-20",
    specifications: {
      "Places debouts": "65 places",
      "Places assises": "32 places",
      "Accessibilité PMR": "Rampe d'accès télescopique électrique",
      "Norme anti-pollution": "Crit'Air Euro VI - AD Blue incluse"
    }
  }
];

export const mockChatRooms: ChatRoom[] = [
  {
    id: "room-1",
    adId: "ad-1",
    adTitle: "Porsche 911 Carrera S",
    adImage: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=150&auto=format&fit=crop",
    buyerId: "user-3", // Clara Martin is buyer
    buyerName: "Clara Martin",
    sellerId: "user-1", // Jean Dupont is seller
    sellerName: "Jean Dupont",
    unreadCountSec: 1, // seller has unread message from buyer
    unreadCountBuy: 0,
    lastUpdated: "2026-06-21T09:12:00Z",
    messages: [
      {
        id: "msg-1",
        senderId: "user-3",
        senderName: "Clara Martin",
        content: "Bonjour Jean, la Porsche est-elle toujours disponible ? Est-ce que le carnet d'entretien est à jour chez Porsche ?",
        timestamp: "2026-06-21T08:55:00Z"
      },
      {
        id: "msg-2",
        senderId: "user-1",
        senderName: "Jean Dupont",
        content: "Bonjour Clara, oui elle est disponible. Le carnet est 100% à jour, la dernière révision sort de chez Porsche Vélizy en avril dernier.",
        timestamp: "2026-06-21T09:05:00Z"
      },
      {
        id: "msg-3",
        senderId: "user-3",
        senderName: "Clara Martin",
        content: "Parfait ! Serait-il possible de convenir d'un rendez-vous ce samedi après-midi pour la voir de plus près et tester si cela vous convient ?",
        timestamp: "2026-06-21T09:12:00Z"
      }
    ]
  },
  {
    id: "room-2",
    adId: "ad-3",
    adTitle: "Peugeot e-208 GT électrique",
    adImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=150&auto=format&fit=crop",
    buyerId: "user-1", // Jean Dupont is buyer
    buyerName: "Jean Dupont",
    sellerId: "user-3", // Clara Martin is seller
    sellerName: "Clara Martin",
    unreadCountSec: 0,
    unreadCountBuy: 0,
    lastUpdated: "2026-06-20T18:30:00Z",
    messages: [
      {
        id: "m2-1",
        senderId: "user-1",
        senderName: "Jean Dupont",
        content: "Bonjour Clara, je serais intéressé pour la e-208 pour mon fils. Avez-vous réalisé le diagnostic santé SOH de la batterie ?",
        timestamp: "2026-06-20T18:10:00Z"
      },
      {
        id: "m2-2",
        senderId: "user-3",
        senderName: "Clara Martin",
        content: "Bonjour ! Oui, le diagnostic santé de batterie a été fait lors de la visite technique intermédiaire chez Peugeot, elle est à 99% de sa capacité !",
        timestamp: "2026-06-20T18:30:00Z"
      }
    ]
  }
];

export const mockFraudReports: FraudReport[] = [
  {
    id: "rep-1",
    adId: "ad-2",
    adTitle: "Ducati Streetfighter V4 S 1100",
    reporterName: "Inconnu anonyme",
    reason: "Prix anormalement bas par rapport à l'état général et suspicion de faux compte.",
    date: "2026-06-18",
    status: "pending"
  },
  {
    id: "rep-2",
    adId: "ad-6",
    adTitle: "Tracteur Agricole John Deere 6155R",
    reporterName: "Pierre Clavier",
    reason: "Utilisation abusive de mes photos d'annonce publiées sur AgriAffaires.",
    date: "2026-06-19",
    status: "pending"
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    userName: "Jean Dupont",
    type: "featured_upgrade",
    amount: 4.99,
    date: "2026-06-10 14:32",
    status: "succeeded",
    paymentMethod: "card",
    description: "Mise en avant optionnelle 30j - Porsche 911"
  },
  {
    id: "tx-2",
    userName: "Aero Motors SAS",
    type: "subscription",
    amount: 49.99,
    date: "2026-06-01 02:00",
    status: "succeeded",
    paymentMethod: "card",
    description: "Option Abonnement Mensuel Professionnel Pro 30"
  },
  {
    id: "tx-3",
    userName: "Clara Martin",
    type: "single_ad",
    amount: 9.99,
    date: "2026-06-08 19:10",
    status: "succeeded",
    paymentMethod: "paypal",
    description: "Publication d'annonce - Camping-Car Chausson"
  },
  {
    id: "tx-4",
    userName: "Jean Dupont",
    type: "subscription",
    amount: 19.99,
    date: "2026-06-15 11:45",
    status: "succeeded",
    paymentMethod: "card",
    description: "Option Abonnement Mensuel Particulier Pack 5"
  }
];
