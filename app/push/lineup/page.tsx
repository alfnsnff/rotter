"use client";
import React, { useState, useRef } from "react";
import { createClient } from '@/utils/supabase/client';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import agents from "@/data/agent";

const PushLineup = () => {
    const supabase = createClient()
    const [images, setImages] = useState<File[]>([]);
    const [selectedRole, setSelectedRole] = useState<"attacker" | "defender" | null>(null);
    const [mapLocation, setMapLocation] = useState("");
    const [selectedAgent, setSelectedAgent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const titleRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setImages((prev) => [...prev, ...files]);
    };

    const uploadImagesToStorage = async () => {
        const uploadedImageUrls: string[] = [];
        for (const image of images) {
            const { data, error } = await supabase.storage
                .from("public_vlrpusher") // Replace with your bucket name
                .upload(`images/${Date.now()}-${image.name}`, image);

            if (error) {
                console.error("Image upload failed:", error.message);
                continue;
            }

            const { data: publicUrlData } = await supabase.storage
                .from("public_vlrpusher")
                .getPublicUrl(data?.path);

            if (!publicUrlData) {
                console.error("Error getting public URL");
                continue;
            }

            uploadedImageUrls.push(publicUrlData.publicUrl);
        }

        return uploadedImageUrls;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!selectedRole) {
            alert("Please select a role before submitting.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Upload images
            const imageUrls = await uploadImagesToStorage();
            console.log("Image URLs:", imageUrls);
            // Insert data into Supabase
            const { error } = await (await supabase).from("lineups").insert([
                {
                    title: titleRef.current?.value || "",
                    description: descriptionRef.current?.value || "",
                    agent: selectedAgent,
                    sides: selectedRole,
                    map: mapLocation,
                    image_urls: imageUrls,
                },
            ]);

            if (error) {
                console.error("Error inserting data:", error.message);
                alert("Error submitting lineup. Please try again.");
                setIsSubmitting(false);
                return;
            }

            alert("Lineup submitted successfully!");
            setImages([]);
            setSelectedRole(null);
            setMapLocation("");
            setSelectedAgent("");
        } catch (err) {
            console.error("Error:", err);
            alert("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };


    const mapLocations = [
        { value: "Ascent", label: "Ascent" },
        { value: "Haven", label: "Haven" },
        { value: "Sunset", label: "Sunset" },
        { value: "Breeze", label: "Breeze" },
        { value: "Abyss", label: "Abyss" },
        { value: "Pearl", label: "Pearl" },
        { value: "Lotus", label: "Lotus" },
        { value: "Split", label: "Split" },
    ];

    return (
        <div className="container mt-4">
            <Breadcrumb className="mb-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/" className="text-blue-500">
                            Home
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/push/lineup`} className="font-semibold">
                            Push Lineup
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="container max-w-3xl mx-auto my-10 p-6">
                <h1 className="text-2xl font-bold mb-6 text-card-foreground">Submit Lineup Details</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div>
                        <div className="mb-5">
                            <label htmlFor="title" className="block text-sm font-medium text-muted-foreground mb-2">
                                Title
                            </label>
                            <Input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Enter a title"
                                ref={titleRef}
                                required
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-2">
                                Description
                            </label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={4}
                                placeholder="Enter a description"
                                ref={descriptionRef}
                                required
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="images" className="block text-sm font-medium text-muted-foreground mb-2">
                                Upload Images
                            </label>
                            <Input
                                type="file"
                                id="images"
                                name="images"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <div className="mt-2 space-y-1">
                                {images.map((image, index) => (
                                    <p key={index} className="text-sm text-muted-foreground">
                                        {image.name}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        <div className="mb-5">
                            <label htmlFor="map" className="block text-sm font-medium text-muted-foreground mb-2">
                                Map Location
                            </label>
                            <Select onValueChange={setMapLocation} value={mapLocation}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mapLocations.map((location) => (
                                        <SelectItem key={location.value} value={location.value}>
                                            {location.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Role</label>
                            <div className="mt-2 flex space-x-2">
                                <Button
                                    type="button"
                                    onClick={() => setSelectedRole("attacker")}
                                    className={`px-4 py-2 rounded-md ${
                                        selectedRole === "attacker"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                    } hover:bg-primary/90 hover:text-primary-foreground`}
                                >
                                    Attacker
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setSelectedRole("defender")}
                                    className={`px-4 py-2 rounded-md ${
                                        selectedRole === "defender"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                    } hover:bg-primary/90 hover:text-primary-foreground`}
                                >
                                    Defender
                                </Button>
                            </div>
                        </div>

                        <div className="mb-5">
                            <label htmlFor="agent" className="block text-sm font-medium text-muted-foreground mb-2">
                                Agent
                            </label>
                            <Select onValueChange={setSelectedAgent} value={selectedAgent}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select an agent" />
                                </SelectTrigger>
                                <SelectContent>
                                    {agents.map((agent) => (
                                        <SelectItem key={agent.name} value={agent.name}>
                                            <div className="flex items-center space-x-2">
                                                <img src={agent.imgSrc} alt={agent.name} className="w-6 h-6 rounded-full" />
                                                <span>{agent.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="col-span-1 lg:col-span-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md shadow-sm hover:bg-primary/90"
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PushLineup;
