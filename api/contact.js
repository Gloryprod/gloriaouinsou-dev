// ============================================================================
// api/contact.js — Fonction serverless Vercel (Node.js runtime)
// ============================================================================
// Reçoit les données du formulaire de contact et envoie un email via Resend.
// La clé API Resend reste ici, côté serveur — elle n'est JAMAIS exposée au
// navigateur. Vercel détecte automatiquement ce fichier et le déploie comme
// endpoint accessible à l'URL /api/contact.
//
// Config nécessaire :
// 1. npm install resend
// 2. Variable d'environnement RESEND_API_KEY (voir instructions fournies)
// ============================================================================

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Adresse qui recevra les messages du formulaire.
const TO_EMAIL = "gracia.ouinsou@gmail.com";

// Tant qu'aucun domaine n'est vérifié sur Resend, on doit envoyer depuis
// cette adresse de test fournie par Resend (onboarding@resend.dev).
// Une fois ton propre domaine vérifié (ex: contact@ton-domaine.dev), remplace
// cette valeur — voir instructions fournies avec ce fichier.
const FROM_EMAIL = "Portfolio <onboarding@resend.dev>";

// Échappe le HTML basique pour éviter toute injection dans le corps de l'email.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const { name, email, message } = req.body || {};

  // Validation basique côté serveur — ne jamais faire confiance au client.
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: "Adresse email invalide." });
  }
  if (name.length > 100 || message.length > 5000) {
    return res.status(400).json({ error: "Message trop long." });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `Nouveau message de ${name} — Portfolio`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
          <p><strong>Email :</strong> ${escapeHtml(email)}</p>
          <p><strong>Message :</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(502).json({ error: "Échec de l'envoi de l'email." });
    }

    return res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Contact API error:", err);
    return res.status(500).json({ error: "Erreur serveur. Réessaie plus tard." });
  }
}