import { NextRequest, NextResponse } from "next/server"

const CORPORATE_BRAND_REGISTRY: Record<string, {
  legalEntity: string
  officialDomain: string
  officialVpaHandles: string[]
  registeredBankPartners: string[]
}> = {
  "tata power": {
    legalEntity: "Tata Power Delhi Distribution Limited",
    officialDomain: "tatapower.com",
    officialVpaHandles: ["tatapower@icici", "tpddl@hdfcbank", "tatapower@sbi"],
    registeredBankPartners: ["ICICI Bank", "HDFC Bank", "SBI"]
  },
  "bescom": {
    legalEntity: "Bangalore Electricity Supply Company Limited",
    officialDomain: "bescom.karnataka.gov.in",
    officialVpaHandles: ["bescom@sbi", "bescom@hdfcbank", "bescom.bills@icici"],
    registeredBankPartners: ["State Bank of India", "Canara Bank", "HDFC Bank"]
  },
  "sbi": {
    legalEntity: "State Bank of India",
    officialDomain: "onlinesbi.sbi",
    officialVpaHandles: ["sbi.cards@sbi", "sbiofficial@sbi"],
    registeredBankPartners: ["State Bank of India"]
  },
  "fastag": {
    legalEntity: "National Electronic Toll Collection (NETC / IHMCL)",
    officialDomain: "ihmcl.co.in",
    officialVpaHandles: ["netc.fastag@icici", "fastag.recharge@axisbank"],
    registeredBankPartners: ["ICICI Bank", "Axis Bank", "IDFC First Bank"]
  },
  "swiggy": {
    legalEntity: "Bundl Technologies Private Limited (Swiggy)",
    officialDomain: "swiggy.com",
    officialVpaHandles: ["swiggy@icici", "swiggypay@yesbank"],
    registeredBankPartners: ["ICICI Bank", "Yes Bank"]
  },
  "starbucks": {
    legalEntity: "Tata Starbucks Private Limited",
    officialDomain: "starbucks.in",
    officialVpaHandles: ["starbucks@hdfcbank", "starbucksindia@icici"],
    registeredBankPartners: ["HDFC Bank", "ICICI Bank"]
  }
}

export async function POST(req: NextRequest) {
  try {
    const { claimedRecipient = "", destinationVpa = "", destinationUrl = "" } = await req.json()

    const cleanClaimed = claimedRecipient.toLowerCase().trim()
    const cleanVpa = destinationVpa.toLowerCase().trim()

    let matchedBrandKey = Object.keys(CORPORATE_BRAND_REGISTRY).find(b => cleanClaimed.includes(b))

    if (!matchedBrandKey) {
      return NextResponse.json({
        success: true,
        status: "UNREGISTERED_ENTITY",
        isAffiliated: false,
        claimedBrand: claimedRecipient || "Private Payee",
        officialDomain: "N/A (Individual / Small Merchant)",
        destDomain: destinationUrl ? new URL(destinationUrl.startsWith("http") ? destinationUrl : `https://${destinationUrl}`).hostname : "N/A",
        verdict: "UNREGISTERED: Beneficiary is not an indexed corporate brand. Proceed with standard peer-to-peer verification.",
        explanation: "No official corporate merchant registry found for this payee name."
      })
    }

    const brand = CORPORATE_BRAND_REGISTRY[matchedBrandKey]
    const isVpaAffiliated = brand.officialVpaHandles.some(v => cleanVpa.includes(v))

    let isDomainAffiliated = true
    let parsedDestDomain = ""
    if (destinationUrl) {
      try {
        parsedDestDomain = new URL(destinationUrl.startsWith("http") ? destinationUrl : `https://${destinationUrl}`).hostname.toLowerCase()
        isDomainAffiliated = parsedDestDomain.endsWith(brand.officialDomain)
      } catch {
        isDomainAffiliated = false
      }
    }

    const isFullyAffiliated = isVpaAffiliated && isDomainAffiliated

    if (isFullyAffiliated) {
      return NextResponse.json({
        success: true,
        status: "VERIFIED",
        isAffiliated: true,
        claimedBrand: brand.legalEntity,
        officialDomain: brand.officialDomain,
        destDomain: parsedDestDomain || brand.officialDomain,
        verdict: "VERIFIED AUTHENTIC: Destination VPA is an authorized corporate handle registered to " + brand.legalEntity,
        explanation: `Destination '${destinationVpa}' matches official corporate banking records.`
      })
    }

    return NextResponse.json({
      success: true,
      status: "IMPOSTOR_FLAGGED",
      isAffiliated: false,
      claimedBrand: brand.legalEntity,
      officialDomain: brand.officialDomain,
      destDomain: parsedDestDomain || "Non-Corporate Retail Account",
      verdict: "IMPOSTOR DETECTED: The payee claims to be " + brand.legalEntity + ", but payment routes to an unauthorized retail handle ('" + destinationVpa + "').",
      explanation: `Official ${matchedBrandKey.toUpperCase()} payments only route to: ${brand.officialVpaHandles.join(", ")}.`
    })
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || "Failed to verify brand."
    }, { status: 500 })
  }
}
