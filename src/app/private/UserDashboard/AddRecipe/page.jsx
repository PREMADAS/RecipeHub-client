"use client";

import { useState } from "react";
import { UploadCloud, X, Plus } from "lucide-react";


const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const CATEGORY_OPTIONS = ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Drinks"];
const CUISINE_OPTIONS = ["Bangladeshi", "Indian", "Chinese", "Italian", "Thai", "Continental"];
const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];


export default function AddRecipeForm() {
    const [form, setForm] = useState({
        name: "",
        image: null, // File object, upload to imgbb later
        imagePreview: null,
        category: "",
        cuisine: "",
        difficulty: "",
        prepTime: "",
        ingredients: [""],
        instructions: [""],
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        updateField("image", file);
        updateField("imagePreview", URL.createObjectURL(file));
        // TODO: upload `file` to imgbb here, store returned URL for `recipes` collection
    };

    const updateListItem = (field, index, value) => {
        setForm((prev) => {
            const list = [...prev[field]];
            list[index] = value;
            return { ...prev, [field]: list };
        });
    };

    const addListItem = (field) => {
        setForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
    };

    const removeListItem = (field, index) => {
        setForm((prev) => {
            const list = prev[field].filter((_, i) => i !== index);
            return { ...prev, [field]: list.length ? list : [""] };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Basic validation
        if (!form.name || !form.image || !form.category || !form.cuisine || !form.difficulty || !form.prepTime) {
            setError("Please fill in all fields and select an image.");
            return;
        }

        const cleanIngredients = form.ingredients.map((i) => i.trim()).filter(Boolean);
        const cleanInstructions = form.instructions.map((i) => i.trim()).filter(Boolean);

        if (cleanIngredients.length === 0) {
            setError("Please add at least one ingredient.");
            return;
        }
        if (cleanInstructions.length === 0) {
            setError("Please add at least one instruction step.");
            return;
        }

        setSubmitting(true);
        try {
            // ১. Image টা imgbb তে আপলোড করা
            const imgFormData = new FormData();
            imgFormData.append("image", form.image);

            const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: "POST",
                body: imgFormData,
            });
            const imgData = await imgRes.json();

            if (!imgData.success) {
                setError("Image upload failed. Please try again.");
                setSubmitting(false);
                return;
            }

            const imageUrl = imgData.data.url;

            // ২. Recipe টা backend এ পাঠানো
            const res = await fetch(`${SERVER}/api/recipes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    recipeName: form.name,
                    recipeImage: imageUrl,
                    category: form.category,
                    cuisineType: form.cuisine,
                    difficultyLevel: form.difficulty,
                    preparationTime: form.prepTime,
                    ingredients: cleanIngredients,
                    instructions: cleanInstructions,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to save recipe.");
                setSubmitting(false);
                return;
            }

            setSuccess("Recipe added successfully!");
            setForm({
                name: "",
                image: null,
                imagePreview: null,
                category: "",
                cuisine: "",
                difficulty: "",
                prepTime: "",
                ingredients: [""],
                instructions: [""],
            });
        } catch (err) {
            console.error("Add recipe error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#E5D9BE] bg-white px-6 py-7 flex flex-col gap-6"
        >
            {/* Recipe Name */}
            <Field label="Recipe Name">
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="e.g. Chicken Biryani"
                    className="w-full rounded-xl border border-[#E5D9BE] bg-[#FBF8F2] px-3.5 py-2.5 text-[13.5px] text-[#2B2118] placeholder:text-[#4A3B2C]/40 focus:outline-none focus:border-green-600 focus:bg-white transition-colors duration-150"
                />
            </Field>

            {/* Recipe Image Upload (imgbb) */}
            <Field label="Recipe Image">
                <label className="flex items-center gap-4 cursor-pointer">
                    <div className="w-20 h-20 rounded-xl border border-dashed border-[#E5D9BE] bg-[#FBF8F2] flex items-center justify-center overflow-hidden shrink-0">
                        {form.imagePreview ? (
                            <img
                                src={form.imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <UploadCloud size={20} strokeWidth={1.75} className="text-[#4A3B2C]/40" />
                        )}
                    </div>
                    <div>
                        <span className="inline-block text-[13px] font-semibold text-[#2B2118] bg-[#F0EADA] rounded-lg px-3.5 py-2 hover:bg-[#E9E0C6] transition-colors duration-150">
                            {form.image ? "Change Image" : "Upload Image"}
                        </span>
                        <p className="text-[11.5px] text-[#4A3B2C]/50 mt-1.5">
                            Uploaded via imgbb — PNG or JPG
                        </p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </label>
            </Field>

            {/* Category + Cuisine Type */}
            <div className="grid sm:grid-cols-2 gap-6">
                <Field label="Category">
                    <select
                        value={form.category}
                        onChange={(e) => updateField("category", e.target.value)}
                        className="w-full rounded-xl border border-[#E5D9BE] bg-[#FBF8F2] px-3.5 py-2.5 text-[13.5px] text-[#2B2118] placeholder:text-[#4A3B2C]/40 focus:outline-none focus:border-green-600 focus:bg-white transition-colors duration-150"
                    >
                        <option value="">Select category</option>
                        {CATEGORY_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Cuisine Type">
                    <select
                        value={form.cuisine}
                        onChange={(e) => updateField("cuisine", e.target.value)}
                        className="w-full rounded-xl border border-[#E5D9BE] bg-[#FBF8F2] px-3.5 py-2.5 text-[13.5px] text-[#2B2118] placeholder:text-[#4A3B2C]/40 focus:outline-none focus:border-green-600 focus:bg-white transition-colors duration-150"
                    >
                        <option value="">Select cuisine</option>
                        {CUISINE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>

            {/* Difficulty Level + Preparation Time */}
            <div className="grid sm:grid-cols-2 gap-6">
                <Field label="Difficulty Level">
                    <select
                        value={form.difficulty}
                        onChange={(e) => updateField("difficulty", e.target.value)}
                        className="w-full rounded-xl border border-[#E5D9BE] bg-[#FBF8F2] px-3.5 py-2.5 text-[13.5px] text-[#2B2118] placeholder:text-[#4A3B2C]/40 focus:outline-none focus:border-green-600 focus:bg-white transition-colors duration-150"
                    >
                        <option value="">Select difficulty</option>
                        {DIFFICULTY_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Preparation Time">
                    <input
                        type="text"
                        value={form.prepTime}
                        onChange={(e) => updateField("prepTime", e.target.value)}
                        placeholder="e.g. 45 mins"
                        className="w-full rounded-xl border border-[#E5D9BE] bg-[#FBF8F2] px-3.5 py-2.5 text-[13.5px] text-[#2B2118] placeholder:text-[#4A3B2C]/40 focus:outline-none focus:border-green-600 focus:bg-white transition-colors duration-150"
                    />
                </Field>
            </div>

            {/* Ingredients */}
            <Field label="Ingredients">
                <ListInput
                    items={form.ingredients}
                    onChange={(i, v) => updateListItem("ingredients", i, v)}
                    onAdd={() => addListItem("ingredients")}
                    onRemove={(i) => removeListItem("ingredients", i)}
                    placeholder="e.g. 2 cups rice"
                    addLabel="Add ingredient"
                />
            </Field>

            {/* Instructions */}
            <Field label="Instructions">
                <ListInput
                    items={form.instructions}
                    onChange={(i, v) => updateListItem("instructions", i, v)}
                    onAdd={() => addListItem("instructions")}
                    onRemove={(i) => removeListItem("instructions", i)}
                    placeholder="Describe this step"
                    addLabel="Add step"
                    numbered
                    textarea
                />
            </Field>

            {error && (
                <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                    {error}
                </p>
            )}
            {success && (
                <p className="text-[13px] text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                    {success}
                </p>
            )}

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={submitting}
                    className="text-[13.5px] font-semibold text-white bg-green-700 rounded-xl px-5 py-2.5 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
                >
                    {submitting ? "Saving..." : "Save Recipe"}
                </button>
            </div>
        </form>
    );
}

function Field({ label, children }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-[#2B2118]">{label}</label>
            {children}
        </div>
    );
}

function ListInput({ items, onChange, onAdd, onRemove, placeholder, addLabel, numbered, textarea }) {
    return (
        <div className="flex flex-col gap-2">
            {items.map((value, index) => (
                <div key={index} className="flex items-start gap-2">
                    {numbered && (
                        <span className="text-[12.5px] font-semibold text-[#4A3B2C]/50 mt-2.5 w-4 shrink-0">
                            {index + 1}.
                        </span>
                    )}
                    {textarea ? (
                        <textarea
                            value={value}
                            onChange={(e) => onChange(index, e.target.value)}
                            placeholder={placeholder}
                            rows={2}
                            className="w-full rounded-xl border border-[#E5D9BE] bg-[#FBF8F2] px-3.5 py-2.5 text-[13.5px] text-[#2B2118] placeholder:text-[#4A3B2C]/40 focus:outline-none focus:border-green-600 focus:bg-white transition-colors duration-150 resize-none flex-1"
                        />
                    ) : (
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(index, e.target.value)}
                            placeholder={placeholder}
                            className="w-full rounded-xl border border-[#E5D9BE] bg-[#FBF8F2] px-3.5 py-2.5 text-[13.5px] text-[#2B2118] placeholder:text-[#4A3B2C]/40 focus:outline-none focus:border-green-600 focus:bg-white transition-colors duration-150 flex-1"
                        />
                    )}
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="mt-2 shrink-0 text-[#4A3B2C]/40 hover:text-[#2B2118] transition-colors duration-150"
                    >
                        <X size={16} strokeWidth={2} />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={onAdd}
                className="flex items-center gap-1.5 text-[12.5px] font-semibold text-green-700 hover:text-green-800 transition-colors duration-150 mt-1"
            >
                <Plus size={14} strokeWidth={2.5} />
                {addLabel}
            </button>
        </div>
    );
}