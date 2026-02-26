
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
      sub: "The Standard",
      title: "The Standard",
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
      sub: "極致標準",
      title: "The Standard",
      intro: "近10年製作手腳模經驗，終生保養服務，澳門唯一高精緻度青銅手腳製作服務",
      commitment: "我們堅信作品要有好品質，先要有好材料。因此無論由取模材料，到後製材料，我們只選用優質的物料，不惜成本。",
      evolution: "Witdo 依然繼續努力，不斷將物料、設備等進行調整升級，定期參加雕塑、藝術課程，提升並學習新技術。",
      pillars: [
        { title: "英國天然海藻膠", desc: "99% 天然海藻成份，英國進口。通過安全認證，環保低敏。", img: ALGINATE_IMAGE },
        { title: "手塗工藝與 10 款色彩", desc: "拒絕廉價噴漆。我們堅持使用進口顏料，只用費時但效果細緻的手塗上漆工藝。", img: FINISHES_IMAGE },
        { title: "天然實木框", desc: "與市面上一般的塑膠框架對比，Witdo 使用的是實木框。\n天然樹木紋理俱獨特的觸感, 質地細膩、色澤柔和。", img: WOOD_IMAGE },
        { title: "Acid Etching 工藝名牌", desc: "好品質需要好材質。Witdo 的金屬名牌和市面上的膠片仿製金屬名牌最大分別是，膠片輕易被折彎及塗層易被刮掉。\n\n另外，Witdo 採用Acid Etching 工藝製作名牌，雖然工序繁瑣，但有別於一般直接在上面鐳射雕刻 / 打印的字體，Acid Etching 工藝製作出來的字體效果十分細緻。", img: METAL_PLATE_IMAGE },
        { title: "優質石膏與特殊處理", desc: "Witdo 的石膏在倒模前也會經過特別處理。這道工序能有效防止作品表面出現大量小氣孔。", img: PLASTER_IMAGE },
        { title: "2mm 厚專業有機玻璃", desc: "Witdo 採用 2mm 有機玻璃而非普通薄膠片，主要是考慮到居家安全性。", img: ACRYLIC_IMAGE },
        { title: "鑲嵌 + 粘貼 雙重技術", desc: "我們同時採用「鑲嵌」與「黏貼」雙重固定技術，確保每一件石膏作品都能極度牢固地裝裱。", img: MOUNTING_IMAGE },
        { title: "136 色優質無酸卡紙", desc: "Witdo 提供多達 136 種色紙供客人選擇。選用符合國際環保 FSC 認證的優質無酸卡紙。", img: PAPER_IMAGE }
      ]
    }
  };

  const t = content[lang];

  return (
    <div className="space-y-32 md:space-y-64">
      {/* Header Spread */}
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-start">
        <div className="lg:w-7/12 space-y-12">
          <div className="space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-linen-800 block">{t.sub}</span>
            <h2 className="text-6xl md:text-8xl lg:text-9xl leading-[0.9] serif italic text-linen-900 tracking-tight">
              {t.title}
            </h2>
          </div>
          <div className="max-w-xl space-y-8">
            <p className="text-xl md:text-2xl text-linen-900 font-light leading-relaxed italic serif">
              {t.intro}
            </p>
          </div>
        </div>
        <div className="lg:w-5/12 pt-4 lg:pt-24">
          <div className="space-y-8 text-linen-800 font-light leading-relaxed text-sm md:text-base italic serif opacity-70 border-l border-linen-200 pl-8">
            <p>{t.commitment}</p>
            <p>{t.evolution}</p>
          </div>
        </div>
      </div>

      {/* Elements Grid */}
      <div className="space-y-32 md:space-y-48">
        <div className="flex items-center gap-6 opacity-20 mb-16">
          <div className="w-12 h-px bg-linen-900"></div>
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-linen-900">The Elements of Craft</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-32 md:gap-y-48">
          {t.pillars.map((pillar, i) => (
            <div key={i} className={`space-y-10 ${i % 2 !== 0 ? 'md:pt-32' : ''}`}>
              <div className="relative aspect-[4/3] overflow-hidden bg-linen-200 group">
                <img 
                  src={pillar.img} 
                  alt={pillar.title} 
                  className="w-full h-full object-cover opacity-90 transition-all duration-[2s] group-hover:scale-110 group-hover:opacity-100"
                />
                <div className="absolute top-6 left-6 text-[9px] font-bold tracking-[0.3em] text-linen-50 mix-blend-difference uppercase">
                  Element 0{i + 1}
                </div>
              </div>
              <div className="space-y-4 max-w-sm">
                <h3 className="text-2xl md:text-3xl serif italic text-linen-900 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-xs md:text-sm text-linen-800 font-light leading-relaxed serif italic opacity-70">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyWitdo;
