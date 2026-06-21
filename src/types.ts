/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum VehicleCategory {
  CAR = "Voitures",
  MOTO = "Motos",
  UTILITY = "Utilitaires",
  TRUCK = "Camions",
  AGRICULTURAL = "Engins agricoles",
  CAMPER = "Camping-cars",
  BOAT = "Bateaux",
  JETSKI = "Jets-skis",
  BUS = "Bus et autocars",
  BIKE = "Vélos électriques",
}

export enum FuelType {
  ESSENCE = "Essence",
  DIESEL = "Diesel",
  HYBRID = "Hybride",
  ELECTRIC = "Électrique",
  GPL = "GPL",
}

export enum TransmissionType {
  MANUAL = "Manuelle",
  AUTOMATIC = "Automatique",
}

export enum UserRole {
  PARTICULIER = "Particulier",
  PROFESSIONNEL = "Professionnel",
  ADMIN = "Administrateur",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  subscription?: {
    planId: string;
    name: string;
    adsCount: number;
    maxAds: number;
    expiryDate: string;
  };
  phone?: string;
  location?: string;
  joinedDate: string;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  category: VehicleCategory;
  price: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuel: FuelType;
  transmission: TransmissionType;
  location: string;
  latitude: number;
  longitude: number;
  images: string[];
  videoUrl?: string;
  isFeatured: boolean; // Option payante de mise en avant
  status: "pending" | "approved" | "rejected";
  sellerId: string;
  sellerName: string;
  sellerRole: UserRole;
  viewsCount: number;
  createdDate: string;
  specifications: Record<string, string>; // Extra-specific details (power, doors, draft for boat, etc.)
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface ChatRoom {
  id: string;
  adId: string;
  adTitle: string;
  adImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  messages: ChatMessage[];
  unreadCountSec: number; // unread count for seller
  unreadCountBuy: number; // unread count for buyer
  lastUpdated: string;
}

export interface FraudReport {
  id: string;
  adId: string;
  adTitle: string;
  reporterName: string;
  reason: string;
  date: string;
  status: "pending" | "resolved";
}

export interface Transaction {
  id: string;
  userName: string;
  type: "single_ad" | "featured_upgrade" | "subscription";
  amount: number;
  date: string;
  status: "succeeded" | "pending" | "failed";
  paymentMethod: "card" | "paypal";
  description: string;
}
