export interface SpriteAnimation {
    name: string;
    imageUrl: string;
    frameWidth: number;
    frameHeight: number;
    rowCount: number;
    colCount: number;
    animations: Record<string, { row: number, frames: number, loop: boolean, speed?: number }>;
}

export const PET_SPRITES: Record<string, SpriteAnimation> = {
    'main': {
        name: 'Daily Actions',
        imageUrl: '/sprites/main.png',
        frameWidth: 134.25, // User provided precise width
        frameHeight: 200,
        rowCount: 4,
        colCount: 4,
        animations: {
            'idle': { row: 0, frames: 4, loop: true, speed: 200 },
            'wag': { row: 1, frames: 4, loop: true, speed: 150 },
            'sit': { row: 2, frames: 4, loop: false, speed: 200 },
            'lie': { row: 3, frames: 4, loop: false, speed: 200 },
            // Fallbacks for rows 4-7 (assuming they are missing or packed elsewhere)
            'sleep': { row: 3, frames: 4, loop: true, speed: 300 },   // Fallback to Lie
            'wake': { row: 2, frames: 4, loop: false, speed: 200 },   // Fallback to Sit
            'blink': { row: 0, frames: 4, loop: false, speed: 200 },  // Fallback to Idle
            'look': { row: 1, frames: 4, loop: false, speed: 250 },   // Fallback to Wag
        }
    },
    'emotions': {
        name: 'Emotions',
        imageUrl: '/sprites/emotions.png',
        frameWidth: 134.25,
        frameHeight: 200,
        rowCount: 4,
        colCount: 4,
        animations: {
            // Assuming simplified mapping based on "4 animations"
            'happy_idle': { row: 0, frames: 4, loop: true, speed: 200 }, // Happy
            'jump': { row: 0, frames: 4, loop: true, speed: 150 },       // Happy (fallback)
            'neutral': { row: 1, frames: 4, loop: true, speed: 250 },    // Neutral
            'sad': { row: 2, frames: 4, loop: true, speed: 250 },        // Sad
            'tired': { row: 3, frames: 4, loop: true, speed: 300 },      // Tired
            'comfort': { row: 3, frames: 4, loop: true, speed: 200 },    // Tired (fallback)
            'excited': { row: 0, frames: 4, loop: true, speed: 150 },    // Happy (fallback)
            'proud': { row: 1, frames: 4, loop: true, speed: 200 },      // Neutral (fallback)
        }
    },
    'gentle': {
        name: 'Gentle',
        imageUrl: '/sprites/gentle.png',
        frameWidth: 134.25,
        frameHeight: 200,
        rowCount: 4,
        colCount: 4,
        animations: {
            'soft': { row: 0, frames: 4, loop: true, speed: 250 },
            'protective': { row: 1, frames: 4, loop: false, speed: 200 },
            'energy': { row: 2, frames: 4, loop: true, speed: 150 },
            'glow': { row: 3, frames: 4, loop: true, speed: 200 },
            // Fallback for Sleepy (originally row 4)
            'sleepy': { row: 0, frames: 4, loop: true, speed: 300 },   // Fallback to Soft/Sleepy
        }
    },
    'walk': {
        name: 'Walking',
        imageUrl: '/sprites/walk.png',
        frameWidth: 178, // User provided precise width for Walk
        frameHeight: 200,
        rowCount: 4,
        colCount: 4,
        animations: {
            'right': { row: 0, frames: 4, loop: true, speed: 250 },
            'left': { row: 1, frames: 4, loop: true, speed: 250 },
            'up': { row: 2, frames: 4, loop: true, speed: 250 },
            'down': { row: 3, frames: 4, loop: true, speed: 250 },
        }
    },
    'run': {
        name: 'Run',
        imageUrl: '/sprites/run.png',
        frameWidth: 200,
        frameHeight: 261, // User provided precise height
        rowCount: 1,
        // User specified: "run animation sprite that has only 1 row but still 4 columns"
        colCount: 4,
        animations: {
            // Adjusted frames to 4 to match column count
            'run': { row: 0, frames: 4, loop: true, speed: 120 },
        }
    }
};

export const getAnimationForMood = (mood: string): { sheet: string, anim: string } => {
    const m = mood.toLowerCase();

    // Emotion Mapping
    if (m.includes('sad') || m.includes('cry') || m.includes('grief')) return { sheet: 'emotions', anim: 'sad' };
    if (m.includes('happy') || m.includes('good') || m.includes('calm')) return { sheet: 'emotions', anim: 'neutral' };
    if (m.includes('excited') || m.includes('great')) return { sheet: 'emotions', anim: 'excited' };
    if (m.includes('tired') || m.includes('fatigue')) return { sheet: 'emotions', anim: 'tired' };
    if (m.includes('anxious') || m.includes('stress')) return { sheet: 'emotions', anim: 'comfort' };
    if (m.includes('proud') || m.includes('achievement')) return { sheet: 'emotions', anim: 'proud' };

    // Cycle Phase Mapping (from LocalService)
    if (m.includes('menstrual') || m.includes('rest')) return { sheet: 'gentle', anim: 'sleepy' }; // Rest/Sleep
    if (m.includes('follicular') || m.includes('energy')) return { sheet: 'gentle', anim: 'energy' }; // Rising energy
    if (m.includes('ovulation') || m.includes('social')) return { sheet: 'gentle', anim: 'glow' }; // Glow/Social
    if (m.includes('luteal') || m.includes('kind')) return { sheet: 'gentle', anim: 'protective' }; // Self-care/Protective

    // Gentle/Protective
    if (m.includes('pain') || m.includes('cramp')) return { sheet: 'gentle', anim: 'protective' };
    if (m.includes('sleep') || m.includes('insomnia')) return { sheet: 'gentle', anim: 'sleepy' };

    // Default
    return { sheet: 'main', anim: 'idle' };
};

export interface PetInteraction {
    label: string;
    sheet: string;
    anim: string;
    icon?: string; // Optional icon name
}

export const PET_INTERACTIONS: PetInteraction[] = [
    { label: 'Sit', sheet: 'main', anim: 'sit' },
    { label: 'Jump', sheet: 'emotions', anim: 'jump' },
    { label: 'Sleep', sheet: 'main', anim: 'sleep' },
    { label: 'Run', sheet: 'run', anim: 'run' },
    { label: 'Wag', sheet: 'main', anim: 'wag' },
    { label: 'Sad', sheet: 'emotions', anim: 'sad' },
    { label: 'Comfort', sheet: 'emotions', anim: 'comfort' },
    { label: 'Walk', sheet: 'walk', anim: 'right' },
    { label: 'Energy', sheet: 'gentle', anim: 'energy' },
    { label: 'Protective', sheet: 'gentle', anim: 'protective' },
];
