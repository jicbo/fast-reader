"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/theme-toggle";

const SpeedReader: React.FC = () => {
	const [text, setText] = useState<string>("");
	const [words, setWords] = useState<string[]>([]);
	const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
	const [wpm, setWpm] = useState<number>(200);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const handleTextChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setText(event.target.value);
		setWords(
			event.target.value
				.trim()
				.split(/\s+/)
				.filter((word) => word.length > 0)
		);
		setCurrentWordIndex(0);
		setIsPlaying(false);
	};

	useEffect(() => {
		if (isPlaying && words.length > 0) {
			intervalRef.current = setInterval(() => {
				setCurrentWordIndex((prevIndex) => {
					if (prevIndex < words.length - 1) {
						return prevIndex + 1;
					}
					setIsPlaying(false);
					if (intervalRef.current) clearInterval(intervalRef.current);
					return prevIndex;
				});
			}, 60000 / wpm);
		} else {
			if (intervalRef.current) clearInterval(intervalRef.current);
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [isPlaying, wpm, words]);

	const togglePlayPause = () => {
		if (words.length === 0) return;
		setIsPlaying(!isPlaying);
	};

	const handleWpmChange = (value: number[]) => {
		setWpm(value[0]);
	};

	const handleWpmInputChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const newWpm = parseInt(event.target.value, 10);
		if (!isNaN(newWpm) && newWpm > 0) {
			setWpm(newWpm);
		}
	};

	const handleWordIndexChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const newIndex = parseInt(event.target.value, 10) - 1;
		if (!isNaN(newIndex) && newIndex >= 0 && newIndex < words.length) {
			setCurrentWordIndex(newIndex);
			setIsPlaying(false);
		}
	};

	const goToPreviousWord = () => {
		setCurrentWordIndex((prev) => Math.max(0, prev - 1));
		setIsPlaying(false);
	};

	const goToNextWord = () => {
		setCurrentWordIndex((prev) => Math.min(words.length - 1, prev + 1));
		setIsPlaying(false);
	};

	const currentWord = words[currentWordIndex] || "";

	return (
		<Card className="w-full max-w-2xl shadow-lg">
			<CardHeader>
				<CardTitle className="text-3xl font-bold text-center">
					Fast Reader
				</CardTitle>
				<CardDescription className="text-center">
					Paste text to read it one word at a time
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="text-input">Paste Text Here</Label>
					<textarea
						id="text-input"
						value={text}
						onChange={handleTextChange}
						placeholder="Paste your text here..."
						className="w-full h-32 p-2 border rounded-md resize-none focus:ring-2 focus:ring-primary"
					/>
				</div>

				<div className="flex flex-col items-center justify-center text-center p-2 md:p-8 border rounded-md h-40 bg-muted">
					<p
						className="text-5xl font-semibold select-none"
						style={{ minHeight: "60px" }}
					>
						{currentWord ||
							(words.length > 0 ? "Ready" : "Load text to start")}
					</p>
				</div>

				<div className="space-y-4">
					<div className="space-y-2">
						<div className="flex justify-between items-center">
							<Label htmlFor="wpm-slider">
								Speed (WPM): {wpm}
							</Label>
							<Input
								type="number"
								value={wpm}
								onChange={handleWpmInputChange}
								className="w-24 h-8"
								min="1"
							/>
						</div>
						<Slider
							id="wpm-slider"
							min={50}
							max={600}
							step={10}
							value={[wpm]}
							onValueChange={handleWpmChange}
						/>
					</div>

					<div className="space-y-2">
						<div className="flex justify-between items-center">
							<Label htmlFor="word-navigator">
								Word: {currentWordIndex + 1} /{" "}
								{words.length || 0}
							</Label>
							<Input
								type="number"
								value={
									words.length > 0 ? currentWordIndex + 1 : 0
								}
								onChange={handleWordIndexChange}
								className="w-24 h-8"
								min="1"
								max={words.length || 1}
								disabled={words.length === 0}
							/>
						</div>
						<Slider
							id="word-navigator-slider"
							min={0}
							max={words.length > 0 ? words.length - 1 : 0}
							step={1}
							value={[currentWordIndex]}
							onValueChange={(value) => {
								setCurrentWordIndex(value[0]);
								setIsPlaying(false);
							}}
							disabled={words.length === 0}
						/>
					</div>

					<div className="flex justify-center space-x-2 md:space-x-4">
						<Button
							onClick={goToPreviousWord}
							disabled={
								currentWordIndex === 0 || words.length === 0
							}
							variant="outline"
						>
							Previous
						</Button>
						<Button
							onClick={togglePlayPause}
							disabled={words.length === 0}
							className="w-24"
						>
							{isPlaying ? "Pause" : "Play"}
						</Button>
						<Button
							onClick={goToNextWord}
							disabled={
								currentWordIndex >= words.length - 1 ||
								words.length === 0
							}
							variant="outline"
						>
							Next
						</Button>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
				<p>Adjust speed and navigate words using the controls above.</p>
				<ModeToggle />
			</CardFooter>
		</Card>
	);
};

export default SpeedReader;
