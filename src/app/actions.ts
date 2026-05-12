"use server";

import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { AuditContext, AuditResult } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy";
const supabase = createClient(supabaseUrl, supabaseKey);

const anthropicApiKey = process.env.ANTHROPIC_API_KEY || "";
const resendApiKey = process.env.RESEND_API_KEY || "";

const anthropic = anthropicApiKey ? new Anthropic({ apiKey: anthropicApiKey }) : null;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function saveAuditAction(context: AuditContext, result: AuditResult, email: string) {
  try {
    let summaryText = "Your AI stack is looking good. We identified some redundancies. Please review your personalized dashboard for the detailed breakdown and next steps.";

    // 1. Generate Summary with Anthropic
    if (anthropic) {
      try {
        const response = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 150,
          temperature: 0.7,
          system: "You are an expert cloud and AI infrastructure financial analyst. Review the audit data and write a strict 100-word personalized summary explaining their setup, where they are overspending, and the benefit of the recommendations. Be professional and encouraging. Mention SpendSense if they have massive savings.",
          messages: [
            {
              role: "user",
              content: JSON.stringify({ context, result })
            }
          ]
        });
        const contentBlock = response.content[0];
        if (contentBlock.type === 'text') {
            summaryText = contentBlock.text;
        }
      } catch (e) {
        console.error("Anthropic API failed, falling back to template", e);
      }
    }

    // 2. Save to Supabase
    let auditId = `mock-id-${Date.now()}`;
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const { data: auditData, error: auditError } = await supabase
          .from('audits')
          .insert({
            data: context,
            savings_calculated: result.totalSavings,
            summary: summaryText
          })
          .select('id')
          .single();

        if (auditError) {
          console.error("Supabase audit insert error", auditError);
        } else {
          auditId = auditData.id;
          const { error: leadError } = await supabase
            .from('leads')
            .insert({
              email,
              audit_id: auditId
            });
          if (leadError) console.error("Supabase lead insert error", leadError);
        }
      } catch (dbError) {
        console.error("Failed to connect to Supabase", dbError);
      }
    }
    
    // Fallback: If DB insert failed or Supabase not configured, use Base64 stateless ID as the "mock" ID so sharing still works
    if (auditId.startsWith('mock-id')) {
       const stateToSave = { context, summary: summaryText };
       auditId = 'b64-' + Buffer.from(JSON.stringify(stateToSave)).toString('base64url');
    }

    // 3. Send Email with Resend
    let emailStatus = "not_configured";
    if (resend) {
      try {
        const { data: emailData, error: emailError } = await resend.emails.send({
          from: 'SpendSense Audit <onboarding@resend.dev>',
          to: [email],
          subject: `Your AI Spend Audit - $${result.totalSavings}/mo in savings found!`,
          html: `
            <h2>SpendSense AI Audit</h2>
            <p>We found <strong>$${result.totalSavings}/mo</strong> in savings!</p>
            <p>${summaryText}</p>
            <br/>
            <p><em>Check your local dashboard for full results.</em></p>
          `
        });

        if (emailError) {
          console.error("Resend returned error:", JSON.stringify(emailError));
          emailStatus = `failed: ${emailError.message}`;
        } else {
          console.log("Email sent successfully:", JSON.stringify(emailData));
          emailStatus = "sent";
        }
      } catch (exceptionError: any) {
        console.error("Resend threw exception:", exceptionError?.message);
        emailStatus = `exception: ${exceptionError?.message}`;
      }
    }

    console.log(`Email status for ${email}: ${emailStatus}`);
    // Always return the id so the user can still get the link even if email fails
    return { success: true, id: auditId, emailStatus };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Failed to process" };
  }
}

export async function getAuditAction(id: string) {
  try {
    // If it's a stateless base64 ID fallback
    if (id.startsWith('b64-')) {
       const b64 = id.replace('b64-', '');
       const decoded = Buffer.from(b64, 'base64url').toString('utf-8');
       const data = JSON.parse(decoded);
       return { success: true, data };
    }

    // Otherwise, fetch from Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return { success: false, error: "Audit not found" };
      }
      return { success: true, data: { context: data.data, summary: data.summary } };
    }
    
    return { success: false, error: "Supabase not configured" };
  } catch (err) {
    console.error("Failed to get audit", err);
    return { success: false, error: "Audit not found or invalid link" };
  }
}
