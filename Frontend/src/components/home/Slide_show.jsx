import React, { useState, useEffect } from 'react';

const images = [
  {
    src: 'https://storage.googleapis.com/miz_hydrology/Frontend_Data/Home_Tab/AGU-Fall-Meeting-2023.JPG',
    alt: "AGU Fall Meeting 2023"
  },
  {
    src: 'https://storage.googleapis.com/miz_hydrology/Frontend_Data/Home_Tab/Cocao-farm-Ghana-by-Aloysius.JPG',
    alt: "Cocoa farm Ghana"
  },
  {
    src: 'https://storage.googleapis.com/miz_hydrology/Frontend_Data/Home_Tab/Fall-2023-by-Aloysius.JPG',
    alt: "Fall 2023"
  },
  { src: 'https://storage.googleapis.com/miz_hydrology/Frontend_Data/Home_Tab/Fall-mums-by-Aloysius.JPG', alt: "Fall mums" },
  { src: 'https://storage.googleapis.com/miz_hydrology/Frontend_Data/Home_Tab/Fall-picnic-2023-by-Aloysius.JPG', alt: "Fall picnic 2023" },
  { src: 'https://storage.googleapis.com/miz_hydrology/Frontend_Data/Home_Tab/Golden-Gate-Bridge-by-Aloysius.JPG', alt: "Golden Gate Bridge" },
  { src: 'https://storage.googleapis.com/miz_hydrology/Frontend_Data/Home_Tab/Lake-Malawi_by-Maggie-Munthali.jpg', alt: "Lake Malawi" },
  { src: 'https://storage.googleapis.com/miz_hydrology/Frontend_Data/Home_Tab/River-Ghana-by-Aloysius.JPG', alt: "River Ghana" },
  { src: 'https://storage.googleapis.com/miz_hydrology/Frontend_Data/Home_Tab/Summer-MU-2023-01-by-Aloysius.JPG', alt: "Summer MU 2023" }
];

function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [current, isTransitioning]);

  return (
    <div style={{ 
      position: 'relative', 
      height: '600px', 
      width: '100%', 
      overflow: 'hidden',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    }}>
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img.src}
          alt={img.alt}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: idx === current ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            pointerEvents: 'none'
          }}
        />
      ))}
      
      {/* Navigation buttons */}
      <button 
        onClick={prevSlide}
        style={{
          position: 'absolute',
          top: '50%',
          left: '20px',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          fontSize: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transition: 'background-color 0.3s',
          outline: 'none'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.8)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)'}
      >
        &lt;
      </button>
      
      <button 
        onClick={nextSlide}
        style={{
          position: 'absolute',
          top: '50%',
          right: '20px',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          fontSize: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transition: 'background-color 0.3s',
          outline: 'none'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.8)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)'}
      >
        &gt;
      </button>
      
      {/* Dots indicator */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 10
      }}>
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (isTransitioning) return;
              setIsTransitioning(true);
              setCurrent(idx);
              setTimeout(() => setIsTransitioning(false), 500);
            }}
            style={{
              width: '12px',
              height: '18px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: idx === current ? 'white' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              padding: 0,
              transition: 'background-color 0.3s'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;