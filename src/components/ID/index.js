import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import styles from './IndonesianTooltip.module.css';

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
 * Komponen untuk menampilkan kata/frasa Indonesia inline.
 * Jika prop 'tooltip' (berisi teks Arab) diberikan, teks akan menjadi interaktif
 * dan memunculkan tooltip yang posisinya dinamis.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Teks Indonesia yang akan ditampilkan.
 * @param {string} [props.tooltip] - Opsional: Teks Arab untuk tooltip.
 */
const ID = ({ children, tooltip }) => {
    const [isVisible, setIsVisible] = useState(false);
    const wrapperRef = useRef(null);
    const tooltipRef = useRef(null);

    const isInteractive = tooltip && tooltip.trim() !== '';

    useClickOutside(wrapperRef, () => {
        if (isInteractive) {
            setIsVisible(false);
        }
    });

    useLayoutEffect(() => {
        if (isInteractive && isVisible && wrapperRef.current && tooltipRef.current) {
            const wordRect = wrapperRef.current.getBoundingClientRect();
            const tooltipNode = tooltipRef.current;

            requestAnimationFrame(() => {
                const tooltipRect = tooltipNode.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const margin = 16;

                let left = (wordRect.width - tooltipRect.width) / 2;

                if (wordRect.left + left + tooltipRect.width > viewportWidth - margin) {
                    left = viewportWidth - wordRect.left - tooltipRect.width - margin;
                }

                if (wordRect.left + left < margin) {
                    left = margin - wordRect.left;
                }

                tooltipNode.style.left = `${left}px`;
            });
        }
    }, [isVisible, isInteractive]);

    if (!isInteractive) {
        return <span>{children}</span>;
    }

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
                className={styles.interactiveText}
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

export default ID;
