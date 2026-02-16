import React, { useEffect, useRef, useState } from 'react';
import { PET_SPRITES, SpriteAnimation } from '../utils/petAnimations';

interface PetSpriteProps {
    sheetKey: string;
    animationKey: string;
    scale?: number;
}

export const PetSprite: React.FC<PetSpriteProps> = ({ sheetKey, animationKey, scale = 1.0 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [spriteImage, setSpriteImage] = useState<HTMLImageElement | null>(null);
    const frameRef = useRef(0);
    const timeRef = useRef(0);

    // Load Image & Calculate Dimensions
    useEffect(() => {
        const spriteDef = PET_SPRITES[sheetKey];
        if (!spriteDef) {
            console.error(`[PetSprite] No definition for sheetKey: ${sheetKey}`);
            return;
        }

        console.log(`[PetSprite] Loading image: ${spriteDef.imageUrl}`);
        const img = new Image();
        img.src = spriteDef.imageUrl;
        img.onload = () => {
            console.log(`[PetSprite] Image loaded successfully: ${spriteDef.imageUrl} (${img.width}x${img.height})`);
            setSpriteImage(img);
        };
        img.onerror = (e) => {
            console.error(`[PetSprite] Failed to load image: ${spriteDef.imageUrl}`, e);
        };
    }, [sheetKey]);

    // Animation Loop
    useEffect(() => {
        const spriteDef = PET_SPRITES[sheetKey];
        if (!spriteDef || !spriteImage || !canvasRef.current) return;

        const anim = spriteDef.animations[animationKey];
        if (!anim) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Force high resolution for crisp pixel art
        ctx.imageSmoothingEnabled = false;

        // Calculate Frame Dimensions Dynamically
        // This handles cases where the actual image resolution matches or differs from hardcoded values
        const fWidth = spriteImage.width / spriteDef.colCount;
        const fHeight = spriteImage.height / spriteDef.rowCount;

        console.log(`[PetSprite] Frame Size: ${fWidth}x${fHeight} (Image: ${spriteImage.width}x${spriteImage.height}, Grid: ${spriteDef.colCount}x${spriteDef.rowCount})`);

        const animate = (timestamp: number) => {
            if (!timeRef.current) timeRef.current = timestamp;
            const deltaTime = timestamp - timeRef.current;
            const speed = anim.speed || 200;

            if (deltaTime > speed) {
                frameRef.current = (frameRef.current + 1);
                if (frameRef.current >= anim.frames) {
                    frameRef.current = anim.loop ? 0 : anim.frames - 1;
                }
                timeRef.current = timestamp;
            }

            // Clear
            ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

            // Source Frame (from sprite sheet)
            const sx = frameRef.current * fWidth;
            const sy = anim.row * fHeight;

            // Draw Centered on a 500x500 canvas
            const CANVAS_SIZE = 500;

            // Calculate scale to fill ~60% of the canvas (Reduced further to ensure NO clipping)
            const targetSize = CANVAS_SIZE * 0.6;
            const scaleFactor = Math.min(targetSize / fWidth, targetSize / fHeight);

            const dWidth = fWidth * scaleFactor;
            const dHeight = fHeight * scaleFactor;

            const drawX = (CANVAS_SIZE - dWidth) / 2;
            const drawY = (CANVAS_SIZE - dHeight) / 2;

            ctx.drawImage(
                spriteImage,
                sx, sy, fWidth, fHeight,
                drawX, drawY, dWidth, dHeight
            );

            requestAnimationFrame(animate);
        };

        const reqId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(reqId);
    }, [spriteImage, animationKey, sheetKey]);

    const spriteDef = PET_SPRITES[sheetKey];
    if (!spriteDef) return null;

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <canvas
                ref={canvasRef}
                width={500}
                height={500}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    imageRendering: 'pixelated',
                    // backgroundColor: 'rgba(0,0,0,0.05)' // Debug: See canvas bounds
                }}
            />
        </div>
    );
};
