/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ArrowLeft, MapPin, Calendar, Compass, Fuel, User, Phone, MessageSquare, ShieldAlert, BadgeCheck, Sparkles, CreditCard, Play } from "lucide-react";
import { Ad, UserRole, ChatRoom, ChatMessage } from "../types";

interface AdDetailsProps {
  ad: Ad;
  onBack: () => void;
  isFavorite: boolean;
  isInComparison: boolean;
  onToggleFavorite: () => void;
  onToggleComparison: () => void;
  onContactSeller: (initialMessage: string) => void;
  onReportAd: (reason: string) => void;
}

export default function AdDetails({
  ad,
  onBack,
  isFavorite,
  isInComparison,
  onToggleFavorite,
  onToggleComparison,
  onContactSeller,
  onReportAd,
}: AdDetailsProps) {
  const [activeImageIdx, setActiveImageIdx] = React.useState(0);
  const [showPhone, setShowPhone] = React.useState(false);
  const [msgText, setMsgText] = React.useState("");
  const [reportText, setReportText] = React.useState("");
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "paypal">("card");
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);
  const [processingPayment, setProcessingPayment] = React.useState(false);

  // Card input details for simulation
  const [cardNumber, setCardNumber] = React.useState("4242 •••• •••• 4242");
  const [cardName, setCardName] = React.useState("");

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(p);
  };

  const formatMileage = (m: number, cat: string) => {
    if (cat === "Bateaux" || cat === "Jets-skis" || cat === "Engins agricoles") {
      return `${m} h`;
    }
    return `${m.toLocaleString("fr-FR")} km`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    onContactSeller(msgText);
    setMsgText("");
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    onReportAd(reportText);
    setReportText("");
    setShowReportModal(false);
    alert("Merci d'avoir signalé cette annonce. Notre équipe administrative va enquêter sous 24h.");
  };

  const handleSimulatedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingPayment(true);
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  return (
    <div id="ad-details-screen" className="space-y-6">
      {/* Back button and fast actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={onBack}
          id="btn-back-to-list"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-[#002395] hover:text-[#ED2939] transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour aux annonces</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleFavorite}
            id="details-favorite-toggle"
            className={`px-4 py-2 rounded-sm text-sm font-medium border flex items-center space-x-1.5 transition cursor-pointer ${
              isFavorite
                ? "bg-rose-50 border-rose-200 text-rose-600"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span>❤️ {isFavorite ? "Favori !" : "Mettre en Favori"}</span>
          </button>

          <button
            onClick={onToggleComparison}
            id="details-comparison-toggle"
            className={`px-4 py-2 rounded-sm text-sm font-medium border flex items-center space-x-1.5 transition cursor-pointer ${
              isInComparison
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span>⚖️ {isInComparison ? "Comparé" : "Ajouter au comparateur"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Info Slider and Quick summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Image browsers + specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Slider Cover */}
          <div className="bg-white border border-slate-200 rounded-sm p-2.5 shadow-sm">
            <div className="relative aspect-[16/10] bg-slate-100 rounded-sm overflow-hidden">
              <img
                src={ad.images[activeImageIdx]}
                alt={`${ad.title} - Image ${activeImageIdx + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {ad.isFeatured && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-red-600 text-white text-xs font-black px-3 py-1 rounded-sm shadow-lg">
                  ★ VÉHICULE EN VEDETTE
                </div>
              )}
            </div>

            {/* Thumbnails row */}
            {ad.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1" id="photo-thumbnails">
                {ad.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-24 aspect-video rounded-sm overflow-hidden border-2 flex-shrink-0 cursor-pointer ${
                      activeImageIdx === idx ? "border-[#002395] opacity-100 scale-95" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
            <h3 className="font-sans font-bold text-slate-900 text-lg mb-4">Description du véhicule</h3>
            <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">{ad.description}</p>
          </div>

          {/* Specifications Matrix */}
          <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
            <h3 className="font-sans font-bold text-slate-900 text-lg mb-4">Fiche technique détaillée</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-sm hover:bg-slate-100/70 transition">
                <span className="text-sm text-slate-500 font-medium">Marque</span>
                <span className="text-sm font-bold text-slate-900">{ad.brand}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-sm hover:bg-slate-100/70 transition">
                <span className="text-sm text-slate-500 font-medium">Modèle</span>
                <span className="text-sm font-bold text-slate-900">{ad.model}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-sm hover:bg-slate-100/70 transition">
                <span className="text-sm text-slate-500 font-medium">Année de sortie</span>
                <span className="text-sm font-bold text-slate-900">{ad.year}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-sm hover:bg-slate-100/70 transition">
                <span className="text-sm text-slate-500 font-medium">État kilométrique</span>
                <span className="text-sm font-bold text-slate-990 font-mono">
                  {formatMileage(ad.mileage, ad.category)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-sm hover:bg-slate-100/70 transition">
                <span className="text-sm text-slate-500 font-medium">Carburant / Énergie</span>
                <span className="text-sm font-bold text-slate-900">{ad.fuel}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-sm hover:bg-slate-100/70 transition">
                <span className="text-sm text-slate-500 font-medium">Boîte de vitesse</span>
                <span className="text-sm font-bold text-slate-900">{ad.transmission}</span>
              </div>

              {/* Specific specs from sub parameters */}
              {Object.entries(ad.specifications || {}).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-sm hover:bg-slate-100/70 transition col-span-1">
                  <span className="text-sm text-slate-500 font-medium capitalize">{key}</span>
                  <span className="text-sm font-bold text-slate-900 text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulated Video Player */}
          {ad.videoUrl && (
            <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
              <h3 className="font-sans font-bold text-slate-900 text-lg mb-4 flex items-center space-x-2">
                <Play className="h-5 w-5 text-[#ED2939]" />
                <span>Vidéo de présentation du véhicule</span>
              </h3>
              <div className="relative aspect-video bg-slate-900 rounded-sm overflow-hidden group/video flex items-center justify-center">
                <img
                  src={ad.images[0]}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[2px]"
                />
                <div className="relative z-10 text-center p-6 bg-black/60 rounded-sm max-w-sm mx-auto">
                  <Play className="h-14 w-14 text-white bg-red-600 hover:bg-red-700 hover:scale-110 p-4 rounded-full mx-auto mb-3 cursor-pointer transition" />
                  <p className="font-bold text-white text-sm">Regarder la démo simulée</p>
                  <p className="text-xs text-slate-350 mt-1">Lien de la vidéo d'annonce: {ad.videoUrl}</p>
                </div>
              </div>
            </div>
          )}

          {/* Geolocation small format */}
          <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-sm flex items-center justify-between text-sm text-slate-700">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-red-650 text-red-605 text-red-600" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">Localisation :</span>
              <span className="font-bold text-slate-900">{ad.location}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Lat: {ad.latitude ? ad.latitude.toFixed(2) : "48.85"} • Lon: {ad.longitude ? ad.longitude.toFixed(2) : "2.35"}
            </span>
          </div>
        </div>

        {/* Right Column: Price summary, Seller Info and Contact Forms */}
        <div className="col-span-1 space-y-6">
          {/* Main Pricing Box */}
          <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-red-950 text-white rounded-sm p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl transform -translate-x-10 translate-y-10"></div>

            <p className="text-xs uppercase font-extrabold tracking-widest text-[#ED2939] mb-1">PRIX EXCLUSIF EN LIGNE</p>
            <h2 className="font-sans font-black text-3xl tracking-tight text-white mb-2">
              {formatPrice(ad.price)}
            </h2>

            {/* Quick summary specs icons */}
            <div className="grid grid-cols-2 gap-3 mb-6 bg-white/5 p-4 rounded-sm border border-white/10 text-xs">
              <div>
                <span className="text-slate-400 block">Année</span>
                <span className="font-bold text-white text-sm">{ad.year}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Kilomètres</span>
                <span className="font-bold text-white text-sm font-mono">{formatMileage(ad.mileage, ad.category)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Moteur</span>
                <span className="font-bold text-white text-sm">{ad.fuel}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Boîte</span>
                <span className="font-bold text-white text-sm">{ad.transmission}</span>
              </div>
            </div>

            {/* Simulated Online Purchase */}
            <button
              onClick={() => {
                setPaymentSuccess(false);
                setShowPaymentModal(true);
              }}
              id="btn-details-stripe-checkout"
              className="w-full bg-[#ED2939] hover:bg-red-700 text-white py-3.5 px-4 rounded-sm font-bold text-sm transition-all shadow-md flex items-center justify-center space-x-2 animate-pulse cursor-pointer"
            >
              <CreditCard className="h-4.5 w-4.5" />
              <span>Acheter / Réserver en Ligne</span>
            </button>
            <p className="text-[10px] text-center text-slate-450 mt-2.5">
              Simulé via <span className="underline decoration-[#002395] font-bold">Stripe</span> & <span className="underline decoration-[#ED2939] font-bold">PayPal</span>
            </p>
          </div>

          {/* Seller Card Details */}
          <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm" id="seller-info-block">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop"
                alt={ad.sellerName}
                className="h-12 w-12 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-sans font-bold text-slate-900 text-base flex items-center">
                  <span>{ad.sellerName}</span>
                  {ad.sellerRole === UserRole.PROFESSIONNEL && (
                    <BadgeCheck className="h-5 w-5 text-blue-600 ml-1" />
                  )}
                </h4>
                <p className="text-xs text-slate-500 font-medium">Vendeur {ad.sellerRole}</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Call Reveal Option */}
              <button
                onClick={() => setShowPhone(!showPhone)}
                id="btn-reveal-seller-phone"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-sm text-sm font-semibold flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Phone className="h-4 w-4 text-slate-600" />
                <span>{showPhone ? "06 87 21 09 44" : "Afficher le numéro"}</span>
              </button>

              <hr className="border-slate-100" />

              {/* Messaging Quick Contact */}
              <h5 className="font-sans font-bold text-slate-800 text-sm mb-2">Contacter le vendeur en ligne</h5>
              <form onSubmit={handleSendMessage} className="space-y-3">
                <textarea
                  placeholder="Ex : Bonjour, je serais ravi d'obtenir un rendez-vous ce week-end pour essayer le véhicule."
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  id="details-contact-textarea"
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#002395] focus:bg-white resize-none transition"
                  required
                ></textarea>
                <button
                  type="submit"
                  id="btn-send-initial-message"
                  className="w-full bg-[#002395] hover:bg-blue-800 text-white py-3 rounded-sm text-sm font-semibold flex items-center justify-center space-x-2 cursor-pointer transition"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Envoyer un message interne</span>
                </button>
              </form>
            </div>
          </div>

          {/* Safety & Fraud Complaint */}
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 flex items-start space-x-2.5">
            <ShieldAlert className="h-5 w-5 text-[#ED2939] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-900 block">Protégez votre achat</p>
              <p className="text-[11px] text-slate-500">
                Ne transférez jamais de fonds directement sans garantie. Utilisez notre système de paiement sécurisé.
              </p>
              <button
                onClick={() => setShowReportModal(true)}
                className="text-[11px] text-[#ED2939] font-bold hover:underline mt-1.5 inline-block"
              >
                Signaler une fraude ou abus
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Signalement abus */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-sm max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center space-x-2 text-rose-600 mb-4">
              <ShieldAlert className="h-6 w-6" />
              <h4 className="font-sans font-bold text-lg text-slate-950">Signaler cette annonce</h4>
            </div>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <p className="text-xs text-slate-600">
                Aidez-nous à garder notre plateforme saine. Précisez la raison de votre signalement pour que les administrateurs inspectent le compte.
              </p>
              <textarea
                placeholder="Ex : Usurpation d'identité, prix manifestement frauduleux, contenu offensant..."
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                rows={4}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#ED2939]"
                required
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-sm hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ED2939] text-white text-sm font-semibold rounded-sm hover:bg-red-700"
                >
                  Confirmer le signalement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Stripe & PayPal checkout mockup */}
      {showPaymentModal && (
        <div id="payment-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-sm max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-hidden relative">
            {/* Top header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <div>
                <h4 className="font-black text-slate-950 text-base uppercase font-sans tracking-wide">
                  Paiement Sécurisé en Ligne
                </h4>
                <p className="text-xs text-slate-500">Intégration et traitement standard de la transaction</p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-black"
              >
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div className="text-center py-8 space-y-4" id="success-receipt">
                <div className="h-16 w-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-3xl">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-slate-900">Paiement Réussi !</h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  Votre acompte ou réservation de <span className="font-extrabold text-blue-600">{formatPrice(ad.price * 0.05)}</span> (5% de garantie) a été validé avec succès.
                </p>
                <div className="bg-slate-50 rounded-sm p-4 text-left font-mono text-xs text-slate-500 max-w-sm mx-auto space-y-1 border border-slate-100">
                  <p>ID transaction : <span className="font-bold text-slate-800">TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span></p>
                  <p>Bénéficiaire : {ad.sellerName}</p>
                  <p>Véhicule : {ad.title}</p>
                  <p>Date : {new Date().toLocaleString("fr-FR")}</p>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-6 py-2.5 bg-[#002395] hover:bg-blue-800 text-white text-sm font-semibold rounded-sm"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleSimulatedPayment} className="space-y-4">
                {/* Product Summary */}
                <div className="bg-slate-50 rounded-sm p-4 flex items-center justify-between border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <img src={ad.images[0]} className="h-12 w-12 rounded-sm object-cover" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{ad.title}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{ad.brand} {ad.model}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Total Réservation (5%)</p>
                    <p className="text-sm font-black text-[#002395]">{formatPrice(ad.price * 0.05)}</p>
                  </div>
                </div>

                {/* Integration Options Tabs */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`py-2 px-3 border rounded-sm text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer ${
                      paymentMethod === "card"
                        ? "border-[#002395] bg-blue-50/50 text-[#002395]"
                        : "border-slate-200 hover:bg-slate-50 text-slate-705"
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Carte Bancaire / Stripe</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`py-2 px-3 border rounded-sm text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer ${
                      paymentMethod === "paypal"
                        ? "border-amber-500 bg-amber-50/50 text-amber-600"
                        : "border-slate-200 hover:bg-slate-50 text-slate-705"
                    }`}
                  >
                    <span className="font-black italic text-blue-800">Pay</span>
                    <span className="font-black italic text-sky-500">Pal</span>
                  </button>
                </div>

                {paymentMethod === "card" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nom du titulaire</label>
                      <input
                        type="text"
                        placeholder="Jean Dupont"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#002395]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Numéro de carte</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#002395]"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Expiration</label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm text-center focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">CVC</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm text-center focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50/50 p-4 rounded-sm border border-amber-100 text-center space-y-2">
                    <p className="text-xs text-amber-800 font-medium">Pour continuer, connectez-vous à votre compte PayPal sécurisé.</p>
                    <div className="bg-[#FFC439] hover:bg-[#F2B51F] py-2 px-4 rounded-sm text-xs font-bold font-mono text-blue-900 cursor-pointer inline-block shadow">
                      PayPal Checkout Simulé
                    </div>
                  </div>
                )}

                {/* Submission button */}
                <button
                  type="submit"
                  disabled={processingPayment}
                  className="w-full bg-[#002395] hover:bg-blue-800 text-white font-bold py-3 rounded-sm transition flex items-center justify-center space-x-2 disabled:bg-slate-350 cursor-pointer text-sm"
                >
                  {processingPayment ? (
                    <span>Traitement sécurisé en cours...</span>
                  ) : (
                    <span>Payer {formatPrice(ad.price * 0.05)}</span>
                  )}
                </button>

                <p className="text-[10px] text-slate-400 text-center flex items-center justify-center space-x-1">
                  <span>🔒 Chiffrement AES-256 bits par le protocole SSL de Stripe.</span>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
