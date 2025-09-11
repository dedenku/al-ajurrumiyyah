import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import styles from './ArabicTooltip.module.css';

/**
 * Hook kustom untuk mendeteksi klik di luar elemen.
 */
const useClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

/**
 * Komponen untuk menampilkan kata/frasa Arab inline.
 * Jika prop 'tooltip' diberikan, teks akan menjadi interaktif dan
 * memunculkan tooltip yang posisinya dinamis.
 * Jika tidak, komponen hanya akan menerapkan gaya font Arab.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Teks Arab yang akan ditampilkan.
 * @param {string} [props.tooltip] - Opsional: Teks terjemahan untuk tooltip.
 */
const AR = ({ children, tooltip }) => {
    const [isVisible, setIsVisible] = useState(false);
    const wrapperRef = useRef(null);
    const tooltipRef = useRef(null);

    // Menentukan apakah komponen harus interaktif berdasarkan adanya prop 'tooltip'.
    const isInteractive = tooltip && tooltip.trim() !== '';

    // Menutup tooltip saat pengguna mengklik di luar.
    useClickOutside(wrapperRef, () => {
        if (isInteractive) {
            setIsVisible(false);
        }
    });

    // Mengatur posisi tooltip secara dinamis agar tidak terpotong layar.
    useLayoutEffect(() => {
        if (isInteractive && isVisible && wrapperRef.current && tooltipRef.current) {
            const wordRect = wrapperRef.current.getBoundingClientRect();
            const tooltipNode = tooltipRef.current;

            // Menggunakan requestAnimationFrame untuk memastikan DOM sudah siap.
            requestAnimationFrame(() => {
                const tooltipRect = tooltipNode.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const margin = 16; // Jarak aman dari tepi layar

                // Posisi default: di tengah kata
                let left = (wordRect.width - tooltipRect.width) / 2;

                // Cek apakah melampaui batas kanan layar
                if (wordRect.left + left + tooltipRect.width > viewportWidth - margin) {
                    left = viewportWidth - wordRect.left - tooltipRect.width - margin;
                }

                // Cek apakah melampaui batas kiri layar
                if (wordRect.left + left < margin) {
                    left = margin - wordRect.left;
                }

                tooltipNode.style.left = `${left}px`;
            });
        }
    }, [isVisible, isInteractive]);


    if (!isInteractive) {
        // Versi non-interaktif: hanya styling font
        return <span className={styles.arabicTextOnly}>{children}</span>;
    }

    // Versi interaktif dengan tooltip
    const handleClick = () => {
        setIsVisible(prev => !prev);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
        }
    };

    const tooltipId = `tooltip-${React.useId()}`;

    return (
        <span className={styles.wrapper} ref={wrapperRef}>
            <span
                className={styles.arabicWord}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                aria-describedby={tooltipId}
                aria-expanded={isVisible}
            >
                {children}
            </span>
            {isVisible && (
                <span
                    id={tooltipId}
                    className={styles.tooltip}
                    role="tooltip"
                    ref={tooltipRef}
                >
                    {tooltip}
                </span>
            )}
        </span>
    );
};

export default AR;

