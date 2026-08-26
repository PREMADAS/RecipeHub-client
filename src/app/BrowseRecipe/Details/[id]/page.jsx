"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Heart,
    Bookmark,
    Flag,
    ChevronLeft,
    ChevronRight,
    Clock,
    ChefHat,
    Utensils,
    X,
    Loader2,
    Sparkles,
} from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function RecipeDetails() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [favorited, setFavorited] = useState(false);

    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [actionMsg, setActionMsg] = useState("");

    const [checkedIngredients, setCheckedIngredients] = useState({});

    useEffect(() => {
        if (!id) return;
        const fetchRecipe = async () => {
            try {
                const res = await fetch(`${SERVER}/api/recipes/${id}`, { credentials: "include" });
                const data = await res.json();
                if (res.ok) {
                    setRecipe(data.recipe);
                    setLikeCount(data.recipe.likesCount || 0);
                }
            } catch (error) {
                console.error("Failed to fetch recipe:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    const handleLike = async () => {
        try {
            const res = await fetch(`${SERVER}/api/recipes/${id}/like`, { method: "POST", credentials: "include" });
            const data = await res.json();
            if (res.ok) {
                setLiked(data.liked);
                setLikeCount(data.likeCount);
            } else if (res.status === 401) {
                router.push("/login");
            }
        } catch (error) {
            console.error("Like failed:", error);
        }
    };

    const handleFavorite = async () => {
        try {
            const res = await fetch(`${SERVER}/api/recipes/${id}/favorite`, { method: "POST", credentials: "include" });
            const data = await res.json();
            if (res.ok) {
                setFavorited(data.favorited);
            } else if (res.status === 401) {
                router.push("/login");
            }
        } catch (error) {
            console.error("Favorite failed:", error);
        }
    };

    const handleReportSubmit = async () => {
        if (!reportReason.trim()) return;
        try {
            const res = await fetch(`${SERVER}/api/recipes/${id}/report`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ reason: reportReason }),
            });
            if (res.ok) {
                setActionMsg("Report submitted. Thank you!");
                setShowReportModal(false);
                setReportReason("");
            } else if (res.status === 401) {
                router.push("/login");
            }
        } catch (error) {
            console.error("Report failed:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FBF8F2] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-700" />
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="min-h-screen bg-[#FBF8F2] flex items-center justify-center">
                <p className="text-[#4A3B2C]/70">Recipe not found</p>
            </div>
        );
    }

    const images = recipe.recipeImage ? [recipe.recipeImage] : [];

    return (
        <div className="min-h-screen bg-[#FBF8F2]">
            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* ---------- Image Gallery ---------- */}
                {images.length > 0 && (
                    <div className="relative rounded-3xl overflow-hidden aspect-[16/9] bg-[#E5D9BE]/40 shadow-sm">
                        <img src={images[activeImg]} alt={recipe.recipeName} className="w-full h-full object-cover" />
                        {recipe.isFeatured && (
                            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-amber-400 text-[#2B2118] text-[12px] font-bold px-3 py-1.5 rounded-full">
                                <Sparkles size={13} />
                                Featured
                            </div>
                        )}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() => setActiveImg((p) => (p === 0 ? images.length - 1 : p - 1))}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => setActiveImg((p) => (p === images.length - 1 ? 0 : p + 1))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* ---------- Title Block ---------- */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-8">
                    <div>
                        <p className="text-[12.5px] font-semibold tracking-wide text-green-700 uppercase mb-2">
                            {recipe.category} &middot; {recipe.cuisineType}
                        </p>
                        <h1
                            className="text-[34px] sm:text-[42px] leading-tight text-[#2B2118] mb-2"
                            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 }}
                        >
                            {recipe.recipeName}
                        </h1>
                        {recipe.authorName && (
                            <p className="text-[13.5px] text-[#4A3B2C]/60">
                                By <span className="font-semibold text-[#4A3B2C]">{recipe.authorName}</span>
                            </p>
                        )}
                    </div>
                    {recipe.difficultyLevel && (
                        <span className="shrink-0 bg-green-700 text-white text-[13px] font-semibold px-5 py-2 rounded-full h-fit">
                            {recipe.difficultyLevel}
                        </span>
                    )}
                </div>

                {/* ---------- Recipe Index Card ---------- */}
                <div className="relative mt-8 -rotate-[0.4deg]">
                    <div className="flex flex-wrap gap-x-10 gap-y-4 border-2 border-dashed border-[#C9A876] bg-[#FFFBF0] rounded-xl px-8 py-5">
                        <InfoStat icon={<Clock size={18} />} label="Prep Time" value={recipe.preparationTime} />
                        <InfoStat icon={<ChefHat size={18} />} label="Cuisine" value={recipe.cuisineType} />
                        <InfoStat icon={<Utensils size={18} />} label="Category" value={recipe.category} />
                    </div>
                    <div className="absolute -top-2 left-8 w-3 h-3 rounded-full bg-[#B23B3B] shadow-sm" />
                </div>

                {/* ---------- Action Bar ---------- */}
                <div className="flex flex-wrap items-center gap-3 mt-8 pb-6 border-b border-[#E5D9BE]">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-[14px] font-semibold transition-colors ${liked ? "bg-[#B23B3B] border-[#B23B3B] text-white" : "border-[#E5D9BE] text-[#2B2118] hover:border-[#B23B3B]"
                            }`}
                    >
                        <Heart size={16} className={liked ? "fill-white" : ""} />
                        {likeCount}
                    </button>

                    <button
                        onClick={handleFavorite}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-[14px] font-semibold transition-colors ${favorited ? "bg-amber-400 border-amber-400 text-[#2B2118]" : "border-[#E5D9BE] text-[#2B2118] hover:border-amber-400"
                            }`}
                    >
                        <Bookmark size={16} className={favorited ? "fill-[#2B2118]" : ""} />
                        {favorited ? "Favorited" : "Favorite"}
                    </button>

                    <button
                        onClick={() => setShowReportModal(true)}
                        className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] text-[#4A3B2C]/60 hover:text-[#B23B3B] transition-colors ml-auto"
                    >
                        <Flag size={14} />
                        Report
                    </button>
                </div>

                {actionMsg && <p className="text-green-700 text-[14px] font-medium mt-4">{actionMsg}</p>}

                {/* ---------- Instructions + Ingredients ---------- */}
                <div className="flex flex-col lg:flex-row gap-12 mt-10">
                    <div className="flex-[2] min-w-0">
                        <h2
                            className="text-[22px] text-[#2B2118] mb-6"
                            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 }}
                        >
                            Method
                        </h2>
                        <div className="space-y-6">
                            {recipe.instructions?.map((step, idx) => (
                                <div key={idx} className="flex gap-5">
                                    <div className="shrink-0 w-9 h-9 rounded-full border-2 border-green-700 text-green-700 flex items-center justify-center text-[13px] font-bold">
                                        {idx + 1}
                                    </div>
                                    <p className="text-[15px] text-[#4A3B2C] leading-relaxed pt-1">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 min-w-[260px]">
                        <div className="bg-[#FFFBF0] border border-[#E5D9BE] rounded-2xl p-6 sticky top-6">
                            <h2
                                className="text-[20px] text-[#2B2118] mb-4"
                                style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 }}
                            >
                                Ingredients
                            </h2>
                            <div className="space-y-3">
                                {recipe.ingredients?.map((ing, idx) => (
                                    <label key={idx} className="flex items-start gap-3 text-[14.5px] cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={!!checkedIngredients[idx]}
                                            onChange={() =>
                                                setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }))
                                            }
                                            className="mt-1 w-4 h-4 accent-green-700 shrink-0"
                                        />
                                        <span
                                            className={
                                                checkedIngredients[idx]
                                                    ? "line-through text-[#4A3B2C]/40"
                                                    : "text-[#2B2118]"
                                            }
                                        >
                                            {ing}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------- Report Modal ---------- */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setShowReportModal(false)}
                            className="absolute top-4 right-4 text-[#4A3B2C]/50 hover:text-[#2B2118]"
                        >
                            <X size={20} />
                        </button>
                        <h3
                            className="text-[20px] text-[#2B2118] mb-1"
                            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 }}
                        >
                            Report this recipe
                        </h3>
                        <p className="text-[13px] text-[#4A3B2C]/60 mb-4">Let us know what's wrong — we'll take a look.</p>
                        <textarea
                            placeholder="Why are you reporting this recipe?"
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            className="w-full h-28 p-3 rounded-xl border border-[#E5D9BE] text-[14px] focus:outline-none focus:border-[#B23B3B] resize-none"
                        />
                        <div className="flex gap-3 justify-end mt-4">
                            <button
                                onClick={() => setShowReportModal(false)}
                                className="px-4 py-2 rounded-full text-[13px] font-semibold text-[#4A3B2C] hover:bg-[#FBF8F2]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReportSubmit}
                                className="px-5 py-2 rounded-full text-[13px] font-semibold text-white bg-[#B23B3B] hover:bg-[#96302f]"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoStat({ icon, label, value }) {
    if (!value) return null;
    return (
        <div className="flex items-center gap-2.5">
            <span className="text-green-700">{icon}</span>
            <div>
                <p className="text-[10.5px] uppercase tracking-wide text-[#4A3B2C]/50 font-semibold">{label}</p>
                <p className="text-[14px] text-[#2B2118] font-semibold">{value}</p>
            </div>
        </div>
    );
}