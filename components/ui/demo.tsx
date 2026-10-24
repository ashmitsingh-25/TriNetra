import SculptureHero from "@/components/ui/liquid-sculpture-hero"

export default function Demo() {
  return (
    <SculptureHero
      src="/assets/trinetra-logo.png"
      darkSrc="/assets/trinetra-logo.png"
      background="#050505"
      darkBackground="#050505"
      textColor="#e5ff40"
      accentColor="#ff2a8d"
      particleColor="#ff2a8d"
      backdropText="त्रिNETRA"
      brand="त्रिNETRA"
      eyebrow="AI-POWERED UPI FRAUD PREVENTION & SCAM INTELLIGENCE"
      headline={"Stop UPI scams before payment.\nDetect scam waves before they spread."}
      headlineAccent="before they spread."
      body="Real-time UPI recipient verification, QR payload forensics, and autonomous TinyFish web agents scanning the live web for phishing campaigns across India."
      primaryCta={{ label: "Launch Sentinel Scanner", href: "#fraud-check" }}
      secondaryCta={{ label: "View Live Clusters", href: "#campaigns" }}
    />
  )
}
