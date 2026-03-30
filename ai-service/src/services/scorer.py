def calculate_score(data: dict) -> dict:
    days = data.get("days_since_contact", 999)
    overdue = data.get("overdue_invoices", 0)
    total_inv = data.get("total_invoices", 0)
    touchpoints = data.get("touchpoint_count", 0)
    outcome = data.get("last_outcome", "none")

    # CONTACT SCORE (30% weight)
    if days == 0:
        contact_score = 100
    elif days <= 3:
        contact_score = 90
    elif days <= 7:
        contact_score = 75
    elif days <= 14:
        contact_score = 50
    elif days <= 30:
        contact_score = 25
    else:
        contact_score = 0

    # INVOICE SCORE (25% weight)
    if total_inv == 0:
        invoice_score = 80
    elif overdue == 0:
        invoice_score = 100
    elif overdue == 1:
        invoice_score = 50
    else:
        invoice_score = 0

    # ACTIVITY SCORE (25% weight)
    if touchpoints >= 5:
        activity_score = 100
    elif touchpoints >= 3:
        activity_score = 80
    elif touchpoints >= 1:
        activity_score = 50
    else:
        activity_score = 20

    # OUTCOME SCORE (20% weight)
    if outcome == "positive":
        outcome_score = 100
    elif outcome == "neutral":
        outcome_score = 70
    elif outcome == "negative":
        outcome_score = 30
    elif outcome == "none":
        outcome_score = 60
    else:
        outcome_score = 60

    final_score = round(
        contact_score * 0.30 +
        invoice_score * 0.25 +
        activity_score * 0.25 +
        outcome_score * 0.20
    )

    if final_score >= 70:
        risk_level = "healthy"
    elif final_score >= 40:
        risk_level = "needs_attention"
    else:
        risk_level = "at_risk"

    return {
        "score": final_score,
        "risk_level": risk_level,
        "factors": {
            "contact_score": contact_score,
            "invoice_score": invoice_score,
            "activity_score": activity_score,
            "outcome_score": outcome_score,
            "days_since_contact": days,
            "overdue_invoices": overdue,
            "touchpoint_count": touchpoints
        }
    }
