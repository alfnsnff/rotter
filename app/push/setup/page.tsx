"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

const agents = [
    { name: "Sova", imgSrc: "/img/sova.png" },
    { name: "Viper", imgSrc: "/img/viper.png" },
    { name: "Killjoy", imgSrc: "/img/killjoy.png" },
    { name: "Yoru", imgSrc: "/img/yoru.png" },
    { name: "Fade", imgSrc: "/img/fade.png" },
];

const PushLineup = () => {
    const [images, setImages] = useState<File[]>([]);
    const [selectedRole, setSelectedRole] = useState<"attacker" | "defender" | null>(null);
    const [mapLocation, setMapLocation] = useState("");
    const [selectedAgent, setSelectedAgent] = useState("");

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: File[] = e.target.files ? Array.from(e.target.files) : [];
        setImages((prev) => [...prev, ...files]);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate fields
        if (!selectedRole) {
            alert("Please select a role before submitting.");
            return;
        }

        console.log("Form submitted with the following data:");
        console.log({
            title: (e.currentTarget.elements.namedItem("title") as HTMLInputElement).value,
            description: e.currentTarget.description.value,
            agent: selectedAgent,
            role: selectedRole,
            location: mapLocation,
            images,
        });
    };

    return (
        <div className="container max-w-3xl mx-auto my-10 p-6">
            <h1 className="text-2xl font-bold mb-6 text-card-foreground">Submit Lineup Details</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                    {/* Title */}
                    <div className="mb-5">
                        <label htmlFor="title" className="block text-sm font-medium text-muted-foreground mb-2">
                            Title
                        </label>
                        <Input type="text" id="title" name="title" placeholder="Enter a title" required />
                    </div>

                    {/* Description */}
                    <div className="mb-5">
                        <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-2">
                            Description
                        </label>
                        <Textarea id="description" name="description" rows={4} placeholder="Enter a description" required />
                    </div>

                    {/* Image Upload */}
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
                    {/* Map Location */}
                    <div className="mb-5">
                        <label htmlFor="map" className="block text-sm font-medium text-muted-foreground mb-2">
                            Map Location
                        </label>
                        <Select onValueChange={setMapLocation} value={mapLocation}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a location" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="location1">Location 1</SelectItem>
                                <SelectItem value="location2">Location 2</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Role Selection */}
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
                                } hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring`}
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
                                } hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring`}
                            >
                                Defender
                            </Button>
                        </div>
                        {selectedRole === null && (
                            <p className="mt-2 text-sm text-destructive">You must select a role!</p>
                        )}
                    </div>

                    {/* Agent */}
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

                {/* Full-Width Submit Button */}
                <div className="col-span-1 lg:col-span-2">
                    <button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PushLineup;
