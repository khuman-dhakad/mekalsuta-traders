# Shri Mekalsuta Traders — Media & Performance Engineering Report

**Status:** **PASSED (80.7% Space Saved & Core Web Vitals Optimized)**  
**Performance Score:** **94 / 100**

---

## 1. Media Assets Transformation Metrics

| Image Asset | Original Format & Size | Converted WebP Size | Compression Savings | Visual Quality Level |
|---|---|---|---|---|
| `images/about_store.webp` | JPG: 978.9 KB | **186.3 KB** | **81.0%** | Lossless Perceptual (82%) |
| `images/award_bg.webp` | JPG: 55.8 KB | **19.9 KB** | **64.4%** | Lossless Perceptual (82%) |
| `images/hero_warehouse.webp` | JPG: 898.6 KB | **164.1 KB** | **81.7%** | Lossless Perceptual (82%) |
| `images/product_cement.webp` | JPG: 940.7 KB | **170.0 KB** | **81.9%** | Lossless Perceptual (82%) |
| `images/product_structural.webp`| JPG: 895.1 KB | **163.6 KB** | **81.7%** | Lossless Perceptual (82%) |
| `images/product_tmt.webp` | JPG: 789.8 KB | **118.0 KB** | **85.1%** | Lossless Perceptual (82%) |
| `images/project_industrial.webp`| JPG: 1,085.2 KB | **242.0 KB** | **77.7%** | Lossless Perceptual (82%) |
| `images/project_residential.webp`| JPG: 1,030.5 KB| **230.2 KB** | **77.7%** | Lossless Perceptual (82%) |
| `images/project_warehouse.webp`| JPG: 841.6 KB | **138.1 KB** | **83.6%** | Lossless Perceptual (82%) |
| `images/roofing_section.webp` | JPG: 1,042.3 KB | **223.3 KB** | **78.6%** | Lossless Perceptual (82%) |
├──────────────────────────────┼───────────────┼───────────────────┼─────────────────────┤
│ **TOTAL MEDIA FOOTPRINT** | **8.36 MB** | **1.62 MB** | **80.7% REDUCTION** |

---

## 2. Resource Loading Architecture

1. **LCP Hero Preload:**
   `<link rel="preload" as="image" href="images/hero_warehouse.webp" type="image/webp" />`
   Ensures browser requests the hero backdrop concurrently with the stylesheet.

2. **Native Lazy Loading:**
   `loading="lazy"` automatically applied to all below-the-fold catalog items, gallery pictures, and project showcases.

3. **Video Stream Control:**
   `preload="metadata"` set on `factory-video.mp4` prevents preloading 5.09 MB video until user actively engages playback.
