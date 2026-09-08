import { useEffect, useRef, useState } from 'react';

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
    const ref = useRef<T>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -80px 0px' },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return { ref, visible };
}
