import React, { useState } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react'; // Impor ChevronDown
import styles from './ArabicText.module.css';

/**
 * Komponen untuk menampilkan kutipan teks Arab dengan terjemahan yang bisa disembunyikan.
 * Didesain agar terlihat elegan seperti dalam kitab klasik.
 *
 * @param {object} props
 * @param {string} props.arabicText - Teks utama dalam bahasa Arab.
 * @param {string} props.translation - Terjemahan atau penjelasan dari teks Arab.
 * @param {string} [props.source] - Opsional: Sumber kutipan (misal: Kitab Alfiyah, Bab Kalam).
 */
const ArabicText = ({ arabicText, translation, source }) => {
    const [isTranslationVisible, setIsTranslationVisible] = useState(false);

    const toggleTranslation = () => {
        setIsTranslationVisible(prev => !prev);
    };

    return (
        <div className={styles.container}>
            {/* Teks Arab yang bisa diklik */}
            <div
                className={styles.arabicContent}
                onClick={toggleTranslation}
                role="button"
                tabIndex={0}
                aria-expanded={isTranslationVisible}
                onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && toggleTranslation()}
                title="Klik untuk melihat terjemahan"
            >
                {/* Ikon baru ditambahkan di sini */}
                <ChevronDown
                    className={`${styles.toggleIcon} ${isTranslationVisible ? styles.iconVisible : ''
                        }`}
                    size={20}
                />
                <p>{arabicText}</p>
            </div>

            {/* Kontainer untuk terjemahan dengan animasi */}
            <div
                className={`${styles.translationWrapper} ${isTranslationVisible ? styles.visible : ''
                    }`}
            >
                <div className={styles.translationContent}>
                    <p className={styles.translationText}>{translation}</p>
                    {source && (
                        <div className={styles.sourceInfo}>
                            <BookOpen size={14} />
                            <span>{source}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArabicText;

