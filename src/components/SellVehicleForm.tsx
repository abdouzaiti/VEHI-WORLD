/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Upload, HelpCircle, MapPin, Sparkles, CreditCard, CheckCircle, Video, Plus, Trash2 } from "lucide-react";
import { Ad, FuelType, TransmissionType, VehicleCategory, User, UserRole } from "../types";

export interface CreateAdPayload {
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
  images: string[];
  videoUrl?: string;
  isFeatured: boolean;
  specifications: Record<string, string>;
}

interface SellVehicleFormProps {
  currentUser: User;
  onPublish: (newAd: CreateAdPayload, paymentAmount: number) => void;
}

export default function SellVehicleForm({ currentUser, onPublish }: SellVehicleFormProps) {
  // Main form states
  const [category, setCategory] = React.useState<VehicleCategory>(VehicleCategory.CAR);
  const [title, setTitle] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [model, setModel] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [year, setYear] = React.useState("");
  const [mileage, setMileage] = React.useState("");
  const [fuel, setFuel] = React.useState<FuelType>(FuelType.ESSENCE);
  const [transmission, setTransmission] = React.useState<TransmissionType>(TransmissionType.MANUAL);
  const [location, setLocation] = React.useState("Paris (75)");
  const [description, setDescription] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState("");
  
  // Custom specifications list
  const [specKey, setSpecKey] = React.useState("");
  const [specVal, setSpecVal] = React.useState("");
  const [customSpecs, setCustomSpecs] = React.useState<Record<string, string>>({});

  // Photos State: 20 maximum
  const [uploadedPhotos, setUploadedPhotos] = React.useState<string[]>([
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop"
  ]);
  const [dragOver, setDragOver] = React.useState(false);

  // Economic Model states
  const [monetizationType, setMonetizationType] = React.useState<"single" | "subscription">("single");
  const [addFeatured, setAddFeatured] = React.useState(false);
  const [selectedSubPlan, setSelectedSubPlan] = React.useState<string>("");

  // Payment popup simulation inside step
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [publishStep, setPublishStep] = React.useState<"form" | "pricing" | "checkout" | "success">("form");
  const [checkoutName, setCheckoutName] = React.useState("");
  const [checkoutCard, setCheckoutCard] = React.useState("4242 4242 4242 4242");

  // Geolocation preset selection
  const frenchCities = [
    { name: "Paris (75)", lat: 48.8566, lon: 2.3522 },
    { name: "Lyon (69)", lat: 45.7578, lon: 4.8351 },
    { name: "Marseille (13)", lat: 43.2965, lon: 5.3698 },
    { name: "Bordeaux (33)", lat: 44.8378, lon: -0.5792 },
    { name: "Lille (59)", lat: 50.6292, lon: 3.0573 },
    { name: "Nice (06)", lat: 43.7102, lon: 7.2620 },
    { name: "Nantes (44)", lat: 47.2184, lon: -1.5536 },
    { name: "Strasbourg (67)", lat: 48.5734, lon: 7.7521 }
  ];

  React.useEffect(() => {
    // Select default sub plan based on user role
    if (currentUser.role === UserRole.PROFESSIONNEL) {
      setSelectedSubPlan("pro-30");
    } else {
      setSelectedSubPlan("part-5");
    }
  }, [currentUser]);

  // Handle drag over simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    // Simulate uploading custom photos of cars
    const sampleCarPics = [
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?w=800&auto=format&fit=crop"
    ];

    if (uploadedPhotos.length >= 20) {
      alert("Limite maximale de 20 photos atteinte.");
      return;
    }

    const nextPick = sampleCarPics[uploadedPhotos.length % sampleCarPics.length];
    setUploadedPhotos((prev) => [...prev, nextPick]);
  };

  const removePhoto = (idx: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const addSpecification = () => {
    if (!specKey.trim() || !specVal.trim()) return;
    setCustomSpecs((prev) => ({
      ...prev,
      [specKey]: specVal,
    }));
    setSpecKey("");
    setSpecVal("");
  };

  const removeSpecification = (key: string) => {
    const next = { ...customSpecs };
    delete next[key];
    setCustomSpecs(next);
  };

  // Pricing calculation
  const calculateTotal = () => {
    if (monetizationType === "single") {
      let fee = 9.99; // Price for 1 ad
      if (addFeatured) fee += 4.99;
      return Number(fee.toFixed(2));
    } else {
      // Choose Subscription
      if (selectedSubPlan === "part-5") return 19.99;
      if (selectedSubPlan === "part-10") return 29.99;
      if (selectedSubPlan === "pro-30") return 49.99;
      if (selectedSubPlan === "pro-max") return 99.99;
    }
    return 0;
  };

  const handleSubmitInitialForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !brand.trim() || !model.trim() || !price || !year || !mileage) {
      alert("Veuillez remplir tous les champs obligatoires marqués d'un astérisque.");
      return;
    }
    // Proceed to monetization strategy screen
    setPublishStep("pricing");
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare Ad object
    const selectedCity = frenchCities.find((c) => c.name === location) || frenchCities[0];

    // Build payload
    const finalAd: CreateAdPayload = {
      title,
      description: description || `Très beau/belle ${brand} ${model} en excellent état de marche.`,
      category,
      price: parseFloat(price),
      brand,
      model,
      year: parseInt(year),
      mileage: parseFloat(mileage),
      fuel,
      transmission,
      location,
      images: uploadedPhotos,
      videoUrl: videoUrl || undefined,
      isFeatured: monetizationType === "single" ? addFeatured : false,
      specifications: customSpecs,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onPublish(finalAd, calculateTotal());
      setPublishStep("success");
    }, 2005);
  };

  return (
    <div id="publish-flow-card" className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-md">
      {/* Interactive horizontal indicator */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-red-50 text-[#ED2939] rounded-sm">
            <Upload className="h-6 w-6" id="wizard-icon" />
          </div>
          <div>
            <h2 className="font-sans font-black text-xl text-slate-950 uppercase tracking-wide">
              Déposer une annonce
            </h2>
            <p className="text-xs text-slate-500 font-medium">Particuliers et Professionnels en France</p>
          </div>
        </div>

        {/* Steps visual state */}
        <div className="hidden sm:flex items-center space-x-2 font-mono text-[11px] font-bold text-slate-400">
          <span className={publishStep === "form" ? "text-[#002395] font-black" : ""}>1. Saisie</span>
          <span>→</span>
          <span className={publishStep === "pricing" ? "text-[#002395] font-black" : ""}>2. Formule</span>
          <span>→</span>
          <span className={publishStep === "checkout" ? "text-[#002395] font-black" : ""}>3. Paiement</span>
          <span>→</span>
          <span className={publishStep === "success" ? "text-[#002395] font-black" : ""}>4. Reçu</span>
        </div>
      </div>

      {/* STEP 1: Main form inputs */}
      {publishStep === "form" && (
        <form onSubmit={handleSubmitInitialForm} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Category Select */}
            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-705 uppercase tracking-wider mb-2">
                Catégorie du véhicule *
              </label>
              <select
                value={category}
                id="publish-category-select"
                onChange={(e) => setCategory(e.target.value as VehicleCategory)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#002395]"
              >
                {Object.values(VehicleCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-705 uppercase tracking-wider mb-2">
                Titre de l'annonce *
              </label>
              <input
                type="text"
                value={title}
                id="publish-title-input"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Peugeot 208 GT Electrique 136ch"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#002395]"
                required
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-bold text-slate-705 uppercase tracking-wider mb-2">
                Marque *
              </label>
              <input
                type="text"
                value={brand}
                id="publish-brand-input"
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ex: Peugeot, Yamaha, John Deere"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#002395]"
                required
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-xs font-bold text-slate-705 uppercase tracking-wider mb-2">
                Modèle exact *
              </label>
              <input
                type="text"
                value={model}
                id="publish-model-input"
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ex: e-208, MT-07, 6155R"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#002395]"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-slate-705 uppercase tracking-wider mb-2">
                Prix ferme (€) *
              </label>
              <input
                type="number"
                value={price}
                id="publish-price-input"
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ex: 19500"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#002395]"
                required
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-bold text-slate-705 uppercase tracking-wider mb-2">
                Année de mise en circulation *
              </label>
              <input
                type="number"
                value={year}
                id="publish-year-input"
                onChange={(e) => setYear(e.target.value)}
                placeholder="Ex: 2023"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#002395]"
                required
              />
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-xs font-bold text-slate-705 uppercase tracking-wider mb-2">
                Kilométrage (ou heures d'utilisation) *
              </label>
              <input
                type="number"
                value={mileage}
                id="publish-mileage-input"
                onChange={(e) => setMileage(e.target.value)}
                placeholder="Ex: 24500"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#002395]"
                required
              />
            </div>

            {/* Location selector preset */}
            <div>
              <label className="block text-xs font-bold text-slate-705 uppercase tracking-wider mb-2">
                Localisation géographique *
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#002395]"
              >
                {frenchCities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fuel or energy */}
            <div>
              <label className="block text-xs font-bold text-slate-705 uppercase tracking-wider mb-2">
                Carburant / Motorisation *
              </label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value as FuelType)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#002395]"
              >
                {Object.values(FuelType).map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Transmission type */}
            <div>
              <label className="block text-xs font-bold text-slate-705 uppercase tracking-wider mb-2">
                Type de boîte de vitesse *
              </label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#002395]"
              >
                {Object.values(TransmissionType).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Interactive Drag and Drop for up to 20 Photos */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-705 uppercase tracking-wider flex items-center space-x-1">
                <span>Photos du véhicule (Maximum 20 photos)</span>
                <span className="text-slate-400 font-normal">({uploadedPhotos.length} chargées)</span>
              </label>
              <span className="text-[10px] text-[#002395] font-bold">Standard Haute Définition</span>
            </div>

            {/* Drag & Drop Frame */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              id="photo-uploader-box"
              className={`border-2 border-dashed rounded-sm p-6 text-center transition cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                dragOver ? "border-[#ED2939] bg-red-50/20" : "border-slate-200 bg-slate-50 hover:bg-slate-100/50"
              }`}
            >
              <Upload className="h-8 w-8 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">Glissez-déposez vos photos ou cliquez ici</p>
              <p className="text-xs text-slate-400 max-w-sm">Formats acceptés : JPG, PNG. Jusqu'à 20 photos par annonce.</p>
            </div>

            {/* Uploaded Photos Grid previews */}
            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 mt-4" id="uploaded-thumbnails">
                {uploadedPhotos.map((photo, idx) => (
                  <div key={idx} className="relative aspect-square rounded-sm overflow-hidden border border-slate-200 group">
                    <img src={photo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
                      title="Supprimer la photo"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-mono px-1 rounded">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
                
                {uploadedPhotos.length < 20 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (uploadedPhotos.length >= 20) return;
                      // Simulate a secondary upload
                      setUploadedPhotos((prev) => [
                        ...prev,
                        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop"
                      ]);
                    }}
                    className="border border-dashed border-slate-300 rounded-xl hover:border-slate-500 hover:bg-slate-50 flex flex-col items-center justify-center text-slate-400 transition cursor-pointer aspect-square"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="text-[10px] font-medium mt-1">Ajouter</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Optional: Video links and Description */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-705 uppercase tracking-wider mb-2 flex items-center space-x-1">
                <Video className="h-3.5 w-3.5 text-slate-500" />
                <span>Lien vidéo du véhicule</span>
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Ex: https://youtube.com/watch?v=..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#002395]"
              />
              <p className="text-[10px] text-slate-400 mt-1">Lien YouTube, Vimeo, Tiktok, etc.</p>
            </div>

            {/* Description area */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-705 uppercase tracking-wider mb-2">
                Description générale (décrire les options, révisions...)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Saisissez une description convaincante pour maximiser vos chances de vente."
                rows={4}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-[#002395]"
              ></textarea>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Custom specifications additions */}
          <div>
            <label className="block text-xs font-bold text-slate-705 uppercase tracking-wider mb-2">
              Caractéristiques techniques spécifiques (facultatif)
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                placeholder="Ex : Puissance fiscale (CV)"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
              <input
                type="text"
                value={specVal}
                onChange={(e) => setSpecVal(e.target.value)}
                placeholder="Ex : 8 CV"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
              <button
                type="button"
                onClick={addSpecification}
                className="bg-[#002395] hover:bg-blue-800 text-white px-4 py-2 rounded-sm text-sm font-semibold cursor-pointer"
              >
                Ajouter
              </button>
            </div>

            {/* Added specs list tags */}
            {Object.keys(customSpecs).length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-sm border border-slate-100">
                {Object.entries(customSpecs).map(([k, v]) => (
                  <span key={k} className="inline-flex items-center space-x-1 bg-white border border-slate-200 text-xs px-2.5 py-1 rounded-sm font-medium">
                    <span className="text-slate-500 font-semibold">{k} :</span>
                    <span className="text-slate-800 font-bold">{v}</span>
                    <button
                      type="button"
                      onClick={() => removeSpecification(k)}
                      className="text-red-500 hover:text-red-700 pl-1 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Primary Action */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              id="btn-publish-proceed-monetization"
              className="px-6 py-3.5 bg-[#ED2939] hover:bg-red-700 text-white font-bold text-sm rounded-xl transition shadow cursor-pointer uppercase tracking-wider"
            >
              Étape Suivante : Choix de la Formule →
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: Monetization Package Selection */}
      {publishStep === "pricing" && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-lg font-bold text-slate-900">Sélectionnez votre modèle de publication</h3>
            <p className="text-xs text-slate-500 font-medium">
              Vehi World propose soit un paiement à l'unité, soit un abonnement récurrent pour publier plus et à des tarifs avantageux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* OPTION 1: PAY-PER-AD */}
            <div
              onClick={() => setMonetizationType("single")}
              className={`p-6 border-2 rounded-sm cursor-pointer transition relative flex flex-col justify-between ${
                monetizationType === "single" ? "border-[#002395] bg-blue-50/10" : "border-slate-250 hover:bg-slate-50"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#002395]">Formule 1</span>
                    <h4 className="text-base font-black text-slate-950">Publication Individuelle</h4>
                  </div>
                  <span className="text-[#002395] font-black text-lg font-mono">9,99 €</span>
                </div>
                <hr className="border-slate-100 my-3" />
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center space-x-1.5 font-medium">✓ Durée de publication standard: 30 jours</li>
                  <li className="flex items-center space-x-1.5 font-medium">✓ Téléchargement de 20 photos et vidéo démo</li>
                  <li className="flex items-center space-x-1.5 font-medium">✓ Géolocalisation dynamique instantanée</li>
                  <li className="flex items-center space-x-1.5 font-medium">✓ Outils de rapports d'audience vendeur</li>
                </ul>
              </div>

              {/* Add optional featured promotion */}
              <div className="mt-6 pt-4 border-t border-slate-100 bg-white shadow-sm rounded-sm p-3 border border-slate-200">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addFeatured}
                    onChange={(e) => setAddFeatured(e.target.checked)}
                    id="checkbox-featured-upgrade"
                    className="mt-1 h-4 w-4 text-[#002395] border-slate-300 rounded focus:ring-0"
                  />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-xs text-slate-900 font-sans">Mettre en avant (+4,99 €)</span>
                      <span className="bg-[#ED2939] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">MUST</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Votre annonce s'affiche tout en haut des résultats avec une mise en relief tricolore "À LA UNE". Boost de visibilité x10.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* OPTION 2: MONTHLY SUBSCRIPTIONS */}
            <div
              onClick={() => setMonetizationType("subscription")}
              className={`p-6 border-2 rounded-sm cursor-pointer transition relative flex flex-col justify-between ${
                monetizationType === "subscription" ? "border-amber-500 bg-amber-50/10" : "border-slate-250 hover:bg-slate-50"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Formule 2</span>
                    <h4 className="text-base font-black text-slate-950">Abonnement Mensuel</h4>
                  </div>
                  <span className="bg-amber-150 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono uppercase">
                    Pro & Perso
                  </span>
                </div>
                <hr className="border-slate-100 my-3" />
                
                {/* Switch sub options based on active user context role */}
                {currentUser.role === UserRole.PROFESSIONNEL ? (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-700">Plans Professionnels Disponibles :</p>
                    <label className="flex items-center justify-between p-3 bg-white border rounded-xl cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="sub-plan"
                          checked={selectedSubPlan === "pro-30"}
                          onChange={() => setSelectedSubPlan("pro-30")}
                          className="text-amber-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">💼 Pro - 30 Annonces</p>
                          <p className="text-[10px] text-slate-500">Pour concessionnaires d'envergure</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-900">49,99 €/mo</span>
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white border rounded-xl cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="sub-plan"
                          checked={selectedSubPlan === "pro-max"}
                          onChange={() => setSelectedSubPlan("pro-max")}
                          className="text-amber-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">🚀 Pro - Annonces Illimitées</p>
                          <p className="text-[10px] text-slate-500">Publication automatisée sans quotas</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-900">99,99 €/mo</span>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-705">Plans Particuliers Disponibles :</p>
                    <label className="flex items-center justify-between p-3 bg-white border rounded-xl cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="sub-plan"
                          checked={selectedSubPlan === "part-5"}
                          onChange={() => setSelectedSubPlan("part-5")}
                          className="text-blue-600"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">👤 Pack Particulier - 5 Annonces</p>
                          <p className="text-[10px] text-slate-500">Pour passionnés ou reventes multiples</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-900">19,99 €/mo</span>
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white border rounded-xl cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="sub-plan"
                          checked={selectedSubPlan === "part-10"}
                          onChange={() => setSelectedSubPlan("part-10")}
                          className="text-blue-600"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">👑 Pack Particulier - 10 Annonces</p>
                          <p className="text-[10px] text-slate-500">Quota doublé, priorité de validation</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-900">29,99 €/mo</span>
                    </label>
                  </div>
                )}
              </div>
              
              <div className="mt-4 bg-amber-50 rounded-xl p-2.5 text-[10px] text-amber-800 leading-normal">
                💡 Votre carte sera débitée de la mensualité choisie. Résiliable en un clic sans engagement.
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setPublishStep("form")}
              className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-5"
            >
              Retour
            </button>
            <button
              onClick={() => setPublishStep("checkout")}
              className="px-6 py-2.5 bg-[#002395] text-white text-sm font-bold rounded-xl hover:bg-blue-800 cursor-pointer flex items-center space-x-2"
            >
              <span>Continuer vers le Paiement sécurisé</span>
              <span>({calculateTotal()} €) ➔</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Integrated Checkout Gateway */}
      {publishStep === "checkout" && (
        <form onSubmit={handleCheckoutSubmit} className="space-y-6">
          <div className="text-center max-w-sm mx-auto space-y-1">
            <CreditCard className="h-10 w-10 text-[#002395] mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Paiement d'annonce sécurisé</h3>
            <p className="text-xs text-slate-500">
              Total à régler : <span className="font-extrabold text-[#002395] text-sm">{calculateTotal()} €</span>
            </p>
          </div>

          <div className="bg-slate-50 rounded-sm p-4 border border-slate-100 font-mono text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800 border-b pb-1 mb-2">Détails de facturation :</p>
            <p>Annonceur : {currentUser.name}</p>
            <p>Formule choisie : {monetizationType === "single" ? `Publication à l'unité [${addFeatured ? "Avec vedette" : "Simple"}]` : `Abonnement mensuel [Plan ${selectedSubPlan}]`}</p>
            <p>Statut validation : <span className="text-amber-600 font-black">En attente d'approbation administrative</span></p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nom sur la Carte Bancaire</label>
              <input
                type="text"
                value={checkoutName}
                onChange={(e) => setCheckoutName(e.target.value)}
                placeholder="Ex. Jean Dupont"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-sm text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Numéro de carte de crédit (Simulation)</label>
              <input
                type="text"
                value={checkoutCard}
                onChange={(e) => setCheckoutCard(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-sm text-sm font-mono focus:ring-1 focus:ring-blue-600"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1">Vous pouvez utiliser la carte test Stripe par défaut.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Expiration</label>
                <input
                   type="text"
                  placeholder="12/28"
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-sm text-sm text-center"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Code CVC</label>
                <input
                  type="text"
                  placeholder="242"
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-sm text-sm text-center"
                  required
                />
              </div>
            </div>
          </div>

          {/* Secure check message */}
          <div className="text-[10px] text-center text-slate-450 border-t border-slate-100 pt-4">
            🔒 Vos informations de payement sont cryptées via le système certifié PCI-DSS.
          </div>

          {/* Buttons Navigation */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setPublishStep("pricing")}
              className="px-5 py-2 border border-slate-200 text-slate-600 rounded-sm text-sm"
            >
              Retour formule
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#ED2939] hover:bg-red-700 text-white font-bold text-sm rounded-sm transition flex items-center space-x-2"
            >
              {isSubmitting ? (
                <span>Validation en cours...</span>
              ) : (
                <span>Valider le Paiement et Publier ({calculateTotal()} €)</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Successful Submission feedback */}
      {publishStep === "success" && (
        <div className="text-center py-8 space-y-4" id="deposit-success-view">
          <div className="h-16 w-16 bg-emerald-100 text-emerald-600 border-2 border-emerald-300 rounded-full flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>
          <h3 className="font-sans font-black text-xl text-slate-900 uppercase">Annonce en cours de modération</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Félicitations ! Votre annonce pour la <span className="font-extrabold text-[#002395]">{brand} {model}</span> a bien été enregistrée et payée.
          </p>
          <div className="bg-slate-50 rounded-sm border border-slate-200 p-4 max-w-sm mx-auto text-xs text-left text-slate-500 space-y-1 font-mono">
            <p>ID unique : <span className="font-bold text-slate-850">VEL-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span></p>
            <p>Facture : {calculateTotal()} € (TTC)</p>
            <p>Modération : <span className="text-amber-600 font-bold">Vérification admin requise</span></p>
            <p>Date : {new Date().toLocaleDateString("fr-FR")}</p>
          </div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-normal">
            Conformément à nos CGU, notre équipe d'administrateurs va valider votre annonce sous 2h pour éviter les spams et fraudes.
          </p>
          <button
            onClick={() => {
              // Reload page or reset views
              window.location.reload();
            }}
            className="px-6 py-3 bg-[#002395] hover:bg-blue-800 text-white font-bold text-sm rounded-sm cursor-pointer"
          >
            Retourner à l'Accueil des Annonces
          </button>
        </div>
      )}
    </div>
  );
}
