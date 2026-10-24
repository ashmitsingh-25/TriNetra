import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

const CORPORATE_BRAND_REGISTRY: Record<string, {
  legalEntity: string
  officialDomain: string
  aliases: string[]
  officialVpaHandles: string[]
  registeredBankPartners: string[]
}> = {
  "tata power": {
    legalEntity: "Tata Power Delhi Distribution Limited",
    officialDomain: "tatapower-ddl.com",
    aliases: ["tatapower.com", "tatapower-ddl.com"],
    officialVpaHandles: ["tatapower@icici", "tpddl@hdfcbank", "tatapower@sbi"],
    registeredBankPartners: ["ICICI Bank", "HDFC Bank", "SBI"]
  },
  "bescom": {
    legalEntity: "Bangalore Electricity Supply Company Limited",
    officialDomain: "bescom.karnataka.gov.in",
    aliases: ["bescom.karnataka.gov.in", "bescom.co.in"],
    officialVpaHandles: ["bescom@sbi", "bescom@hdfcbank", "bescom.bills@icici"],
    registeredBankPartners: ["State Bank of India", "Canara Bank", "HDFC Bank"]
  },
  "mahadiscom": {
    legalEntity: "Maharashtra State Electricity Distribution Co. Ltd.",
    officialDomain: "mahadiscom.in",
    aliases: ["mahadiscom.in", "wss.mahadiscom.in"],
    officialVpaHandles: ["mahadiscom@sbi", "mahadiscom@axisbank"],
    registeredBankPartners: ["State Bank of India", "Bank of Maharashtra"]
  },
  "sbi": {
    legalEntity: "State Bank of India",
    officialDomain: "sbi.co.in",
    aliases: ["sbi.co.in", "onlinesbi.sbi", "retail.onlinesbi.sbi"],
    officialVpaHandles: ["sbipayments@sbi", "sbi.cards@sbi", "sbiofficial@sbi"],
    registeredBankPartners: ["State Bank of India"]
  },
  "state bank": {
    legalEntity: "State Bank of India",
    officialDomain: "sbi.co.in",
    aliases: ["sbi.co.in", "onlinesbi.sbi"],
    officialVpaHandles: ["sbipayments@sbi", "sbiofficial@sbi"],
    registeredBankPartners: ["State Bank of India"]
  },
  "hdfc": {
    legalEntity: "HDFC Bank Limited",
    officialDomain: "hdfcbank.com",
    aliases: ["hdfcbank.com", "netbanking.hdfcbank.com"],
    officialVpaHandles: ["hdfcbank@hdfcbank", "billpay@hdfcbank"],
    registeredBankPartners: ["HDFC Bank"]
  },
  "fastag": {
    legalEntity: "National Electronic Toll Collection (NETC / IHMCL)",
    officialDomain: "ihmcl.co.in",
    aliases: ["ihmcl.co.in", "netc.org.in"],
    officialVpaHandles: ["netc.fastag@icici", "fastag.recharge@axisbank"],
    registeredBankPartners: ["ICICI Bank", "Axis Bank", "IDFC First Bank"]
  },
  "swiggy": {
    legalEntity: "Bundl Technologies Private Limited (Swiggy)",
    officialDomain: "swiggy.com",
    aliases: ["swiggy.com"],
    officialVpaHandles: ["swiggy@icici", "swiggypay@yesbank"],
    registeredBankPartners: ["ICICI Bank", "Yes Bank"]
  },
  "starbucks": {
    legalEntity: "Tata Starbucks Private Limited",
    officialDomain: "starbucks.in",
    aliases: ["starbucks.in"],
    officialVpaHandles: ["starbucks@hdfcbank", "starbucksindia@icici"],
    registeredBankPartners: ["HDFC Bank", "ICICI Bank"]
  }
}

export async function POST(req: NextRequest) {
  try {
    const { claimedRecipient = "", destinationVpa = "", destinationUrl = "" } = await req.json()

    const cleanClaimed = claimedRecipient.toLowerCase().trim()
    const cleanVpa = destinationVpa.toLowerCase().trim()

    // 1. Check Supabase vpa_blacklist & intercept_dossiers for known blacklisted fraud
    if (cleanVpa) {
      try {
        const { data: blacklistRecord } = await supabase
          .from("vpa_blacklist")
          .select("*")
          .eq("vpa", cleanVpa)
          .maybeSingle()

        if (blacklistRecord) {
          return NextResponse.json({
            success: true,
            status: "BLACKLISTED",
            isAffiliated: false,
            isBlacklisted: true,
            riskScore: 100,
            claimedBrand: claimedRecipient || "Flagged Payee",
            officialDomain: "Blacklisted Fraud Entry",
            destDomain: "Known Scammer VPA",
            verdict: `CONFIRMED SCAM: Destination VPA '${cleanVpa}' was reviewed and permanently blacklisted in the TriNETRA Analyst Hub.`,
            explanation: `Blacklist Reason: ${blacklistRecord.reason || "Malicious impostor activity confirmed by fraud analysts."}`
          })
        }
      } catch (dbErr) {
        console.warn("[verify-brand] Blacklist query note:", dbErr)
      }
    }

    // 2. Parse destination domain if URL is supplied
    let parsedDestDomain = ""
    if (destinationUrl) {
      try {
        parsedDestDomain = new URL(destinationUrl.startsWith("http") ? destinationUrl : `https://${destinationUrl}`).hostname.toLowerCase()
      } catch {
        parsedDestDomain = destinationUrl.toLowerCase()
      }
    }

    // 3. Match against Corporate Brand Registry
    const matchedBrandKey = Object.keys(CORPORATE_BRAND_REGISTRY).find(b => cleanClaimed.includes(b))

    if (!matchedBrandKey) {
      return NextResponse.json({
        success: true,
        status: "UNREGISTERED_ENTITY",
        isAffiliated: false,
        isBlacklisted: false,
        riskScore: 35,
        claimedBrand: claimedRecipient || "Private Payee",
        officialDomain: "N/A (Individual / Small Merchant)",
        destDomain: parsedDestDomain || "N/A",
        verdict: "UNREGISTERED: Beneficiary is not an indexed corporate brand. Verify directly before transferring funds.",
        explanation: "No official corporate merchant registry found for this payee name."
      })
    }

    const brand = CORPORATE_BRAND_REGISTRY[matchedBrandKey]

    // 4. Domain Spoofing Check
    let isDomainAffiliated = false
    if (parsedDestDomain) {
      isDomainAffiliated = brand.aliases.some(alias => parsedDestDomain.endsWith(alias) || parsedDestDomain === alias)
    }

    // 5. VPA affiliation check
    const isVpaAffiliated = cleanVpa ? brand.officialVpaHandles.some(v => cleanVpa.includes(v)) : true

    // Result verdict
    if (parsedDestDomain && !isDomainAffiliated) {
      // Domain spoofing detected!
      return NextResponse.json({
        success: true,
        status: "IMPOSTOR_FLAGGED",
        isAffiliated: false,
        isBlacklisted: false,
        riskScore: 95,
        claimedBrand: brand.legalEntity,
        officialDomain: brand.officialDomain,
        destDomain: parsedDestDomain,
        verdict: `DOMAIN SPOOFING DETECTED: The link claims to be '${brand.legalEntity}', but destination domain '${parsedDestDomain}' does NOT match the verified domain '${brand.officialDomain}'.`,
        explanation: `Official ${brand.legalEntity} operates strictly at '${brand.officialDomain}'. The checked link is an unverified external site.`
      })
    }

    if (cleanVpa && !isVpaAffiliated) {
      return NextResponse.json({
        success: true,
        status: "IMPOSTOR_FLAGGED",
        isAffiliated: false,
        isBlacklisted: false,
        riskScore: 92,
        claimedBrand: brand.legalEntity,
        officialDomain: brand.officialDomain,
        destDomain: parsedDestDomain || brand.officialDomain,
        verdict: `IMPOSTOR DETECTED: The payee claims to be ${brand.legalEntity}, but payment routes to an unauthorized retail handle ('${destinationVpa}').`,
        explanation: `Official ${matchedBrandKey.toUpperCase()} payments only route to: ${brand.officialVpaHandles.join(", ")}.`
      })
    }

    return NextResponse.json({
      success: true,
      status: "VERIFIED",
      isAffiliated: true,
      isBlacklisted: false,
      riskScore: 5,
      claimedBrand: brand.legalEntity,
      officialDomain: brand.officialDomain,
      destDomain: parsedDestDomain || brand.officialDomain,
      verdict: `VERIFIED AUTHENTIC: Destination matches official corporate records for ${brand.legalEntity}.`,
      explanation: `Verified corporate domain '${brand.officialDomain}' matches claimed organization.`
    })
  } catch (err: any) {
    console.error("[verify-brand] Error:", err)
    return NextResponse.json({
      success: false,
      error: err.message || "Failed to verify brand."
    }, { status: 500 })
  }
}
