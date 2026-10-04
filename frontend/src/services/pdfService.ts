import { jsPDF } from 'jspdf';
import type { ExecutiveDossier } from '../types';

export const pdfService = {
  /**
   * Generates and downloads a formal 1-Page Executive Luxury Presentation for CEO / Dealmaker review.
   * Styled in Warm Editorial & Technical Canvas aesthetic.
   */
  exportExecutiveDossierPdf(dossier: ExecutiveDossier): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const vip = dossier.vipProfile;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;

    // Background Canvas - Warm Paper Ivory #F8F6F0
    doc.setFillColor(248, 246, 240);
    doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');

    // Top Forest Green Header Accent Bar #183D33
    doc.setFillColor(24, 61, 51);
    doc.rect(0, 0, pageWidth, 4, 'F');

    let y = 14;

    // Header Monogram & Confidential Banner
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(24, 61, 51); // Deep Pine #183D33
    doc.text('CURAVIP · AUTONOMOUS CULTURAL INTELLIGENCE & VIP CONCIERGE', margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 115, 109); // Muted warm grey #6B736D
    doc.text(`CONFIDENTIAL · GENERATED ${dossier.generatedAt.slice(0, 10)}`, pageWidth - margin, y, { align: 'right' });

    y += 8;

    // Principal Hero Box
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'F');

    // Warm hairline border on hero #E5E0D6
    doc.setDrawColor(229, 224, 214);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(22, 26, 24); // Deep Ink #161A18
    doc.text(vip.fullName, margin + 6, y + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(107, 115, 109);
    doc.text(`${vip.role} · ${vip.organization} (${vip.city})`, margin + 6, y + 16);

    // Budget Cap & Mode Badge
    doc.setFontSize(8.5);
    doc.setTextColor(29, 90, 74); // Emerald #1D5A4A
    doc.text(`BUDGET CEILING: $${vip.budgetLimitUsd || 500} USD · 100% FCPA COMPLIANT`, margin + 6, y + 22);

    doc.setTextColor(24, 61, 51);
    doc.setFont('helvetica', 'bold');
    doc.text(`QLOO PROVENANCE: GROUNDED`, pageWidth - margin - 6, y + 9, { align: 'right' });

    y += 32;

    // Section 1: Cultural Taste Graph Anchors
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(24, 61, 51);
    doc.text('I. CULTURAL TASTE GRAPH & CROSS-DOMAIN AFFINITIES', margin, y);

    y += 4;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');
    doc.setDrawColor(229, 224, 214);
    doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'S');

    const themesText = (dossier.tasteGraph.crossDomainThemes || []).slice(0, 3).join('   |   ');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(22, 26, 24);
    doc.text(`Aesthetic Theme: ${themesText || 'Monumental craft & quiet structural discipline'}`, margin + 5, y + 7, { maxWidth: contentWidth - 10 });

    const topEntities = (dossier.tasteGraph.expandedEntities || [])
      .slice(0, 6)
      .map((e) => `${e.name} [${e.category.toUpperCase()}]`)
      .join('  ·  ');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 115, 109);
    doc.text(`Correlated Nodes: ${topEntities}`, margin + 5, y + 15, { maxWidth: contentWidth - 10 });

    y += 28;

    // Section 2: Strategic Ice-Breakers
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(24, 61, 51);
    doc.text('II. STRATEGIC CONVERSATIONAL ICE-BREAKERS', margin, y);

    y += 4;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');
    doc.setDrawColor(229, 224, 214);
    doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'S');

    const ice1 = dossier.iceBreakerScripts[0] || 'Discussing the tension between scale and craftsmanship.';
    const ice2 = dossier.iceBreakerScripts[1] || 'Inquiring about material honesty in complex modern designs.';

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 56, 53); // Charcoal #323835
    doc.text(`1. ${ice1}`, margin + 5, y + 7, { maxWidth: contentWidth - 10 });
    doc.text(`2. ${ice2}`, margin + 5, y + 17, { maxWidth: contentWidth - 10 });

    y += 30;

    // Section 3: Curated Gift Proposals
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(24, 61, 51);
    doc.text('III. CURATED GIFT PROPOSALS (QLOO GROUNDED)', margin, y);

    y += 5;
    const gifts = dossier.curatedGifts.slice(0, 3);
    for (let i = 0; i < gifts.length; i++) {
      const g = gifts[i];
      const tierLabel = i === 0 ? 'SIGNATURE TIER' : i === 1 ? 'ALTERNATIVE TIER' : 'DISCREET TIER';

      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'F');
      doc.setDrawColor(229, 224, 214);
      doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(24, 61, 51);
      doc.text(tierLabel, margin + 5, y + 6);

      doc.setFontSize(9.5);
      doc.setTextColor(22, 26, 24);
      doc.text(g.title, margin + 38, y + 6, { maxWidth: contentWidth - 85 });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(24, 61, 51);
      doc.text(`$${g.estimatedPriceUsd}`, pageWidth - margin - 5, y + 6, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(107, 115, 109);
      doc.text(`Artisan: ${g.brandOrArtisan}  |  Anchor: ${g.qlooCorrelationAnchor}`, margin + 5, y + 12);

      doc.setTextColor(50, 56, 53);
      doc.text(g.culturalRationale, margin + 5, y + 18, { maxWidth: contentWidth - 10 });

      y += 26;
    }

    y += 2;

    // Section 4: Executive Dining
    if (dossier.diningOptions && dossier.diningOptions.length > 0) {
      const d = dossier.diningOptions[0];
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(24, 61, 51);
      doc.text('IV. PRIVATE EXECUTIVE DINING', margin, y);

      y += 5;
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
      doc.setDrawColor(229, 224, 214);
      doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(22, 26, 24);
      doc.text(`${d.venueName} · ${d.neighborhood}`, margin + 5, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(24, 61, 51);
      doc.text(`Vibe: ${d.vibeAnchor}`, margin + 5, y + 12);

      doc.setTextColor(107, 115, 109);
      doc.text(`Pairing Protocol: ${d.pairingNotes}`, margin + 5, y + 17, { maxWidth: contentWidth - 10 });

      y += 24;
    }

    // Footer Sign-Off
    doc.setDrawColor(229, 224, 214);
    doc.line(margin, 280, pageWidth - margin, 280);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(107, 115, 109);
    doc.text('CURAVIP CHIEF OF STAFF INTELLIGENCE · POWERED BY QLOO TASTE GRAPH & MODEL CONTEXT PROTOCOL', margin, 286);
    doc.text('STRICTLY PRIVATE & CONFIDENTIAL', pageWidth - margin, 286, { align: 'right' });

    const safeName = vip.fullName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    doc.save(`CuraVIP_Executive_Dossier_${safeName}.pdf`);
  },
};
