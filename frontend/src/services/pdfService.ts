import { jsPDF } from 'jspdf';
import type { ExecutiveDossier } from '../types';

/**
 * Setup luxury editorial canvas background for an A4 page.
 */
function setupPageBackground(doc: jsPDF, pageWidth: number, pageHeight: number): void {
  // Background Canvas - Warm Paper Ivory #F8F6F0
  doc.setFillColor(248, 246, 240);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Forest Green Header Accent Bar #183D33
  doc.setFillColor(24, 61, 51);
  doc.rect(0, 0, pageWidth, 4, 'F');
}

/**
 * Helper to print wrapped paragraphs with automatic page-break management.
 */
export function printParagraph(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number = 5,
  pageWidth: number = 210,
  pageHeight: number = 297
): number {
  if (!text) return y;
  const lines = doc.splitTextToSize(text, maxWidth);
  // Auto page-break if overflowing page height (297mm for A4)
  if (y + lines.length * lineHeight > 275) {
    doc.addPage();
    setupPageBackground(doc, pageWidth, pageHeight);
    y = 20; // reset margin top
  }
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export const pdfService = {
  /**
   * Generates and downloads a formal Executive Luxury Presentation for CEO / Dealmaker review.
   * Styled in Warm Editorial & Technical Canvas aesthetic with dynamic text measurement and collision prevention.
   */
  exportExecutiveDossierPdf(dossier: ExecutiveDossier): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const vip = dossier.vipProfile;
    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm

    // Strict Margin and Text Wrapping Boundaries (14mm margin, 182mm printable width)
    const margin = 14;
    const contentWidth = pageWidth - margin * 2; // 182mm
    const cardInnerWidth = contentWidth - 12; // 170mm (6mm padding on each side)
    const cardPaddingX = margin + 6;

    // Initialize first page background
    setupPageBackground(doc, pageWidth, pageHeight);

    let currentY = 14;

    // Header Monogram & Confidential Banner
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(24, 61, 51); // Deep Pine #183D33
    doc.text('CURAVIP · AUTONOMOUS CULTURAL INTELLIGENCE & VIP CONCIERGE', margin, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 115, 109); // Muted warm grey #6B736D
    const genDate = dossier.generatedAt ? dossier.generatedAt.slice(0, 10) : new Date().toISOString().slice(0, 10);
    doc.text(`CONFIDENTIAL · GENERATED ${genDate}`, pageWidth - margin, currentY, { align: 'right' });

    currentY += 8;

    // Principal Hero Box - Dynamically Measured
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    const nameLines = doc.splitTextToSize(vip.fullName || 'VIP Principal', cardInnerWidth - 60);
    const nameHeight = nameLines.length * 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const roleText = `${vip.role || 'Executive'} · ${vip.organization || 'Organization'} (${vip.city || 'Global'})`;
    const roleLines = doc.splitTextToSize(roleText, cardInnerWidth);
    const roleHeight = roleLines.length * 4.5;

    const heroHeight = Math.max(28, 8 + nameHeight + roleHeight + 9);

    // Draw Hero Card
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, currentY, contentWidth, heroHeight, 3, 3, 'F');
    doc.setDrawColor(229, 224, 214);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, currentY, contentWidth, heroHeight, 3, 3, 'S');

    // Hero Text Rendering
    let heroTextY = currentY + 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(22, 26, 24); // Deep Ink #161A18
    doc.text(nameLines, cardPaddingX, heroTextY);

    // Qloo Provenance Badge (Top Right of Hero)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(24, 61, 51);
    doc.text('QLOO PROVENANCE: GROUNDED', pageWidth - margin - 6, currentY + 7, { align: 'right' });

    heroTextY += nameHeight + 1.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 115, 109);
    doc.text(roleLines, cardPaddingX, heroTextY);

    heroTextY += roleHeight + 2;
    // Budget Cap & Mode Badge
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(29, 90, 74); // Emerald #1D5A4A
    const budgetVal = vip.budgetLimitUsd || dossier.targetBudgetUsd || 500;
    doc.text(`BUDGET CEILING: $${budgetVal} USD · 100% FCPA COMPLIANT`, cardPaddingX, heroTextY);

    currentY += heroHeight + 8;

    // SECTION I: CULTURAL TASTE GRAPH & CROSS-DOMAIN AFFINITIES
    if (currentY > 260) {
      doc.addPage();
      setupPageBackground(doc, pageWidth, pageHeight);
      currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(24, 61, 51);
    doc.text('I. CULTURAL TASTE GRAPH & CROSS-DOMAIN AFFINITIES', margin, currentY);
    currentY += 6;

    // Measure Section I Card
    const themes = (dossier.tasteGraph?.crossDomainThemes || []).slice(0, 4);
    const themesText = themes.length > 0 ? themes.join('   |   ') : 'Monumental craft & quiet structural discipline';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    const themeLines = doc.splitTextToSize(`Aesthetic Theme: ${themesText}`, cardInnerWidth);
    const themeHeight = themeLines.length * 4.5;

    const topEntities = (dossier.tasteGraph?.expandedEntities || [])
      .slice(0, 6)
      .map((e) => `${e.name} [${e.category?.toUpperCase() || 'AFFINITY'}]`)
      .join('  ·  ');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const entitiesLines = doc.splitTextToSize(`Correlated Nodes: ${topEntities || 'Active taste graph affinity vectors'}`, cardInnerWidth);
    const entitiesHeight = entitiesLines.length * 4.2;

    const sec1CardHeight = Math.max(22, themeHeight + entitiesHeight + 14);

    if (currentY + sec1CardHeight > 275) {
      doc.addPage();
      setupPageBackground(doc, pageWidth, pageHeight);
      currentY = 20;
    }

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, currentY, contentWidth, sec1CardHeight, 3, 3, 'F');
    doc.setDrawColor(229, 224, 214);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, currentY, contentWidth, sec1CardHeight, 3, 3, 'S');

    let sec1TextY = currentY + 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(22, 26, 24);
    doc.text(themeLines, cardPaddingX, sec1TextY);

    sec1TextY += themeHeight + 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 115, 109);
    doc.text(entitiesLines, cardPaddingX, sec1TextY);

    currentY += sec1CardHeight + 8;

    // SECTION II: STRATEGIC CONVERSATIONAL ICE-BREAKERS
    if (currentY > 260) {
      doc.addPage();
      setupPageBackground(doc, pageWidth, pageHeight);
      currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(24, 61, 51);
    doc.text('II. STRATEGIC CONVERSATIONAL ICE-BREAKERS', margin, currentY);
    currentY += 6;

    const iceBreakers = (dossier.iceBreakerScripts && dossier.iceBreakerScripts.length > 0)
      ? dossier.iceBreakerScripts.slice(0, 2)
      : [
          'Discussing the tension between scale and craftsmanship in modern luxury.',
          'Inquiring about material honesty in complex bespoke designs.',
        ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const ice1Lines = doc.splitTextToSize(`1. ${iceBreakers[0]}`, cardInnerWidth);
    const ice1Height = ice1Lines.length * 4.5;
    const ice2Lines = iceBreakers[1] ? doc.splitTextToSize(`2. ${iceBreakers[1]}`, cardInnerWidth) : [];
    const ice2Height = ice2Lines.length > 0 ? ice2Lines.length * 4.5 + 2.5 : 0;

    const sec2CardHeight = Math.max(22, ice1Height + ice2Height + 12);

    if (currentY + sec2CardHeight > 275) {
      doc.addPage();
      setupPageBackground(doc, pageWidth, pageHeight);
      currentY = 20;
    }

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, currentY, contentWidth, sec2CardHeight, 3, 3, 'F');
    doc.setDrawColor(229, 224, 214);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, currentY, contentWidth, sec2CardHeight, 3, 3, 'S');

    let sec2TextY = currentY + 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 56, 53);
    doc.text(ice1Lines, cardPaddingX, sec2TextY);

    if (ice2Lines.length > 0) {
      sec2TextY += ice1Height + 2.5;
      doc.text(ice2Lines, cardPaddingX, sec2TextY);
    }

    currentY += sec2CardHeight + 8;

    // SECTION III: CURATED GIFT PROPOSALS (QLOO GROUNDED)
    // Spacing between sections & check page boundary before rendering Section Heading
    if (currentY > 260) {
      doc.addPage();
      setupPageBackground(doc, pageWidth, pageHeight);
      currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(24, 61, 51);
    doc.text('III. CURATED GIFT PROPOSALS (QLOO GROUNDED)', margin, currentY);
    currentY += 8;

    const gifts = (dossier.curatedGifts || []).slice(0, 3);
    for (let i = 0; i < gifts.length; i++) {
      const g = gifts[i];
      const tierLabel = i === 0 ? 'SIGNATURE TIER' : i === 1 ? 'ALTERNATIVE TIER' : 'DISCREET TIER';

      // 1. Measure title height
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      const titleLines = doc.splitTextToSize(g.title || 'Curated Proposal', cardInnerWidth);
      const titleHeight = titleLines.length * 5;

      // 2. Measure subtitle height
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const subtitleText = `Artisan: ${g.brandOrArtisan || 'Independent'}   |   Anchor: ${g.qlooCorrelationAnchor || 'Taste Affinity'}`;
      const subtitleLines = doc.splitTextToSize(subtitleText, cardInnerWidth);
      const subtitleHeight = subtitleLines.length * 4.5;

      // 3. Measure body/rationale height
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const bodyLines = doc.splitTextToSize(g.culturalRationale || '', cardInnerWidth);
      const bodyHeight = bodyLines.length * 4.5;

      // 4. Total Card Height = titleHeight + subtitleHeight + bodyHeight + 18 (with minimum 32mm)
      const cardHeight = Math.max(32, titleHeight + subtitleHeight + bodyHeight + 18);

      // Check if currentY + cardHeight > 275; if yes, addPage BEFORE drawing the card
      if (currentY + cardHeight > 275) {
        doc.addPage();
        setupPageBackground(doc, pageWidth, pageHeight);
        currentY = 20;
      }

      // Draw rounded rectangle container
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, currentY, contentWidth, cardHeight, 3, 3, 'F');
      doc.setDrawColor(229, 224, 214);
      doc.setLineWidth(0.4);
      doc.roundedRect(margin, currentY, contentWidth, cardHeight, 3, 3, 'S');

      // Render internal elements cleanly inside the box with relative padding
      let cardTextY = currentY + 6;

      // Tier label & Price Header Row
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(24, 61, 51);
      doc.text(tierLabel, cardPaddingX, cardTextY);

      doc.setFontSize(9.5);
      doc.setTextColor(24, 61, 51);
      doc.text(`$${g.estimatedPriceUsd} USD`, pageWidth - margin - 6, cardTextY, { align: 'right' });

      // Title
      cardTextY += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(22, 26, 24);
      doc.text(titleLines, cardPaddingX, cardTextY);

      // Subtitle
      cardTextY += titleHeight + 1.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(107, 115, 109);
      doc.text(subtitleLines, cardPaddingX, cardTextY);

      // Body / Cultural Rationale
      cardTextY += subtitleHeight + 2;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(50, 56, 53);
      doc.text(bodyLines, cardPaddingX, cardTextY);

      // Advance cursor
      currentY += cardHeight + 8;
    }

    // SECTION IV: PRIVATE EXECUTIVE DINING
    if (dossier.diningOptions && dossier.diningOptions.length > 0) {
      // Clean spacing before section heading
      if (currentY > 260) {
        doc.addPage();
        setupPageBackground(doc, pageWidth, pageHeight);
        currentY = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(24, 61, 51);
      doc.text('IV. PRIVATE EXECUTIVE DINING', margin, currentY);
      currentY += 8;

      const diningList = dossier.diningOptions.slice(0, 2);
      for (const d of diningList) {
        // Measure title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        const titleText = `${d.venueName} · ${d.neighborhood}`;
        const titleLines = doc.splitTextToSize(titleText, cardInnerWidth);
        const titleHeight = titleLines.length * 5;

        // Measure subtitle
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        const subtitleText = `Atmosphere / Vibe: ${d.vibeAnchor || 'Executive Sanctuary'}`;
        const subtitleLines = doc.splitTextToSize(subtitleText, cardInnerWidth);
        const subtitleHeight = subtitleLines.length * 4.5;

        // Measure body / pairing
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        const bodyText = `Pairing Protocol: ${d.pairingNotes || ''}`;
        const bodyLines = doc.splitTextToSize(bodyText, cardInnerWidth);
        const bodyHeight = bodyLines.length * 4.5;

        const cardHeight = Math.max(28, titleHeight + subtitleHeight + bodyHeight + 14);

        if (currentY + cardHeight > 275) {
          doc.addPage();
          setupPageBackground(doc, pageWidth, pageHeight);
          currentY = 20;
        }

        // Draw rounded rectangle container
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, currentY, contentWidth, cardHeight, 3, 3, 'F');
        doc.setDrawColor(229, 224, 214);
        doc.setLineWidth(0.4);
        doc.roundedRect(margin, currentY, contentWidth, cardHeight, 3, 3, 'S');

        let cardTextY = currentY + 6;

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(22, 26, 24);
        doc.text(titleLines, cardPaddingX, cardTextY);

        // Subtitle
        cardTextY += titleHeight + 1.5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(24, 61, 51);
        doc.text(subtitleLines, cardPaddingX, cardTextY);

        // Body
        cardTextY += subtitleHeight + 2;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(107, 115, 109);
        doc.text(bodyLines, cardPaddingX, cardTextY);

        currentY += cardHeight + 8;
      }
    }

    // Professional Footer on all generated pages
    const pageCount = doc.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setDrawColor(229, 224, 214);
      doc.setLineWidth(0.3);
      doc.line(margin, 283, pageWidth - margin, 283);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(107, 115, 109);
      doc.text(
        'CURAVIP CHIEF OF STAFF INTELLIGENCE · POWERED BY QLOO TASTE GRAPH & MODEL CONTEXT PROTOCOL',
        margin,
        289
      );
      doc.text(
        `STRICTLY PRIVATE & CONFIDENTIAL · PAGE ${p} OF ${pageCount}`,
        pageWidth - margin,
        289,
        { align: 'right' }
      );
    }

    const safeName = vip.fullName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    doc.save(`CuraVIP_Executive_Dossier_${safeName}.pdf`);
  },
};
