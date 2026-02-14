export interface PortfolioItem {
    category: 'face' | 'breast' | 'body';
    beforeSrc?: string;
    afterSrc?: string;
    id: string;
}

export const getPortfolioItems = (): PortfolioItem[] => {
    const generatePairs = (cat: 'face' | 'breast' | 'body', path: string, prefix: string, totalImages: number) => {
        const items: PortfolioItem[] = [];
        
        // We assume odd numbers are "Before" and even numbers are "After"
        // e.g., 01=Before, 02=After, 03=Before, 04=After...
        for (let i = 1; i <= totalImages; i += 2) {
            const hasAfter = i + 1 <= totalImages;
            
            items.push({
                id: `${cat}-${i}`,
                category: cat,
                beforeSrc: `https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/portfolio/${path}/${prefix}-${String(i).padStart(2, '0')}.webp`,
                // If there is a next image, use it as After. Otherwise undefined.
                afterSrc: hasAfter 
                    ? `https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/portfolio/${path}/${prefix}-${String(i+1).padStart(2, '0')}.webp`
                    : undefined
            });
        }
        return items;
    };
    
    return [
        ...generatePairs('face', 'lico', 'lico', 16),
        ...generatePairs('breast', 'grud', 'grud', 16),
        ...generatePairs('body', 'telo', 'telo', 17) // 17 is odd, so the last one will be an orphan
    ];
};