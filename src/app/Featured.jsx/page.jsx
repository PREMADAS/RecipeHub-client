"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// আপনার Express backend যেই URL এ চলছে সেটা এখানে বসান
const BACKEND_URL = "http://localhost:5000";

export default function FeaturedRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeatured() {
            try {
                const res = await fetch(`${BACKEND_URL}/api/recipes/featured`);
                const data = await res.json();
                setRecipes(data.recipes || []);
            } catch (err) {
                console.error("Failed to load featured recipes", err);
            } finally {
                setLoading(false);
            }
        }

        fetchFeatured();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 my-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (recipes.length === 0) {
        return null;
    }

    return (
        <section className="max-w-7xl mx-auto px-4 my-10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Featured Recipes</h2>
                    <div className="w-10 h-1 bg-green-600 rounded-full mt-1" />
                </div>
                <a href="/recipes" className="text-sm text-green-600 hover:underline">
                    View all →
                </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                {recipes.map((recipe) => (
                    <div
                        key={recipe._id}
                        className="rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <div className="relative aspect-[4/3]">
                            <Image
                                src={recipe.image || "/placeholder-recipe.jpg"}
                                alt={recipe.name}
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-white text-xs font-medium px-2.5 py-1 rounded-full">
                                {recipe.category}
                            </span>
                        </div>

                        <div className="p-3">
                            <p className="font-medium text-sm mb-2 line-clamp-2">
                                {recipe.name}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>🌍 {recipe.cuisine}</span>
                                <span>⏱ {recipe.prepTime}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}