export const getPortfolioItems = () => {
    const generate = (cat: 'face' | 'breast' | 'body', path: string, prefix: string, count: number) => 
        Array.from({length: count}, (_, i) => ({
            category: cat,
            src: `https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/portfolio/${path}/${prefix}-${String(i+1).padStart(2, '0')}.webp`
        }));
    
    return [
        ...generate('face', 'lico', 'lico', 16),
        ...generate('breast', 'grud', 'grud', 16),
        ...generate('body', 'telo', 'telo', 17)
    ];
};