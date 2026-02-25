
import React from 'react';
import { Language } from '../App';

interface WhyWitdoProps {
  lang: Language;
}

const ALGINATE_IMAGE = "https://lh3.googleusercontent.com/d/1FT_7LGlhubuG_ZaMe3VHwcGQcK-B0Xb0";
const FINISHES_IMAGE = "https://lh3.googleusercontent.com/d/1s1tBG2kKyccTyFq-hKDWm85sRHQX_1By";
const WOOD_IMAGE = "https://lh3.googleusercontent.com/d/1lLCzIRDkySTiMpWoZ6PSOVTY7frxeER1";
const METAL_PLATE_IMAGE = "https://lh3.googleusercontent.com/d/1S9OI4Z-HX_FGavSDP3IYT_BeCRFHm3nU";
const PLASTER_IMAGE = "https://lh3.googleusercontent.com/d/1HUNyiwIG4sNRDE_pkN_Kzfq9wSPNs-4J";
const ACRYLIC_IMAGE = "https://lh3.googleusercontent.com/d/1JpvwQy6_bGS1YmoYwS9Nct6a6ao_rBMy";
const MOUNTING_IMAGE = "https://lh3.googleusercontent.com/d/1zlWnka1YFEWeGiWfu30oRMEBNGf7LGFJ";
const PAPER_IMAGE = "https://lh3.googleusercontent.com/d/1agkoQuMttlvnzno94jAD3ppSfE455MSZ";

const WhyWitdo: React.FC<WhyWitdoProps> = ({ lang }) => {
  const content = {
    en: {
      sub: "Our Philosophy",
      title: "Bespoke Excellence",
      intro: "Nearly a decade of expertise in hand and foot casting. We offer lifetime maintenance and are Macau's exclusive provider of high-precision bronze casting services.",
      commitment: "We firmly believe that high-quality work begins with superior materials. From the initial molding to the final finishing, we spare no expense in selecting premium resources to ensure your artwork remains a permanent legacy.",
      evolution: "Witdo is dedicated to continuous evolution. We regularly upgrade our materials and equipment while participating in sculpture and professional art courses. This commitment to mastering new techniques ensures our work maintains the highest industry standards, honoring the trust every client places in us.",
      pillars: [
        { title: "British Alginate", desc: "99% natural seaweed-based powder from the UK. Certified safe, biodegradable, and exceptionally gentle for newborn skin.", img: ALGINATE_IMAGE },
        { title: "10 Signature Finishes", desc: "We reject mass-produced sprays. Each cast is finished using time-intensive hand-painting techniques with imported pigments.", img: FINISHES_IMAGE },
        { title: "Authentic Solid Wood", desc: "Witdo exclusively uses solid wood. Natural timber grain offers a unique tactile experience—fine in texture and soft in tone.", img: WOOD_IMAGE },
        { title: "Acid Etched Metal", desc: "Our nameplates are crafted from real metal using a meticulous Acid Etching process for fine, tactile typography.", img: METAL_PLATE_IMAGE },
        { title: "Premium Stone Plaster", desc: "We employ a specialized de-airing treatment before casting to ensure a flawless, museum-grade surface.", img: PLASTER_IMAGE },
        { title: "2mm Professional Acrylic", desc: "We use 2mm thick high-grade acrylic instead of thin plastic films to protect children and pets from injury.", img: ACRYLIC_IMAGE },
        { title: "Hybrid Mounting Method", desc: "We utilize a sophisticated combination of physical inlay and structural bonding for a secure installation.", img: MOUNTING_IMAGE },
        { title: "Archival Acid-Free Paper", desc: "Offering 136 curated colors, our paper is 100% acid-free and FSC certified for environmental conservation.", img: PAPER_IMAGE }
      ]
    },
    zh: {
      sub: "品牌理念",
      title: "Bespoke Excellence",
      intro: "近10年製作手腳模經驗，終生保養服務，澳門唯一高精緻度青銅手腳製作服務",
      commitment: "我們堅信作品要有好品質，先要有好材料。因此無論由取模材料，到後製材料，我們只選用優質的物料，不惜成本。",
      evolution: "Witdo 依然繼續努力，不斷將物料、設備等進行調整升級，定期參加雕塑、藝術課程，提升並學習新技術。",
      pillars: [
        { title: "英國天然海藻膠", desc: "99% 天然海藻成份，英國進口。通過安全認證，環保低敏。", img: ALGINATE_IMAGE },
        { title: "手塗工藝與 10 款色彩", desc: "拒絕廉價噴漆。我們堅持費時但效果細緻的手塗上漆工藝，採用進口顏料提供 10 種精選成色。", img: FINISHES_IMAGE },
        { title: "天然實木框", desc: "與市面上一般的塑膠框架對比，Witdo 使用的是實木框。天然樹木紋理俱獨特的觸感。", img: WOOD_IMAGE },
        { title: "Acid Etching 工藝名牌", desc: "Witdo 的金屬名牌採用 Acid Etching（酸蝕）工藝製作，字體效果極其細緻且具備層次感。", img: METAL_PLATE_IMAGE },
        { title: "優質石膏與特殊處理", desc: "Witdo 的石膏在倒模前也會經過特別處理。這道工序能有效防止作品表面出現大量小氣孔。", img: PLASTER_IMAGE },
        { title: "2mm 厚專業有機玻璃", desc: "Witdo 採用 2mm 有機玻璃而非普通薄膠片，主要是考慮到居家安全性。", img: ACRYLIC_IMAGE },
        { title: "鑲嵌 + 粘貼 雙重技術", desc: "我們同時採用「鑲嵌」與「黏貼」雙重固定技術，確保每一件石膏作品都能極度牢固地裝裱。", img: MOUNTING_IMAGE },
        { title: "136 色優質無酸卡紙", desc: "Witdo 提供多達 136 種色紙供客人選擇。選用符合國際環保 FSC 認證的優質無酸卡紙。", img: PAPER_IMAGE }
      ]
    }
  };

  const t = content[lang];

  return (
    <div className="space-y-24 md:space-y-40">
      <div className="max-w-4xl space-y-8 md:space-y-12">
        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] text-linen-300 block">{t.sub}</span>
        <h2 
          className="text-5xl md:text-8xl italic leading-tight text-linen-900 tracking-tighter" 
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
        >
          {t.title}
        </h2>
        <div className="space-y-8 md:space-y-12 max-w-3xl border-l border-linen-200 pl-6 md:pl-12 py-4">
          <p className="text-xl md:text-2xl text-linen-900 font-medium leading-relaxed italic serif">
            {t.intro}
          </p>
          <div className="space-y-6 md:space-y-8">
            <p className="text-base md:text-lg text-linen-800 font-light leading-relaxed italic serif opacity-80">
              {t.commitment}
            </p>
            <p className="text-base md:text-lg text-linen-800 font-light leading-relaxed italic serif opacity-80">
              {t.evolution}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-24 md:gap-48">
        {t.pillars.map((pillar, i) => (
          <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center`}>
            <div className="w-full md:w-1/2 aspect-[3/4] overflow-hidden bg-linen-200 shadow-sm">
              <img 
                src={pillar.img} 
                alt={pillar.title} 
                className="w-full h-full object-cover brightness-95 hover:brightness-100 transition-all duration-1000"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-6 md:space-y-10">
              <div className="text-[10px] md:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-linen-300 font-medium">Element 0{i + 1}</div>
              <h3 
                className="text-4xl md:text-6xl italic text-linen-900 tracking-tighter" 
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
              >
                {pillar.title}
              </h3>
              <p className="text-linen-800 font-light leading-relaxed md:leading-loose text-lg md:text-xl max-w-md serif italic opacity-80 whitespace-pre-line">
                {pillar.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyWitdo;
