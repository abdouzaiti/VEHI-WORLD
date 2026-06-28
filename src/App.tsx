/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Car, Bike, Truck, Ship, Calendar, Compass, Fuel, HelpCircle, Heart, 
  Scale, MessageSquare, LayoutDashboard, MapPin, Sparkles, Filter, Bus, Anchor,
  ShieldCheck, CheckCircle, Award, Headphones
} from "lucide-react";
import { 
  Ad, ChatMessage, ChatRoom, FraudReport, Transaction, User, UserRole, 
  VehicleCategory, FuelType, TransmissionType 
} from "./types";
import { 
  mockAds, mockChatRooms, mockFraudReports, mockTransactions, mockUsers 
} from "./data/mockData";

import Navbar from "./components/Navbar";
import VehicleListingFilters, { FilterState } from "./components/VehicleListingFilters";
import AdCard from "./components/AdCard";
import AdDetails from "./components/AdDetails";
import SellVehicleForm, { CreateAdPayload } from "./components/SellVehicleForm";
import VehicleComparer from "./components/VehicleComparer";
import MessageCenter from "./components/MessageCenter";
import AdminDashboard from "./components/AdminDashboard";
import MotionIntro from "./components/MotionIntro";

export default function App() {
  // Navigation State
  const [showIntro, setShowIntro] = React.useState<boolean>(true);
  const [currentView, setCurrentView] = React.useState<string>("acheter");
  const [selectedAd, setSelectedAd] = React.useState<Ad | null>(null);

  // Core Stateful DB with LocalStorage fallbacks
  const [users, setUsers] = React.useState<User[]>(() => {
    const saved = localStorage.getItem("veloce_users");
    return saved ? JSON.parse(saved) : mockUsers;
  });

  const [ads, setAds] = React.useState<Ad[]>(() => {
    const saved = localStorage.getItem("veloce_ads");
    return saved ? JSON.parse(saved) : mockAds;
  });

  const [chatRooms, setChatRooms] = React.useState<ChatRoom[]>(() => {
    const saved = localStorage.getItem("veloce_chatrooms");
    return saved ? JSON.parse(saved) : mockChatRooms;
  });

  const [reports, setReports] = React.useState<FraudReport[]>(() => {
    const saved = localStorage.getItem("veloce_reports");
    return saved ? JSON.parse(saved) : mockFraudReports;
  });

  const [transactions, setTransactions] = React.useState<Transaction[]>(() => {
    const saved = localStorage.getItem("veloce_transactions");
    return saved ? JSON.parse(saved) : mockTransactions;
  });

  // Current session simulation: default Jean Dupont (Particulier)
  const [currentUser, setCurrentUser] = React.useState<User>(() => users[0]);

  // Premium Toast Notification System
  const [toast, setToast] = React.useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  const showToast = React.useCallback((message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
  }, []);

  React.useEffect(() => {
    (window as any).showAppToast = showToast;
    return () => {
      delete (window as any).showAppToast;
    };
  }, [showToast]);

  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Favorites list state (Stored by IDs)
  const [favorites, setFavorites] = React.useState<string[]>(() => {
    const saved = localStorage.getItem("veloce_favs");
    return saved ? JSON.parse(saved) : ["ad-1", "ad-3"];
  });

  // Comparison checklist (Stored by IDs)
  const [comparisonList, setComparisonList] = React.useState<string[]>(() => {
    const saved = localStorage.getItem("veloce_compara");
    return saved ? JSON.parse(saved) : [];
  });

  // Filter parameters state
  const initialFilters: FilterState = {
    searchQuery: "",
    category: "all",
    brand: "",
    model: "",
    priceMin: "",
    priceMax: "",
    yearMin: "",
    yearMax: "",
    mileageMax: "",
    fuel: "all",
    transmission: "all",
    location: "",
  };
  const [filters, setFilters] = React.useState<FilterState>(initialFilters);

  // Sync state mutations to LocalStorage immediately
  React.useEffect(() => {
    localStorage.setItem("veloce_users", JSON.stringify(users));
  }, [users]);

  React.useEffect(() => {
    localStorage.setItem("veloce_ads", JSON.stringify(ads));
  }, [ads]);

  React.useEffect(() => {
    localStorage.setItem("veloce_chatrooms", JSON.stringify(chatRooms));
  }, [chatRooms]);

  React.useEffect(() => {
    localStorage.setItem("veloce_reports", JSON.stringify(reports));
  }, [reports]);

  React.useEffect(() => {
    localStorage.setItem("veloce_transactions", JSON.stringify(transactions));
  }, [transactions]);

  React.useEffect(() => {
    localStorage.setItem("veloce_favs", JSON.stringify(favorites));
  }, [favorites]);

  React.useEffect(() => {
    localStorage.setItem("veloce_compara", JSON.stringify(comparisonList));
  }, [comparisonList]);

  // Get list of distinct brands currently on the catalog for filters
  const availableBrands = React.useMemo(() => {
    const bSet = new Set<string>();
    ads.forEach((ad) => {
      if (ad.status === "approved" && ad.brand) bSet.add(ad.brand);
    });
    return Array.from(bSet);
  }, [ads]);

  // Handle switching active simulated profile context
  const handleLoginAs = (role: UserRole) => {
    const matched = users.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      showToast(`Profil changé ! Connecté en tant que ${matched.name} (${role === UserRole.ADMIN ? "Administrateur" : role === UserRole.PROFESSIONNEL ? "Professionnel" : "Particulier"}).`, "success");
    }
  };

  const handleLogout = () => {
    showToast("Déconnexion simulée. Retour au compte Particulier.", "info");
    const unmatched = users.find((u) => u.role === UserRole.PARTICULIER);
    if (unmatched) setCurrentUser(unmatched);
  };

  // Favorites toggle controller
  const handleToggleFavorite = (adId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(adId);
      if (isFav) {
        showToast("Annonce retirée des favoris.", "info");
        return prev.filter((id) => id !== adId);
      } else {
        showToast("Annonce ajoutée aux favoris ! ❤️", "success");
        return [...prev, adId];
      }
    });
  };

  // Comparison toggle controller
  const handleToggleComparison = (adId: string) => {
    setComparisonList((prev) => {
      const isIncluded = prev.includes(adId);
      if (isIncluded) {
        showToast("Véhicule retiré du comparateur.", "info");
        return prev.filter((id) => id !== adId);
      } else {
        if (prev.length >= 3) {
          showToast("Vous pouvez comparer un maximum de 3 véhicules simultanément.", "error");
          return prev;
        }
        showToast("Véhicule ajouté au comparateur ! ⚖️", "success");
        return [...prev, adId];
      }
    });
  };

  // Add new ad (Submitting from form wizard)
  const handlePublishAd = (payload: CreateAdPayload, paymentAmount: number) => {
    // Generate unique ID
    const newId = `ad-custom-${Math.random().toString(36).substr(2, 9)}`;

    const newAd: Ad = {
      id: newId,
      ...payload,
      latitude: 48.8566 + (Math.random() - 0.5) * 0.2,
      longitude: 2.3522 + (Math.random() - 0.5) * 0.2,
      status: "pending", // ALWAYS SUBMIT UNDER REVIEW SO ADMIN CAN APPROVE/REJECT
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerRole: currentUser.role,
      viewsCount: 0,
      createdDate: new Date().toISOString().split("T")[0],
    };

    // Store in general catalog
    setAds((prev) => [newAd, ...prev]);

    // Track Stripe/PayPal invoice records
    const newTx: Transaction = {
      id: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userName: currentUser.name,
      type: payload.isFeatured ? "featured_upgrade" : "single_ad",
      amount: paymentAmount,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "succeeded",
      paymentMethod: "card",
      description: `Frais de dépôt - ${payload.brand} ${payload.model}`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Reset view bounds or display successful check
    // Managed inside form wizard itself!
  };

  // Contact Seller Form Submit: Creates/Opens Instant ChatRoom
  const handleContactSellerInput = (initialMessageText: string) => {
    if (!selectedAd) return;

    // Check if channel already exists between active user and seller
    const existingRoom = chatRooms.find(
      (room) => room.adId === selectedAd.id && room.buyerId === currentUser.id
    );

    if (existingRoom) {
      // Append message
      const nextMsg: ChatMessage = {
        id: `msg-${Math.random().toString(36).substr(2, 9)}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: initialMessageText,
        timestamp: new Date().toISOString(),
      };

      setChatRooms((prev) =>
        prev.map((r) =>
          r.id === existingRoom.id
            ? {
                ...r,
                messages: [...r.messages, nextMsg],
                unreadCountSec: r.unreadCountSec + 1,
                lastUpdated: new Date().toISOString(),
              }
            : r
        )
      );

      setCurrentView("messagerie");
    } else {
      // Build completely new ChatRoom channel
      const newRoom: ChatRoom = {
        id: `room-${Math.random().toString(36).substr(2, 9)}`,
        adId: selectedAd.id,
        adTitle: selectedAd.title,
        adImage: selectedAd.images[0],
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        sellerId: selectedAd.sellerId,
        sellerName: selectedAd.sellerName,
        unreadCountSec: 1,
        unreadCountBuy: 0,
        lastUpdated: new Date().toISOString(),
        messages: [
          {
            id: `msg-first-${Math.random().toString(36).substr(2, 9)}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            content: initialMessageText,
            timestamp: new Date().toISOString(),
          },
        ],
      };

      setChatRooms((prev) => [newRoom, ...prev]);
      setCurrentView("messagerie");
    }
  };

  // Community Fraud signal report handler
  const handleReportAdSubmit = (reasonText: string) => {
    if (!selectedAd) return;
    const nextRep: FraudReport = {
      id: `rep-custom-${Math.random().toString(36).substr(2, 9)}`,
      adId: selectedAd.id,
      adTitle: selectedAd.title,
      reporterName: currentUser.name,
      reason: reasonText,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    };
    setReports((prev) => [nextRep, ...prev]);
  };

  // Write new chat message inside Chat interface
  const handleWriteChatMessage = (roomId: string, text: string) => {
    const nextMsg: ChatMessage = {
      id: `msg-${Math.random().toString(36).substr(2, 9)}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: text,
      timestamp: new Date().toISOString(),
    };

    setChatRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          const isMeSeller = r.sellerId === currentUser.id;
          return {
            ...r,
            messages: [...r.messages, nextMsg],
            unreadCountSec: isMeSeller ? r.unreadCountSec : r.unreadCountSec + 1,
            unreadCountBuy: isMeSeller ? r.unreadCountBuy + 1 : r.unreadCountBuy,
            lastUpdated: new Date().toISOString(),
          };
        }
        return r;
      })
    );
  };

  // Automated typing robot answering system: Auto responses matching French automobile lingo
  const handleTriggerAutomatedReply = (roomId: string) => {
    const activeRoom = chatRooms.find((r) => r.id === roomId);
    if (!activeRoom) return;

    const interlocuteurName = currentUser.id === activeRoom.sellerId ? activeRoom.buyerName : activeRoom.sellerName;
    const interlocuteurId = currentUser.id === activeRoom.sellerId ? activeRoom.buyerId : activeRoom.sellerId;

    // Find target vehicle details to build rich automated answers
    const relatedAd = ads.find((a) => a.id === activeRoom.adId);
    
    // Choose dynamic response matching text queries
    const responsesPool = [
      `Bonjour ! Merci pour l'intérêt porté à mon annonce. Oui, le prix est légèrement négociable devant le véhicule si la vente se fait rapidement.`,
      `Bonjour, aucun problème, le contrôle technique de moins de 6 mois est totalement vierge. Je dispose d'un dossier complet de factures du réseau constructeur d'entretien.`,
      `Entendu, je suis disponible pour vous faire faire un essai routier samedi après-midi ou lundi en fin de journée. Quel créneau vous conviendrait le mieux ?`,
      `Bonjour ! Le réservoir a été vérifié et nettoyé, la carrosserie n'a aucune rayure ni impact majeur. n'hésitez pas à me téléphoner au numéro affiché.`,
    ];
    
    // Select index randomly
    const phrase = responsesPool[Math.floor(Math.random() * responsesPool.length)];

    const responseMsg: ChatMessage = {
      id: `msg-robot-${Math.random().toString(36).substr(2, 9)}`,
      senderId: interlocuteurId,
      senderName: interlocuteurName,
      content: phrase,
      timestamp: new Date().toISOString(),
    };

    setChatRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? {
              ...r,
              messages: [...r.messages, responseMsg],
              unreadCountBuy: currentUser.id === r.buyerId ? r.unreadCountBuy + 1 : r.unreadCountBuy,
              unreadCountSec: currentUser.id === r.sellerId ? r.unreadCountSec + 1 : r.unreadCountSec,
              lastUpdated: new Date().toISOString(),
            }
          : r
      )
    );
  };

  // ADMINISTRATIVE CONTROLS
  // 1. Approve Pending Ad Listing
  const handleApproveAd = (adId: string) => {
    setAds((prev) =>
      prev.map((ad) => (ad.id === adId ? { ...ad, status: "approved" } : ad))
    );
    showToast("Annonce approuvée avec succès ! Elle est désormais active en ligne.", "success");
  };

  // 2. Reject/Remove Ad
  const handleRejectAd = (adId: string) => {
    setAds((prev) => prev.filter((ad) => ad.id !== adId));
    showToast("Annonce rejetée et retirée de la file d'attente de modération.", "info");
  };

  // 3. Resolve fraud complaints
  const handleResolveFraudReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: "resolved" } : r))
    );
    showToast("Le signalement de fraude a été marqué résolu et archivé.", "success");
  };

  // Search filtration routine matching current filters
  const filteredAds = React.useMemo(() => {
    return ads.filter((ad) => {
      // Must be approved to appear in Buyer view, except if we belong to the active profile's own listings
      if (ad.status !== "approved" && ad.sellerId !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
        return false;
      }

      // Keyword search matches title, brand or model
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = ad.title.toLowerCase().includes(query);
        const matchesDesc = ad.description.toLowerCase().includes(query);
        const matchesBrand = ad.brand.toLowerCase().includes(query);
        const matchesModel = ad.model.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesBrand && !matchesModel) return false;
      }

      // Category exact matches
      if (filters.category !== "all" && ad.category !== filters.category) {
        return false;
      }

      // Brand select matches
      if (filters.brand && ad.brand.toLowerCase() !== filters.brand.toLowerCase()) {
        return false;
      }

      // Model input matches
      if (filters.model) {
        const modelQuery = filters.model.toLowerCase();
        if (!ad.model.toLowerCase().includes(modelQuery)) {
          return false;
        }
      }

      // Coordinates/Location string match
      if (filters.location) {
        const locQuery = filters.location.toLowerCase();
        if (!ad.location.toLowerCase().includes(locQuery)) return false;
      }

      // Price limits
      if (filters.priceMin && ad.price < parseFloat(filters.priceMin)) return false;
      if (filters.priceMax && ad.price > parseFloat(filters.priceMax)) return false;

      // Year limits
      if (filters.yearMin && ad.year < parseInt(filters.yearMin)) return false;
      if (filters.yearMax && ad.year > parseInt(filters.yearMax)) return false;

      // Mileage limit
      if (filters.mileageMax && ad.mileage > parseFloat(filters.mileageMax)) return false;

      // Fuel motorization match
      if (filters.fuel !== "all" && ad.fuel !== filters.fuel) return false;

      // Gearbox match
      if (filters.transmission !== "all" && ad.transmission !== filters.transmission) return false;

      return true;
    });
  }, [ads, filters, currentUser]);

  const approvedCount = React.useMemo(() => {
    return ads.filter((ad) => ad.status === "approved").length;
  }, [ads]);

  // Total count of accumulated unread inbox chats for top badges
  const globalUnreadCount = React.useMemo(() => {
    return chatRooms.reduce((acc, curr) => {
      if (currentUser.id === curr.sellerId) {
        return acc + curr.unreadCountSec;
      } else {
        return acc + curr.unreadCountBuy;
      }
    }, 0);
  }, [chatRooms, currentUser]);

  // Match category icons
  const getCategoryIcon = (cat: VehicleCategory) => {
    switch (cat) {
      case VehicleCategory.CAR: return <Car className="h-4.5 w-4.5" />;
      case VehicleCategory.MOTO: return <Bike className="h-4.5 w-4.5" />;
      case VehicleCategory.UTILITY: return <Truck className="h-4.5 w-4.5" />;
      case VehicleCategory.TRUCK: return <Truck className="h-4.5 w-4.5" />;
      case VehicleCategory.AGRICULTURAL: return <Truck className="h-4.5 w-4.5" />;
      case VehicleCategory.CAMPER: return <Car className="h-4.5 w-4.5" />;
      case VehicleCategory.BOAT: return <Ship className="h-4.5 w-4.5" />;
      case VehicleCategory.JETSKI: return <Anchor className="h-4.5 w-4.5" />;
      case VehicleCategory.BUS: return <Bus className="h-4.5 w-4.5" />;
      case VehicleCategory.BIKE: return <Bike className="h-4.5 w-4.5" />;
      default: return <Car className="h-4.5 w-4.5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 select-none pb-20 md:pb-0">
      
      {showIntro && <MotionIntro onComplete={() => setShowIntro(false)} />}
      
      {/* Sleek Adaptive Navbar component */}
      <Navbar
        currentView={currentView}
        setCurrentView={(v) => {
          setCurrentView(v);
          setSelectedAd(null);
        }}
        currentUser={currentUser}
        unreadMessagesCount={globalUnreadCount}
        favoritesCount={favorites.length}
        comparisonCount={comparisonList.length}
        onLogout={handleLogout}
        onLoginAs={handleLoginAs}
      />

      {/* FULL-WIDTH Entrance Hero Section directly under navbar (no margins, goes edge-to-edge of the browser screen) */}
      {currentView === "acheter" && !selectedAd && (
        <div id="section-hero-cinematic" className="relative border-b border-slate-200/50 overflow-hidden flex flex-col justify-center w-full min-h-[480px] sm:min-h-[580px] py-10 sm:py-16 md:py-24 bg-slate-950 group">
          {/* Background Image with layered premium gradient overlay */}
          <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105">
            <img
              src="/back.png"
              alt="Luxury Sports Showroom"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent"></div>
          </div>

          {/* Centered inner content element to match alignment with max-w-7xl */}
          <div className="z-10 relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 sm:gap-12">
            
            {/* Top Section Details */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="font-sans font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-none uppercase drop-shadow-md">
                <span className="block text-slate-100">Trouvez votre</span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-slate-50 to-red-400">
                  prochain véhicule
                </span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-300 font-medium font-sans max-w-sm sm:max-w-2xl leading-relaxed">
                Explorez des milliers d'annonces de professionnels et particuliers à travers la France : 
                <span className="text-blue-400 font-bold"> Voitures</span>, 
                <span className="text-slate-100 font-bold"> Motos</span>, 
                <span className="text-red-400 font-bold"> Camions</span>, 
                <span className="text-blue-400 font-bold"> Utilitaires</span> et 
                <span className="text-slate-100 font-bold"> Bateaux</span>. 
                Profitez de notre paiement 100% sécurisé.
              </p>
            </div>

            {/* Bottom Left: Compact Quick Filters Form in WHITE */}
            <div className="w-full max-w-3xl">
              <div id="filter-panel" className="bg-white border border-slate-250 p-4 sm:p-6 rounded-2xl shadow-2xl text-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3.5">
                  <span className="text-[10px] sm:text-xs font-sans font-black tracking-wider text-[#2563EB] flex items-center gap-1.5 uppercase">
                    🔎 RECHERCHE RAPIDE
                  </span>
                  <button
                    onClick={() => setFilters(initialFilters)}
                    className="text-[9px] sm:text-xs text-red-500 hover:underline flex items-center space-x-1 cursor-pointer font-bold"
                  >
                    <span>🔄 Réinitialiser</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {/* General keywords query nested inside filter panel */}
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Rechercher par mot-clé (ex: Porsche, Toit ouvrant, Tesla...)"
                      value={filters.searchQuery}
                      onChange={(e) => setFilters((f) => ({ ...f, searchQuery: e.target.value }))}
                      className="w-full px-3 py-1.5 sm:py-2.5 pl-8 sm:pl-10 text-slate-950 placeholder-slate-400 text-[10px] sm:text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-sm focus:outline-none transition-all font-sans"
                    />
                    <span className="absolute left-2.5 sm:left-3.5 text-slate-400 text-[10px] sm:text-xs">🔍</span>
                  </div>

                  <div id="filters-form" className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {/* Marque */}
                    <div>
                      <label className="block text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Marque
                      </label>
                      <select
                        name="brand"
                        value={filters.brand}
                        onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
                        className="w-full px-2 py-1 sm:py-1.5 bg-slate-50 border border-slate-200 rounded-sm text-[10px] sm:text-xs text-slate-950 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Toutes</option>
                        {availableBrands.map((brand) => (
                          <option key={brand} value={brand} className="text-slate-950 bg-white">
                            {brand}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Modèle */}
                    <div>
                      <label id="model-label" className="block text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Modèle
                      </label>
                      <input
                        type="text"
                        name="model"
                        placeholder="Ex: Clio, Cayenne..."
                        value={filters.model}
                        onChange={(e) => setFilters((prev) => ({ ...prev, model: e.target.value }))}
                        className="w-full px-2 py-1 sm:py-1.5 bg-slate-50 border border-slate-200 rounded-sm text-[10px] sm:text-xs text-slate-950 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Budget max limit */}
                    <div>
                      <label className="block text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center justify-between">
                        <span>Budget Max (€)</span>
                      </label>
                      <input
                        type="number"
                        name="priceMax"
                        placeholder="Max €"
                        value={filters.priceMax}
                        onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: e.target.value }))}
                        className="w-full px-2 py-1 sm:py-1.5 bg-slate-50 border border-slate-200 rounded-sm text-[10px] sm:text-xs text-slate-950 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Carburant */}
                    <div>
                      <label className="block text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Carburant
                      </label>
                      <select
                        name="fuel"
                        value={filters.fuel}
                        onChange={(e) => setFilters((prev) => ({ ...prev, fuel: e.target.value as FuelType | "all" }))}
                        className="w-full px-2 py-1 sm:py-1.5 bg-slate-50 border border-slate-200 rounded-sm text-[10px] sm:text-xs text-slate-950 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="all">Tous</option>
                        {Object.values(FuelType).map((fuel) => (
                          <option key={fuel} value={fuel} className="text-slate-950 bg-white">
                            {fuel}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Boîte Vitesse */}
                    <div>
                      <label className="block text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Boîte Vitesse
                      </label>
                      <select
                        name="transmission"
                        value={filters.transmission}
                        onChange={(e) => setFilters((prev) => ({ ...prev, transmission: e.target.value as TransmissionType | "all" }))}
                        className="w-full px-2 py-1 sm:py-1.5 bg-slate-50 border border-slate-200 rounded-sm text-[10px] sm:text-xs text-slate-950 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="all">Toutes</option>
                        {Object.values(TransmissionType).map((trans) => (
                          <option key={trans} value={trans} className="text-slate-950 bg-white">
                            {trans}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Région */}
                    <div>
                      <label className="block text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Région
                      </label>
                      <input
                        type="text"
                        name="location"
                        placeholder="Ex: Paris, Lyon..."
                        value={filters.location}
                        onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                        className="w-full px-2 py-1 sm:py-1.5 bg-slate-50 border border-slate-200 rounded-sm text-[10px] sm:text-xs text-slate-950 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Main Body Scroller content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: Buyer Search & Categories Grid feed */}
        {currentView === "acheter" && (
          <div className="space-y-6 animate-fade-in">

            {/* horizontal scrolling categories buttons row (Ribbon Style) */}
            <div className="flex border border-slate-200 bg-slate-50 overflow-x-auto scrollbar-none rounded-sm" id="categories-carousel-row">
              <button
                onClick={() => setFilters((f) => ({ ...f, category: "all" }))}
                className={`flex-1 min-w-[125px] flex items-center justify-center border-r border-slate-200 py-3.5 px-4 gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider transition-colors ${
                  filters.category === "all"
                    ? "bg-white text-blue-700 font-extrabold border-b-2 border-b-blue-700"
                    : "text-slate-500 hover:bg-white hover:text-blue-700"
                }`}
              >
                <span>🚀 TOUT</span>
              </button>

              {Object.values(VehicleCategory).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilters((f) => ({ ...f, category: cat }))}
                  className={`flex-1 min-w-[125px] flex items-center justify-center border-r border-slate-200 py-3.5 px-4 gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider transition-colors ${
                    filters.category === cat
                      ? "bg-white text-blue-700 font-extrabold border-b-2 border-b-blue-700"
                      : "text-slate-500 hover:bg-white hover:text-blue-700"
                  }`}
                >
                  <span className="text-sm">{getCategoryIcon(cat)}</span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>

            {/* Flat Full-width layout for the Ads Grid since filters are now inline */}
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-sm border border-slate-200 text-xs">
                <p className="text-slate-500 font-medium">
                  <span className="font-extrabold text-[#002395]">{filteredAds.length}</span> véhicule{filteredAds.length > 1 ? "s" : ""} trouvé{filteredAds.length > 1 ? "s" : ""}.
                </p>
                <div className="text-slate-400 font-medium">
                  Vendeurs : 👤 Particulier • 💼 Professionnel
                </div>
              </div>

              {filteredAds.length === 0 ? (
                <div className="text-center py-20 bg-white border border-slate-200 p-8 rounded-sm" id="grid-empty-view">
                  <div className="text-4xl">🔍</div>
                  <p className="mt-4 text-base font-bold text-slate-900">Aucun véhicule ne correspond à vos filtres.</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-normal">
                    Essayez d'élargir votre budget, de réduire vos contraintes d'année ou de réinitialiser vos filtres de recherche.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="ads-listings-cards-grid">
                  {filteredAds.map((ad) => (
                    <AdCard
                      key={ad.id}
                      ad={ad}
                      isFavorite={favorites.includes(ad.id)}
                      isInComparison={comparisonList.includes(ad.id)}
                      onToggleFavorite={() => handleToggleFavorite(ad.id)}
                      onToggleComparison={() => handleToggleComparison(ad.id)}
                      onViewDetails={() => {
                        setSelectedAd(ad);
                        setCurrentView("details");
                      }}
                    />
                  ))}
                </div>
              )}

              {/* High-end Trust Badges row - Matched directly to the provided design image */}
              <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shadow-sm select-none" id="trust-markers-banner">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 text-[#2563EB] rounded-full shrink-0">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Véhicules vérifiés</h4>
                    <p className="text-xs text-slate-500 font-bold mt-0.5 leading-relaxed">Tous nos véhicules sont contrôlés.</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 text-[#2563EB] rounded-full shrink-0">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Paiement sécurisé</h4>
                    <p className="text-xs text-slate-500 font-bold mt-0.5 leading-relaxed">Transaction 100% sécurisée.</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 text-[#2563EB] rounded-full shrink-0">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Garantie incluse</h4>
                    <p className="text-xs text-slate-500 font-bold mt-0.5 leading-relaxed">Jusqu'à 24 mois de garantie.</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 text-[#2563EB] rounded-full shrink-0">
                    <Headphones className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Support dédié</h4>
                    <p className="text-xs text-slate-500 font-bold mt-0.5 leading-relaxed">Une équipe à votre écoute.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Detail inspection view */}
        {currentView === "details" && selectedAd && (
          <AdDetails
            ad={selectedAd}
            onBack={() => {
              setCurrentView("acheter");
              setSelectedAd(null);
            }}
            isFavorite={favorites.includes(selectedAd.id)}
            isInComparison={comparisonList.includes(selectedAd.id)}
            onToggleFavorite={() => handleToggleFavorite(selectedAd.id)}
            onToggleComparison={() => handleToggleComparison(selectedAd.id)}
            onContactSeller={handleContactSellerInput}
            onReportAd={handleReportAdSubmit}
          />
        )}

        {/* VIEW 3: Favorites screen list */}
        {currentView === "favoris" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-sans font-black text-xl text-slate-950 uppercase tracking-tight flex items-center space-x-2">
                <span>❤️</span>
                <span>Mes Véhicules Favoris ({favorites.length})</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">Retrouvez les annonces que vous avez mis de côté.</p>
            </div>

            {favorites.length === 0 ? (
              <div className="max-w-md mx-auto text-center py-16 space-y-4 bg-white border border-slate-200 p-8 rounded-sm">
                <span className="text-4xl text-rose-550 block">❤️</span>
                <h3 className="font-sans font-black text-lg text-slate-900 uppercase">Aucun favori</h3>
                <p className="text-sm text-slate-500 leading-normal">
                  Ajoutez des annonces en favoris en cliquant sur l'icône de cœur ❤️ sur les cartes de véhicules.
                </p>
                <button
                  onClick={() => setCurrentView("acheter")}
                  className="px-5 py-2.5 bg-[#002395] hover:bg-blue-800 text-white font-bold text-xs rounded-sm"
                >
                  Parcourir le catalogue
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ads
                  .filter((ad) => favorites.includes(ad.id))
                  .map((ad) => (
                    <AdCard
                      key={ad.id}
                      ad={ad}
                      isFavorite={true}
                      isInComparison={comparisonList.includes(ad.id)}
                      onToggleFavorite={() => handleToggleFavorite(ad.id)}
                      onToggleComparison={() => handleToggleComparison(ad.id)}
                      onViewDetails={() => {
                        setSelectedAd(ad);
                        setCurrentView("details");
                      }}
                    />
                  ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: Comparison tables */}
        {currentView === "comparaison" && (
          <VehicleComparer
            comparedAds={ads.filter((ad) => comparisonList.includes(ad.id))}
            onRemoveFromComparison={handleToggleComparison}
            onClearComparison={() => setComparisonList([])}
            onViewDetails={(ad) => {
              setSelectedAd(ad);
              setCurrentView("details");
            }}
          />
        )}

        {/* VIEW 5: Internal secure Message inbox channel */}
        {currentView === "messagerie" && (
          <MessageCenter
            chatRooms={chatRooms}
            currentUser={currentUser}
            onSendMessage={handleWriteChatMessage}
            onSimulateReply={handleTriggerAutomatedReply}
          />
        )}

        {/* VIEW 6: Sell vehicle ad form wizard */}
        {currentView === "vendre" && (
          <SellVehicleForm
            currentUser={currentUser}
            onPublish={handlePublishAd}
          />
        )}

        {/* VIEW 7: Admin oversight desks */}
        {currentView === "admin" && (
          <AdminDashboard
            users={users}
            ads={ads}
            reports={reports}
            transactions={transactions}
            onApproveAd={handleApproveAd}
            onRejectAd={handleRejectAd}
            onResolveReport={handleResolveFraudReport}
          />
        )}

      </main>

      {/* Corporate offset French footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-850 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="bg-[#002395] px-1 py-0.5 rounded text-white font-extrabold text-[10px]">V</div>
            <p className="font-bold text-white tracking-widest uppercase">
              VEHI WORLD <span className="text-[#ED2939]">.</span>
            </p>
          </div>
          <p className="text-slate-500 font-medium">
            © 2026 Vehi World. Tous droits réservés. Hébergé en France. Simulation Stripe & PayPal.
          </p>
        </div>
      </footer>

      {/* Modern Floating Responsive Toast Notification Above Bottom Nav */}
      {toast && (
        <div 
          id="app-global-toast"
          className={`fixed bottom-24 md:bottom-6 right-4 z-[9999] max-w-sm w-[calc(100%-2rem)] p-4 rounded-xl shadow-2xl border flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 ${
            toast.type === "success" 
              ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
              : toast.type === "error" 
              ? "bg-rose-50 border-rose-200 text-rose-900" 
              : "bg-blue-50 border-blue-200 text-blue-900"
          }`}
        >
          <div className="text-lg shrink-0 select-none">
            {toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : "⚡"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black font-sans uppercase tracking-wider">
              {toast.type === "success" ? "Notification" : toast.type === "error" ? "Alerte" : "Info"}
            </p>
            <p className="text-xs font-medium mt-0.5 opacity-90 leading-relaxed break-words">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 font-bold text-xs select-none shrink-0"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
